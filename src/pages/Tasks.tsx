import { useState } from 'react'
import { CheckSquare, Plus, Trash2, Circle, CheckCircle } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { generateId } from '../utils/helpers'

const priorities = [
  { value: 'low' as const, label: 'Low', color: 'bg-slate-700/30 text-slate-400' },
  { value: 'medium' as const, label: 'Medium', color: 'bg-amber-900/20 text-amber-400' },
  { value: 'high' as const, label: 'High', color: 'bg-red-900/20 text-red-400' },
]

export default function Tasks() {
  const { state, dispatch } = useApp()
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')

  const addTask = () => {
    if (!text.trim()) return
    dispatch({ type: 'ADD_TASK', payload: { id: generateId(), text: text.trim(), done: false, priority } })
    setText('')
  }

  const filtered = state.tasks.filter(t => {
    if (filter === 'active') return !t.done
    if (filter === 'done') return t.done
    return true
  })

  const doneCount = state.tasks.filter(t => t.done).length
  const activeCount = state.tasks.length - doneCount

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/10">
          <CheckSquare size={20} className="text-white" />
        </div>
        <div>
          <h1 className="page-title text-slate-100">Tasks</h1>
          <p className="page-subtitle">{activeCount} active &middot; {doneCount} done</p>
        </div>
      </div>

      <div className="stat-card p-4 sm:p-5 mb-5">
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input type="text" placeholder="Add a new task..." value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            className="input flex-1" />
          <button onClick={addTask} disabled={!text.trim()}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
            <Plus size={18} /> Add
          </button>
        </div>
        <div className="flex gap-2">
          {priorities.map(p => (
            <button key={p.value} onClick={() => setPriority(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${priority === p.value ? `${p.color} ring-2 ring-primary-500/50` : p.color}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {state.tasks.length > 0 && (
        <div className="flex items-center gap-1 mb-4 bg-slate-800/30 rounded-xl p-1 w-fit">
          {(['all', 'active', 'done'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                filter === f ? 'bg-slate-700/50 shadow-sm text-slate-200' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {f} {f === 'all' ? `(${state.tasks.length})` : f === 'active' ? `(${activeCount})` : `(${doneCount})`}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 stat-card">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <CheckSquare size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-500 text-sm">{filter !== 'all' ? `No ${filter} tasks` : 'No tasks yet. Add your first task!'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task, i) => (
            <div key={task.id}
              className="group flex items-center gap-3 stat-card px-4 py-3 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}>
              <button onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })} className="flex-shrink-0 transition-transform active:scale-90" aria-label="Toggle task">
                {task.done ? <CheckCircle size={20} className="text-emerald-400" /> : <Circle size={20} className="text-slate-600 hover:text-slate-400" />}
              </button>
              <span className={`flex-1 text-sm ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.text}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorities.find(p => p.value === task.priority)?.color}`}>{task.priority}</span>
              <button onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 transition-all duration-200" aria-label="Delete task">
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
