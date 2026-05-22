import { useState } from 'react'
import { FileText, Plus, Trash2, Search } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { generateId, getRandomColor, timeAgo } from '../utils/helpers'

export default function Notes() {
  const { state, dispatch } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [search, setSearch] = useState('')

  const addNote = () => {
    if (!title.trim() || !content.trim()) return
    dispatch({
      type: 'ADD_NOTE',
      payload: { id: generateId(), title: title.trim(), content: content.trim(), date: new Date().toISOString(), color: getRandomColor() },
    })
    setTitle(''); setContent(''); setShowForm(false)
  }

  const filtered = state.notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/10">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h1 className="page-title text-slate-100">Notes</h1>
              <p className="page-subtitle">{state.notes.length} notes saved</p>
            </div>
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="btn-primary">
          <Plus size={18} /> New Note
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input type="text" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)}
          className="input pl-11 py-3" />
      </div>

      {showForm && (
        <div className="stat-card p-5 mb-6 animate-slide-up">
          <input type="text" placeholder="Note title..." value={title} onChange={e => setTitle(e.target.value)}
            className="input mb-3 font-medium" autoFocus />
          <textarea placeholder="Write your note..." value={content} onChange={e => setContent(e.target.value)} rows={4}
            className="input mb-3 resize-none" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setShowForm(false); setTitle(''); setContent('') }}
              className="btn-ghost text-sm">Cancel</button>
            <button onClick={addNote} disabled={!title.trim() || !content.trim()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">Save</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 stat-card">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-500 text-sm">{search ? 'No notes match your search' : 'No notes yet. Create your first note!'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((note) => (
            <div key={note.id}
              className="card-glow group relative stat-card p-5 hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-black/5" style={{ backgroundColor: note.color }}>
                  <FileText size={16} className="text-gray-600" />
                </div>
                <button onClick={() => dispatch({ type: 'DELETE_NOTE', payload: note.id })}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 transition-all duration-200" aria-label="Delete note">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
              <h3 className="font-semibold text-slate-100 text-sm mb-1.5 line-clamp-2">{note.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{note.content}</p>
              <p className="text-[10px] text-slate-500 mt-3">{timeAgo(note.date)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
