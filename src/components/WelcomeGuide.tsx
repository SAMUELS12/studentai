import { useState } from 'react'
import { X, Bot, FileText, CheckSquare, Timer, BarChart3, Sparkles, ArrowRight, Layers, Target, Brain } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

const slides = [
  {
    icon: Sparkles,
    title: 'Welcome to StudyPortal!',
    desc: 'Your AI-powered study companion. Everything you need to study smarter, all in one place.',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    desc: 'Ask any study question and get instant answers, tips, and personalized advice 24/7.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: FileText,
    title: 'Notes & Tasks',
    desc: 'Capture ideas with rich notes and stay organized with priority-based task management.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Layers,
    title: 'Flashcards & Quizzes',
    desc: 'Create digital flashcards and test yourself with dynamic quizzes on any subject.',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    icon: Timer,
    title: 'Pomodoro Timer',
    desc: 'Boost focus with structured study sessions. Track your time and build a streak.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics & More',
    desc: 'Track your progress with analytics, habits, and generate personalized study plans.',
    gradient: 'from-cyan-500 to-blue-600',
  },
]

export default function WelcomeGuide() {
  const { state, dispatch } = useApp()
  const [slide, setSlide] = useState(0)

  if (!state.newUser) return null

  const current = slides[slide]
  const isLast = slide === slides.length - 1

  const dismiss = () => dispatch({ type: 'DISMISS_WELCOME' })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-sidebar border border-slate-700/30 rounded-3xl shadow-2xl shadow-black/40 w-full max-w-md overflow-hidden animate-scale-in">
        <div className="relative p-6 sm:p-8 text-center">
          <button onClick={dismiss} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors">
            <X size={18} className="text-slate-400" />
          </button>

          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${current.gradient} flex items-center justify-center mx-auto mb-4 shadow-xl shadow-black/20 ring-1 ring-white/10`}>
            <current.icon size={28} className="text-white" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">{current.title}</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{current.desc}</p>

          <div className="flex items-center justify-center gap-2 mt-6">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-indigo-500' : 'w-1.5 bg-slate-700 hover:bg-slate-600'}`}
              />
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            {!isLast && (
              <button onClick={dismiss} className="flex-1 px-4 py-2.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-colors">
                Skip
              </button>
            )}
            <button
              onClick={isLast ? dismiss : () => setSlide(s => s + 1)}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25`}
            >
              {isLast ? 'Get Started' : 'Next'}
              {!isLast && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
