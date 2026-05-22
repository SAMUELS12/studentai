import { useState } from 'react'
import { Layers, Plus, Trash2, ArrowLeft, ChevronRight, Sparkles, BookOpen } from 'lucide-react'
import { useApp, FlashcardDeck } from '../contexts/AppContext'
import { generateId } from '../utils/helpers'

function CreateDeck({ onBack }: { onBack: () => void }) {
  const { dispatch } = useApp()
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [cards, setCards] = useState<{ front: string; back: string }[]>([{ front: '', back: '' }])

  const addCard = () => setCards([...cards, { front: '', back: '' }])
  const removeCard = (i: number) => setCards(cards.filter((_, idx) => idx !== i))
  const updateCard = (i: number, field: 'front' | 'back', val: string) => {
    const updated = [...cards]
    updated[i] = { ...updated[i], [field]: val }
    setCards(updated)
  }

  const save = () => {
    if (!title.trim() || cards.some(c => !c.front.trim() || !c.back.trim())) return
    dispatch({
      type: 'ADD_DECK',
      payload: {
        id: generateId(),
        title: title.trim(),
        description: desc.trim(),
        cards: cards.map(c => ({ id: generateId(), front: c.front.trim(), back: c.back.trim() })),
        createdAt: new Date().toISOString(),
      },
    })
    onBack()
  }

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-4 transition-colors">
        <ArrowLeft size={16} /> Back to decks
      </button>
      <div className="stat-card p-5 mb-5">
        <input type="text" placeholder="Deck title..." value={title} onChange={e => setTitle(e.target.value)}
          className="input mb-3 font-medium" />
        <input type="text" placeholder="Description (optional)..." value={desc} onChange={e => setDesc(e.target.value)}
          className="input" />
      </div>
      <div className="space-y-3 mb-5">
        {cards.map((card, i) => (
          <div key={i} className="stat-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Card {i + 1}</span>
              {cards.length > 1 && (
                <button onClick={() => removeCard(i)} className="p-1 rounded-lg hover:bg-red-500/10 transition-colors">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-slate-500 font-medium mb-1">Front</p>
                <textarea placeholder="Question / term..." value={card.front} onChange={e => updateCard(i, 'front', e.target.value)} rows={2}
                  className="input resize-none" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium mb-1">Back</p>
                <textarea placeholder="Answer / definition..." value={card.back} onChange={e => updateCard(i, 'back', e.target.value)} rows={2}
                  className="input resize-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={addCard} className="flex-1 py-2.5 text-sm font-medium text-indigo-400 bg-indigo-900/20 border border-indigo-500/20 rounded-xl hover:bg-indigo-900/30 transition-colors">
          + Add Card
        </button>
        <button onClick={save} disabled={!title.trim() || cards.some(c => !c.front.trim() || !c.back.trim())}
          className="flex-1 py-2.5 btn-primary disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium">
          Save Deck
        </button>
      </div>
    </div>
  )
}

function DeckView({ deck, onBack }: { deck: FlashcardDeck; onBack: () => void }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  const toggleFlip = (id: string) => setFlipped(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-4 transition-colors">
        <ArrowLeft size={16} /> Back to decks
      </button>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
          <Layers size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">{deck.title}</h1>
          <p className="text-sm text-slate-400">{deck.cards.length} cards</p>
        </div>
      </div>
      {deck.cards.length === 0 ? (
        <div className="text-center py-16 stat-card">
          <BookOpen size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No cards in this deck yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deck.cards.map(card => (
            <div key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="group cursor-pointer stat-card p-5 hover:-translate-y-0.5 min-h-[140px] flex items-center justify-center"
            >
              <div className="text-center">
                {flipped[card.id] ? (
                  <div>
                    <p className="text-[10px] text-emerald-400 font-medium mb-2">ANSWER</p>
                    <p className="text-sm text-slate-200">{card.back}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-indigo-400 font-medium mb-2">QUESTION</p>
                    <p className="text-sm text-slate-300">{card.front}</p>
                  </div>
                )}
                <p className="text-[10px] text-slate-500 mt-3">{flipped[card.id] ? 'Tap to flip back' : 'Tap to reveal'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Flashcards() {
  const { state } = useApp()
  const [page, setPage] = useState<'list' | 'create'>('list')
  const [viewDeckId, setViewDeckId] = useState<string | null>(null)

  if (page === 'create') return <CreateDeck onBack={() => setPage('list')} />
  if (viewDeckId) {
    const deck = state.decks.find(d => d.id === viewDeckId)
    if (deck) return <DeckView deck={deck} onBack={() => setViewDeckId(null)} />
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
            <Layers size={20} className="text-white" />
          </div>
          <div>
            <h1 className="page-title text-slate-100">Flashcards</h1>
            <p className="page-subtitle">{state.decks.reduce((s, d) => s + d.cards.length, 0)} cards &middot; {state.decks.length} decks</p>
          </div>
        </div>
        <button onClick={() => setPage('create')}
          className="btn-primary">
          <Plus size={18} /> New Deck
        </button>
      </div>

      {state.decks.length === 0 ? (
        <div className="text-center py-20 stat-card">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <Layers size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-500 text-sm mb-4">No flashcard decks yet</p>
          <button onClick={() => setPage('create')}
            className="btn-primary">
            <Sparkles size={16} /> Create your first deck
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.decks.map(deck => (
            <div key={deck.id}
              onClick={() => setViewDeckId(deck.id)}
              className="card-glow group cursor-pointer stat-card p-5 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-black/20 ring-1 ring-white/10">
                  <Layers size={16} className="text-white" />
                </div>
                <ChevronRight size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-semibold text-slate-100 text-sm mb-1">{deck.title}</h3>
              {deck.description && <p className="text-xs text-slate-500 mb-2 line-clamp-2">{deck.description}</p>}
              <p className="text-[10px] text-slate-500">{deck.cards.length} cards</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
