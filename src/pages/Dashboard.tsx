import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, CheckSquare, Bot, Timer, TrendingUp, BookOpen,
  Target, Clock, BarChart3, Calendar, Layers, Brain, Sparkles,
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'

function StatCard({ icon: Icon, label, value, gradient, to }: {
  icon: React.ElementType; label: string; value: string | number; gradient: string; to: string
}) {
  return (
    <Link
      to={to}
      className="card-glow group relative overflow-hidden bg-card/90 rounded-2xl border border-slate-700/30 p-4 sm:p-5 
                 hover:shadow-xl hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="relative flex items-center gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${gradient} flex items-center justify-center shadow-lg shadow-black/20 ring-1 ring-white/10`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-100">{value}</p>
        </div>
      </div>
    </Link>
  )
}

function TipCarousel() {
  const tips = [
    { text: "Use the Pomodoro Technique: 25 min study, 5 min break", icon: Timer },
    { text: "Active recall > Passive reading for memory retention", icon: BookOpen },
    { text: "Teach concepts to others to deepen understanding", icon: Target },
    { text: "Take handwritten notes for better comprehension", icon: FileText },
    { text: "Review material within 24 hours to improve recall", icon: Clock },
  ]
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setIdx((i) => (i + 1) % tips.length), 6000)
    return () => clearInterval(interval)
  }, [])

  const { text, icon: Icon } = tips[idx]

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-indigo-800/20 border border-indigo-500/10 shadow-lg shadow-indigo-500/5">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="relative flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
          <Icon size={20} className="text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-indigo-400" />
            <h3 className="font-semibold text-sm text-slate-200">Study Tip</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed animate-fade-in">{text}</p>
        </div>
      </div>
      <div className="flex gap-1.5 mt-4 justify-center">
        {tips.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-indigo-400' : 'w-1.5 bg-slate-600/50 hover:bg-slate-500/50'}`} />
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { state } = useApp()
  const { user } = useAuth()
  const totalTasks = state.tasks.length
  const doneTasks = state.tasks.filter((t) => t.done).length
  const productivity = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
  const today = new Date().toISOString().split('T')[0]
  const habitsDone = state.habits.filter(h => h.logs[today]).length
  const focusToday = state.sessions
    .filter(s => s.date.startsWith(new Date().toISOString().split('T')[0]) && s.type === 'focus')
    .reduce((sum, s) => sum + s.duration, 0)
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{greeting}, {user?.name || 'Student'}</h1>
          <p className="text-sm text-slate-400 mt-1">Here's your study overview</p>
        </div>
      </div>

      <TipCarousel />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <StatCard icon={FileText} label="Notes" value={state.notes.length} gradient="bg-gradient-to-br from-amber-500 to-orange-600" to="/app/notes" />
        <StatCard icon={CheckSquare} label="Tasks" value={`${doneTasks}/${totalTasks}`} gradient="bg-gradient-to-br from-emerald-500 to-emerald-600" to="/app/tasks" />
        <StatCard icon={TrendingUp} label="Productivity" value={`${productivity}%`} gradient="bg-gradient-to-br from-violet-500 to-violet-600" to="/app/analytics" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
              <Clock size={15} className="text-primary-400" />
            </div>
            <h3 className="font-semibold text-slate-200 text-sm">Quick Actions</h3>
          </div>
          <div className="space-y-0.5">
            {[
              { to: '/app/notes', icon: BookOpen, label: 'Write a note', color: 'text-amber-400' },
              { to: '/app/tasks', icon: Target, label: 'Add a task', color: 'text-emerald-400' },
              { to: '/app/pomodoro', icon: Timer, label: 'Study session', color: 'text-primary-400' },
              { to: '/app/ai-assistant', icon: Bot, label: 'Ask AI', color: 'text-violet-400' },
              { to: '/app/flashcards', icon: Layers, label: 'Study flashcards', color: 'text-indigo-400' },
              { to: '/app/habits', icon: CheckSquare, label: 'Track habits', color: 'text-emerald-400' },
              { to: '/app/quiz', icon: Brain, label: 'Take a quiz', color: 'text-purple-400' },
              { to: '/app/study-plan', icon: Calendar, label: 'Plan studies', color: 'text-cyan-400' },
            ].map(({ to, icon: Icon, label, color }) => (
              <Link key={to} to={to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/40 text-sm text-slate-400 hover:text-slate-200 transition-all duration-200 group"
              >
                <Icon size={16} className={`${color} transition-transform duration-200 group-hover:scale-110`} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
              <Target size={15} className="text-emerald-400" />
            </div>
            <h3 className="font-semibold text-slate-200 text-sm">Today's Tasks</h3>
          </div>
          {state.tasks.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No tasks yet</p>
          ) : (
            <div className="space-y-2">
              {state.tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-2.5 text-sm px-1">
                  <div className={`w-2 h-2 rounded-full ${task.done ? 'bg-emerald-400' : task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-slate-600'}`} />
                  <span className={`${task.done ? 'line-through text-slate-500' : 'text-slate-300'} truncate`}>{task.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/20 flex items-center justify-center">
              <BarChart3 size={15} className="text-violet-400" />
            </div>
            <h3 className="font-semibold text-slate-200 text-sm">Stats</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Focus today</span>
                <span className="font-medium text-slate-300">{focusToday} min</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (focusToday / 120) * 100)}%` }} />
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Streak</span>
                <span className="font-bold text-slate-100">{state.streak} days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Notes</span>
                <span className="font-bold text-slate-100">{state.notes.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Habits done</span>
                <span className="font-bold text-slate-100">{habitsDone}/{state.habits.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Tasks done</span>
                <span className="font-bold text-slate-100">{doneTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
