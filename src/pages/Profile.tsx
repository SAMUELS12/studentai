import { User, Mail, Calendar, BookOpen, CheckSquare, MessageSquare, TrendingUp, Trash2, Timer, Zap, ArrowRight } from 'lucide-react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { state, dispatch } = useApp()
  const { user } = useAuth()

  const stats = [
    { icon: BookOpen, label: 'Notes', value: state.notes.length, gradient: 'from-amber-500 to-amber-600' },
    { icon: CheckSquare, label: 'Done', value: state.tasks.filter(t => t.done).length, gradient: 'from-emerald-500 to-emerald-600' },
    { icon: MessageSquare, label: 'Conversations', value: state.conversations.length, gradient: 'from-primary-500 to-primary-600' },
    { icon: Timer, label: 'Sessions', value: state.sessions.filter(s => s.type === 'focus').length, gradient: 'from-violet-500 to-violet-600' },
    { icon: TrendingUp, label: 'Tasks', value: state.tasks.length, gradient: 'from-rose-500 to-rose-600' },
    { icon: Zap, label: 'Focus (min)', value: state.focusMinutes, gradient: 'from-cyan-500 to-cyan-600' },
  ]

  const handleReset = async () => {
    if (window.confirm('This will delete all your data. Are you sure?')) {
      if (user) {
        try {
          await deleteDoc(doc(db, 'users', user.id, 'data', 'appState'))
        } catch {}
      }
      window.location.reload()
    }
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="relative overflow-hidden stat-card p-6 sm:p-8 mb-6 text-center">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary-500/10 to-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/10 ring-2 ring-white/10">
            <User size={36} className="text-primary-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-100">{user?.name || 'Student'}</h1>
          <p className="text-sm text-slate-500 mt-1">studious learner</p>
          <div className="flex justify-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Mail size={12} /> {user?.email || 'student@study.ai'}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> Joined today</span>
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-900/30 to-amber-800/20 rounded-full text-xs font-medium text-amber-400 border border-amber-500/20">
            Fire {state.streak} day streak
          </div>
        </div>
      </div>

      <h2 className="section-label mb-3">Statistics</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(({ icon: Icon, label, value, gradient }) => (
          <div key={label} className="stat-card p-3 sm:p-4 text-center">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-2 shadow-lg shadow-black/20 ring-1 ring-white/10`}>
              <Icon size={16} className="text-white" />
            </div>
            <p className="text-lg font-bold text-slate-100">{value}</p>
            <p className="text-[10px] text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="stat-card p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">Your Study Rhythm</h2>

        <div className="flex items-center gap-3 p-4 bg-indigo-900/20 rounded-xl mb-3 border border-indigo-500/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-black/20 ring-1 ring-white/10 flex-shrink-0">
            <Timer size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-indigo-400 font-medium mb-0.5">Focus session</p>
            <p className="text-lg font-bold text-slate-100">{state.pomodoroDuration} minutes</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-emerald-900/20 rounded-xl mb-4 border border-emerald-500/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-black/20 ring-1 ring-white/10 flex-shrink-0">
            <Timer size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-emerald-400 font-medium mb-0.5">Break time</p>
            <p className="text-lg font-bold text-slate-100">{state.breakDuration} minutes</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 bg-slate-800/30 rounded-xl px-4 py-3 border border-slate-700/20">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Focus {state.pomodoroDuration}m</span>
          </div>
          <ArrowRight size={14} className="text-slate-600" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Break {state.breakDuration}m</span>
          </div>
          <ArrowRight size={14} className="text-slate-600" />
          <span className="text-slate-500">Repeat</span>
        </div>

        <button onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-400
                     hover:bg-red-900/20 rounded-xl transition-all duration-200 border border-red-900/30">
          <Trash2 size={16} /> Reset All Data
        </button>
      </div>

    </div>
  )
}
