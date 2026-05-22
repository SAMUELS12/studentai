import { useState } from 'react'
import { CheckCircle2, Circle, Plus, Trash2, Target, Flame } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { generateId } from '../utils/helpers'

const habitIcons = ['📚', '💪', '🧘', '🎯', '✍️', '🧠', '🏃', '💧', '🥗', '😴', '🎵', '🌱', '📝', '⏰', '🧹']

export default function Habits() {
  const { state, dispatch } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📚')
  const today = new Date().toISOString().split('T')[0]

  const weekDays: { label: string; date: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    weekDays.push({ label: d.toLocaleDateString('en', { weekday: 'short' }), date: d.toISOString().split('T')[0] })
  }

  const addHabit = () => {
    if (!name.trim()) return
    dispatch({ type: 'ADD_HABIT', payload: { id: generateId(), name: name.trim(), icon, logs: {} } })
    setName(''); setShowForm(false)
  }

  const doneToday = state.habits.filter(h => h.logs[today]).length

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/10">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h1 className="page-title text-slate-100">Habits</h1>
            <p className="page-subtitle">{doneToday}/{state.habits.length} done today</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="btn-primary bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-500/20">
          <Plus size={18} /> New Habit
        </button>
      </div>

      {showForm && (
        <div className="stat-card p-5 mb-6 animate-slide-up">
          <input type="text" placeholder="Habit name..." value={name} onChange={e => setName(e.target.value)}
            className="input mb-3" autoFocus />
          <p className="text-xs text-slate-500 mb-2">Pick an icon:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {habitIcons.map(ic => (
              <button key={ic} onClick={() => setIcon(ic)}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${icon === ic ? 'bg-emerald-900/30 ring-2 ring-emerald-500 scale-110' : 'bg-slate-800/50 hover:bg-slate-700/50'}`}>
                {ic}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setShowForm(false); setName('') }}
              className="btn-ghost text-sm">Cancel</button>
            <button onClick={addHabit} disabled={!name.trim()}
              className="btn-primary bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed">Add Habit</button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 bg-slate-800/30 rounded-xl p-3 border border-slate-700/20">
        <Flame size={14} className="text-orange-400" />
        <span>Today's progress: {doneToday}/{state.habits.length || 1} habits checked</span>
        <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${state.habits.length ? (doneToday / state.habits.length) * 100 : 0}%` }} />
        </div>
      </div>

      {state.habits.length === 0 ? (
        <div className="text-center py-20 stat-card">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <Target size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-500 text-sm">No habits yet. Start tracking your daily habits!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {state.habits.map(habit => {
            const done = !!habit.logs[today]
            return (
              <div key={habit.id}
                className="flex items-center gap-3 stat-card px-4 py-3"
              >
                <button onClick={() => dispatch({ type: 'TOGGLE_HABIT', payload: habit.id })}
                  className="flex-shrink-0 transition-transform active:scale-90">
                  {done
                    ? <CheckCircle2 size={24} className="text-emerald-400" />
                    : <Circle size={24} className="text-slate-600 hover:text-slate-400" />
                  }
                </button>
                <span className="text-xl flex-shrink-0">{habit.icon}</span>
                <span className={`flex-1 text-sm ${done ? 'line-through text-slate-500' : 'text-slate-200'}`}>{habit.name}</span>
                <div className="flex items-center gap-0.5">
                  {weekDays.map(day => {
                    const isDone = !!habit.logs[day.date]
                    return (
                      <span key={day.date} className={`w-6 h-6 rounded-md text-[9px] flex items-center justify-center font-medium transition-all
                        ${isDone ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'bg-slate-800/50 text-slate-600'}`}>
                        {isDone ? '✓' : day.label[0]}
                      </span>
                    )
                  })}
                </div>
                <button onClick={() => dispatch({ type: 'DELETE_HABIT', payload: habit.id })}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 hover:opacity-100">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
