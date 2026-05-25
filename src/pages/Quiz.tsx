import { useState } from 'react'
import { Brain, ArrowLeft, CheckCircle2, XCircle, RefreshCw, Sparkles, ChevronRight, Loader2, Trash2 } from 'lucide-react'
import { useApp, QuizQuestion } from '../contexts/AppContext'
import { generateId } from '../utils/helpers'
import { callAiApi } from '../utils/aiConfig'

function parseAiQuestions(text: string): { question: string; options: string[]; correctIndex: number }[] {
  try {
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) {
      return parsed.slice(0, 8).map((q: any) => ({
        question: q.question || '',
        options: Array.isArray(q.options) ? q.options.slice(0, 4) : [],
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
      })).filter(q => q.question && q.options.length === 4)
    }
  } catch {}
  const lines = text.split('\n').filter(l => l.trim())
  const questions: { question: string; options: string[]; correctIndex: number }[] = []
  let current: any = null
  for (const line of lines) {
    const trimmed = line.replace(/^[\d.]+[\)\.]\s*/, '').trim()
    if (trimmed.startsWith('"question"') || trimmed.startsWith('question') || trimmed.match(/^['"]?question['"]?\s*[:=]/i)) {
      if (current?.question) questions.push(current)
      current = { question: '', options: [], correctIndex: 0 }
      const val = trimmed.replace(/^['"]?question['"]?\s*[:=]\s*['"]?/i, '').replace(/['"],?\s*$/, '')
      if (val) current.question = val
    } else if (current && (trimmed.startsWith('"options"') || trimmed.startsWith('options') || trimmed.match(/^['"]?options['"]?\s*[:=]/i))) {
      const match = trimmed.match(/\[(.*)\]/)
      if (match) {
        current.options = match[1].split(',').map((o: string) => o.trim().replace(/^['"]|['"]$/g, ''))
      }
    } else if (current && (trimmed.startsWith('"correctIndex"') || trimmed.startsWith('correctIndex') || trimmed.match(/^['"]?correctIndex['"]?\s*[:=]/i))) {
      const num = parseInt(trimmed.replace(/[^0-9]/g, ''))
      if (!isNaN(num)) current.correctIndex = num
    } else if (current && trimmed && !trimmed.match(/^[{\[\]},]/)) {
      if (!current.question) current.question = trimmed
      else if (current.options.length < 4 && trimmed.length < 100) current.options.push(trimmed.replace(/^['"]|['"]$/g, ''))
    }
  }
  if (current?.question) questions.push(current)
  return questions.filter(q => q.question && q.options.length === 4)
}

export default function QuizPage() {
  const { state, dispatch } = useApp()
  const [subject, setSubject] = useState('')
  const [count, setCount] = useState(5)
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!subject.trim()) return
    setGenerating(true)
    setError('')
    try {
      const prompt = `Generate a competitive-level multiple choice quiz on the subject "${subject.trim()}". 
Return ONLY a valid JSON array of exactly ${count} question objects. Each object must have:
- "question": a challenging, exam-style question
- "options": an array of exactly 4 answer strings
- "correctIndex": the 0-based index of the correct answer in the options array

Make the questions genuinely difficult and thought-provoking — suitable for competitive exams, not basic trivia. 
Return ONLY the JSON array, no other text. Example format:
[{"question": "What is the time complexity of binary search?", "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"], "correctIndex": 1}]`

      const response = await callAiApi([{ role: 'user', content: prompt }])
      let questions = parseAiQuestions(response)

      if (questions.length < count) {
        const retryResponse = await callAiApi([{ role: 'user', content: `Return a JSON array of ${count} quiz objects about "${subject.trim()}" with keys: question, options (array of 4), correctIndex (0-3). No other text.` }])
        questions = parseAiQuestions(retryResponse)
      }

      if (questions.length === 0) throw new Error(`AI returned: "${response.slice(0, 200)}" — couldn't parse. Try again.`)

      const quizQuestions: QuizQuestion[] = questions.slice(0, count).map(q => ({
        id: generateId(),
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        userAnswer: null,
      }))

      const quiz = {
        id: generateId(),
        title: `${subject.trim()} Quiz`,
        subject: subject.trim(),
        questions: quizQuestions,
        score: 0,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      dispatch({ type: 'ADD_QUIZ', payload: quiz })
      setActiveQuiz(quiz.id)
      setCurrentQ(0)
      setShowResults(false)
      setSubject('')
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz. Check your API key.')
    } finally {
      setGenerating(false)
    }
  }

  const active = state.quizzes.find(q => q.id === activeQuiz)

  const answer = (idx: number) => {
    if (!active) return
    dispatch({ type: 'ANSWER_QUESTION', payload: { quizId: active.id, questionId: active.questions[currentQ].id, answerIndex: idx } })
    if (currentQ < active.questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setShowResults(true)
    }
  }

  const retake = async (quizId: string) => {
    const quiz = state.quizzes.find(q => q.id === quizId)
    if (!quiz) return
    setGenerating(true)
    try {
      const prompt = `Generate a competitive-level multiple choice quiz on "${quiz.subject}". 
Return ONLY a valid JSON array of exactly ${quiz.questions.length} question objects. Each object must have:
- "question": a challenging, exam-style question
- "options": an array of exactly 4 answer strings
- "correctIndex": the 0-based index of the correct answer

Make them genuinely difficult. Return ONLY the JSON array, no other text.`

      const response = await callAiApi([{ role: 'user', content: prompt }])
      let questions = parseAiQuestions(response)

      if (questions.length < quiz.questions.length) {
        const retryResponse = await callAiApi([{ role: 'user', content: `Generate exactly ${quiz.questions.length} challenging MCQs about "${quiz.subject}". JSON array only.` }])
        questions = parseAiQuestions(retryResponse)
      }

      if (questions.length === 0) throw new Error('Could not generate valid questions')

      const newQuestions: QuizQuestion[] = questions.slice(0, quiz.questions.length).map(q => ({
        id: generateId(),
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        userAnswer: null,
      }))

      const newQuiz = { ...quiz, id: generateId(), questions: newQuestions, score: 0, completed: false, createdAt: new Date().toISOString() }
      dispatch({ type: 'ADD_QUIZ', payload: newQuiz })
      setActiveQuiz(newQuiz.id)
      setCurrentQ(0)
      setShowResults(false)
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz.')
    } finally {
      setGenerating(false)
    }
  }

  if (active && active.questions.length > 0) {
    const answered = active.questions.filter(q => q.userAnswer !== null).length
    const correct = active.questions.filter(q => q.userAnswer === q.correctIndex).length

    if (showResults || answered === active.questions.length) {
      const pct = Math.round((correct / active.questions.length) * 100)
      return (
        <div className="animate-fade-in">
          <div className="text-center py-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20 ring-1 ring-white/10">
              {pct >= 70 ? <CheckCircle2 size={40} className="text-white" /> : <XCircle size={40} className="text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-1">{active.title}</h2>
            <p className="text-slate-400 text-sm mb-4">{active.subject}</p>
            <div className="text-5xl font-bold text-slate-100 mb-2">{correct}/{active.questions.length}</div>
            <p className="text-lg text-slate-400 mb-6">{pct}% — {pct >= 90 ? 'Excellent!' : pct >= 70 ? 'Good job!' : pct >= 50 ? 'Keep practicing' : 'Review and try again'}</p>
            {generating ? (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-6">
                <Loader2 size={16} className="animate-spin" /> Generating new questions...
              </div>
            ) : (
              <div className="space-y-3 max-w-xl mx-auto text-left mb-6">
                {active.questions.map((q, i) => (
                  <div key={q.id} className={`p-4 rounded-xl border ${q.userAnswer === q.correctIndex ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-red-900/10 border-red-500/20'}`}>
                    <p className="text-sm text-slate-200 mb-1">{i + 1}. {q.question}</p>
                    <p className="text-xs text-slate-500">Your answer: <span className={q.userAnswer === q.correctIndex ? 'text-emerald-400' : 'text-red-400'}>{q.options[q.userAnswer ?? 0]}</span></p>
                    {q.userAnswer !== q.correctIndex && <p className="text-xs text-emerald-400">Correct answer: {q.options[q.correctIndex]}</p>}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center gap-3">
              <button onClick={() => { setActiveQuiz(null); setShowResults(false); setCurrentQ(0) }}
                className="btn-secondary">Back to quizzes</button>
              <button onClick={() => retake(active.id)} disabled={generating}
                className="btn-primary disabled:opacity-40">
                <RefreshCw size={16} className={generating ? 'animate-spin' : ''} /> New Questions
              </button>
            </div>
          </div>
        </div>
      )
    }

    const q = active.questions[currentQ]
    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setActiveQuiz(null)} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft size={16} /> Quit
          </button>
          <span className="text-xs text-slate-500 font-medium">Question {currentQ + 1} of {active.questions.length}</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentQ) / active.questions.length) * 100}%` }} />
        </div>
        <div className="stat-card p-6 sm:p-8 mb-4">
          <p className="text-xs text-indigo-400 font-medium mb-2">Question {currentQ + 1}</p>
          <p className="text-lg font-semibold text-slate-100 mb-6">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button key={idx} onClick={() => answer(idx)}
                className="w-full text-left p-4 rounded-xl border border-slate-700/30
                           hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-200 group">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-800/50 text-xs font-medium text-slate-400 group-hover:bg-indigo-900/30 group-hover:text-indigo-400 mr-3 transition-all">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm text-slate-200">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20 ring-1 ring-white/10">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h1 className="page-title text-slate-100">AI Quiz Generator</h1>
            <p className="page-subtitle">{state.quizzes.length} quizzes taken</p>
          </div>
        </div>
      </div>

      <div className="stat-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-200 mb-3">Create a New Quiz</h2>
        <p className="text-xs text-slate-500 mb-3">Enter any subject or topic — AI generates competitive-level questions instantly.</p>
        {error && (
          <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">
            {error}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input type="text" placeholder="e.g., quantum mechanics, world war 2, python, organic chemistry..." value={subject} onChange={e => setSubject(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !generating && generate()}
            disabled={generating}
            className="input flex-1 disabled:opacity-50" />
          <select value={count} onChange={e => setCount(Number(e.target.value))}
            className="input w-auto" disabled={generating}>
            {[3, 5, 8].map(n => <option key={n} value={n}>{n} questions</option>)}
          </select>
        </div>
        <button onClick={generate} disabled={!subject.trim() || generating}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40">
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {generating ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>

      {state.quizzes.length > 0 && (
        <div>
          <h2 className="section-label mb-3">Past Quizzes</h2>
          <div className="space-y-2">
            {state.quizzes.slice(0, 10).map(quiz => {
              const answered = quiz.questions.filter(q => q.userAnswer !== null).length
              const correct = quiz.questions.filter(q => q.userAnswer === q.correctIndex).length
              const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0
              return (
                <div key={quiz.id}
                  onClick={() => { setActiveQuiz(quiz.id); setCurrentQ(0); setShowResults(true) }}
                  className="flex items-center gap-3 stat-card px-4 py-3 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                    <Brain size={16} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">{quiz.title}</p>
                    <p className="text-xs text-slate-500">{quiz.subject} &middot; {quiz.questions.length} questions</p>
                  </div>
                  {answered > 0 && (
                    <div className="text-right">
                      <p className={`text-sm font-bold ${pct >= 70 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</p>
                      <p className="text-[10px] text-slate-500">{correct}/{answered}</p>
                    </div>
                  )}
                  <button onClick={e => { e.stopPropagation(); dispatch({ type: 'DELETE_QUIZ', payload: quiz.id }) }}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100" aria-label="Delete quiz">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
