import { useState, useRef } from 'react'
import { Calendar, Plus, Trash2, Sparkles, Clock, BookOpen, Target, Sunrise, Sun, Moon, Copy, Check, X } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { generateId, generateStudyPlan } from '../utils/helpers'

export default function StudyPlan() {
  const { state, dispatch } = useApp()
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [subjectInput, setSubjectInput] = useState('')
  const subjectRef = useRef<HTMLInputElement>(null)
  const [hoursPerDay, setHoursPerDay] = useState(4)
  const [daysUntilExam, setDaysUntilExam] = useState(30)
  const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon' | 'evening'>('morning')
  const [generatedPlan, setGeneratedPlan] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const addSubject = () => {
    const subj = subjectInput.trim()
    if (subj && !selectedSubjects.includes(subj)) {
      setSelectedSubjects(prev => [...prev, subj])
      setSubjectInput('')
      subjectRef.current?.focus()
    }
  }

  const removeSubject = (subj: string) => {
    setSelectedSubjects(prev => prev.filter(s => s !== subj))
  }

  const generate = () => {
    if (selectedSubjects.length === 0) return
    const plan = generateStudyPlan(selectedSubjects, hoursPerDay, daysUntilExam, preferredTime)
    setGeneratedPlan(plan)
    dispatch({
      type: 'ADD_PLAN',
      payload: { id: generateId(), title: `${selectedSubjects.join(', ')} — ${daysUntilExam}d`, plan, date: new Date().toISOString() },
    })
  }

  const copyPlan = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {}
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/10">
          <Calendar size={20} className="text-white" />
        </div>
        <div>
          <h1 className="page-title text-slate-100">Study Plan Generator</h1>
          <p className="page-subtitle">Create personalized study schedules</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="stat-card p-5">
            <h2 className="font-semibold text-slate-200 text-sm mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-cyan-400" /> Subjects
            </h2>
            <div className="flex gap-2 mb-3">
              <input
                ref={subjectRef}
                type="text"
                value={subjectInput}
                onChange={e => setSubjectInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubject() } }}
                placeholder="Type a subject..."
                className="input flex-1"
              />
              <button onClick={addSubject} disabled={!subjectInput.trim()}
                className="btn-primary !px-3 disabled:opacity-40 disabled:cursor-not-allowed">
                <Plus size={16} />
              </button>
            </div>
            {selectedSubjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedSubjects.map(s => (
                  <span key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg
                               bg-indigo-900/30 text-indigo-300 border border-indigo-500/20">
                    {s}
                    <button onClick={() => removeSubject(s)} className="hover:bg-indigo-800/50 rounded p-0.5 transition-colors" aria-label={`Remove ${s}`}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {selectedSubjects.length === 0 && (
              <p className="text-xs text-slate-500">Add subjects you want to study</p>
            )}
          </div>

          <div className="stat-card p-5">
            <h2 className="font-semibold text-slate-200 text-sm mb-4 flex items-center gap-2">
              <Target size={16} className="text-cyan-400" /> Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1.5">Hours per day</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={1} max={10} value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))}
                    className="flex-1 accent-indigo-500" />
                  <span className="text-sm font-semibold text-slate-200 w-8 text-right">{hoursPerDay}h</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1.5">Days until exam</label>
                <input type="number" min={1} max={365} value={daysUntilExam} onChange={e => setDaysUntilExam(Math.max(1, Math.min(365, Number(e.target.value))))}
                  className="input" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1.5">Preferred study time</label>
                <div className="flex gap-2">
                  {[
                    { value: 'morning' as const, icon: Sunrise, label: 'Morning' },
                    { value: 'afternoon' as const, icon: Sun, label: 'Afternoon' },
                    { value: 'evening' as const, icon: Moon, label: 'Evening' },
                  ].map(({ value, icon: Icon, label }) => (
                    <button key={value} onClick={() => setPreferredTime(value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        preferredTime === value
                          ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/20'
                          : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:border-slate-600/50'
                      }`}>
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={generate} disabled={selectedSubjects.length === 0}
              className="btn-primary w-full mt-4 disabled:opacity-40 disabled:cursor-not-allowed">
              <Sparkles size={16} /> Generate Study Plan
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          {generatedPlan ? (
            <div className="stat-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                  <Sparkles size={16} className="text-primary-400" /> Generated Plan
                </h2>
                <div className="flex gap-1">
                  <button onClick={() => copyPlan(generatedPlan, 'current')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-all" aria-label="Copy">
                    {copiedId === 'current' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                  <button onClick={() => setGeneratedPlan('')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all" aria-label="Clear">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed bg-page rounded-xl p-4 border border-slate-700/30">{generatedPlan}</pre>
            </div>
          ) : state.plans.length > 0 ? (
            <div>
              <h2 className="section-label mb-3">Past Plans</h2>
              <div className="space-y-3">
                {state.plans.map(p => (
                  <div key={p.id}
                    className="stat-card p-4 cursor-pointer group"
                    onClick={() => setGeneratedPlan(p.plan)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-cyan-400" />
                        <h3 className="font-medium text-slate-200 text-sm">{p.title}</h3>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={e => { e.stopPropagation(); copyPlan(p.plan, p.id) }}
                          className="p-1.5 rounded-lg hover:bg-slate-800/50 transition-all" aria-label="Copy">
                          {copiedId === p.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-slate-400" />}
                        </button>
                        <button onClick={e => { e.stopPropagation(); dispatch({ type: 'DELETE_PLAN', payload: p.id }) }}
                          className="p-1.5 rounded-lg hover:bg-red-900/20 transition-all" aria-label="Delete">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.plan.slice(0, 150)}...</p>
                    <p className="text-[10px] text-slate-500 mt-2">{new Date(p.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="stat-card p-10 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm max-w-xs">Add your subjects and set preferences, then generate a personalized study plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
