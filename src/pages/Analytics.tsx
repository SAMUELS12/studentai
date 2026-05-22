import { useMemo } from 'react'
import { BarChart3, TrendingUp, Clock, Zap, Flame } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { getWeekDates, getActivityData } from '../utils/helpers'

function MiniBar({ value, max, label, idx }: { value: number; max: number; label: string; idx: number }) {
  const height = max > 0 ? Math.max(8, (value / max) * 100) : 8
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <span className="text-[10px] font-medium text-slate-400 tabular-nums">{value}m</span>
      <div className="w-full h-24 sm:h-28 bg-slate-800/40 rounded-lg relative overflow-hidden" style={{ maxWidth: 32 }}>
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-500 to-primary-400 rounded-lg transition-all duration-700 ease-out shadow-sm"
          style={{ height: `${height}%`, animationDelay: `${idx * 100}ms` }}
        />
      </div>
      <span className="text-[10px] text-slate-500">{label.slice(5, 10)}</span>
    </div>
  )
}

export default function Analytics() {
  const { state } = useApp()
  const weekDates = useMemo(() => getWeekDates(), [])

  const activityData = useMemo(() => {
    const data = getActivityData(state.sessions, 7)
    return data.sort((a, b) => a.date.localeCompare(b.date))
  }, [state.sessions])

  const maxMinutes = useMemo(() => Math.max(...activityData.map(d => d.minutes), 1), [activityData])
  const totalFocusWeek = activityData.reduce((s, d) => s + d.minutes, 0)
  const avgDaily = Math.round(totalFocusWeek / 7)

  const focusToday = state.sessions
    .filter(s => s.date.startsWith(new Date().toISOString().split('T')[0]) && s.type === 'focus')
    .reduce((sum, s) => sum + s.duration, 0)
  const taskCompletion = state.tasks.length > 0
    ? Math.round((state.tasks.filter(t => t.done).length / state.tasks.length) * 100)
    : 0

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20 ring-1 ring-white/10">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="page-title text-slate-100">Analytics</h1>
          <p className="page-subtitle">Track your study habits</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { icon: Clock, label: 'Focus this week', value: `${totalFocusWeek}m`, gradient: 'from-primary-500 to-primary-600' },
          { icon: TrendingUp, label: 'Daily average', value: `${avgDaily}m`, gradient: 'from-emerald-500 to-emerald-600' },
          { icon: Flame, label: 'Streak', value: `${state.streak} days`, gradient: 'from-orange-500 to-orange-600' },
          { icon: Zap, label: 'Tasks done', value: `${taskCompletion}%`, gradient: 'from-violet-500 to-violet-600' },
        ].map(({ icon: Icon, label, value, gradient }) => (
          <div key={label} className="stat-card p-4">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 shadow-lg shadow-black/20 ring-1 ring-white/10`}>
              <Icon size={16} className="text-white" />
            </div>
            <p className="text-lg font-bold text-slate-100">{value}</p>
            <p className="text-[10px] text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="stat-card p-5 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-slate-200 text-sm">Weekly Focus Time</h2>
          <span className="text-xs text-slate-500">Last 7 days</span>
        </div>
        <div className="flex items-end justify-between gap-1 sm:gap-2 px-1">
          {activityData.map((d, i) => (
            <MiniBar key={d.date} value={d.minutes} max={maxMinutes} label={d.date} idx={i} />
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="stat-card p-5">
          <h2 className="font-semibold text-slate-200 text-sm mb-4">Task Overview</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Completion</span>
                <span className="font-medium text-slate-300">{taskCompletion}%</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-700"
                  style={{ width: `${taskCompletion}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Total tasks</span>
              <span className="font-semibold text-slate-100">{state.tasks.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Completed</span>
              <span className="font-semibold text-emerald-400">{state.tasks.filter(t => t.done).length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Pending</span>
              <span className="font-semibold text-amber-400">{state.tasks.filter(t => !t.done).length}</span>
            </div>
          </div>
        </div>

        <div className="stat-card p-5">
          <h2 className="font-semibold text-slate-200 text-sm mb-4">Study Sessions</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Today's focus</span>
                <span className="font-medium text-slate-300">{focusToday} min</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (focusToday / 120) * 100)}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Total sessions</span>
              <span className="font-semibold text-slate-100">{state.sessions.filter(s => s.type === 'focus').length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Pomodoro duration</span>
              <span className="font-semibold text-slate-100">{state.pomodoroDuration} min</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Notes created</span>
              <span className="font-semibold text-slate-100">{state.notes.length}</span>
            </div>
          </div>
        </div>
      </div>

      {state.sessions.length === 0 && (
        <div className="text-center py-12 mt-4">
          <p className="text-sm text-slate-500">Start using the Pomodoro timer to see your study analytics here!</p>
        </div>
      )}
    </div>
  )
}
