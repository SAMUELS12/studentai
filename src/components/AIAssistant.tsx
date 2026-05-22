import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Bot, Send, Trash2, Sparkles, Plus, MessageSquare, PanelLeftClose, PanelLeft, User as UserIcon } from 'lucide-react'
import { useApp, Conversation } from '../contexts/AppContext'
import { generateId } from '../utils/helpers'
import { callAiApi } from '../utils/aiConfig'

export default function AIAssistant() {
  const { state, dispatch } = useApp()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeConvId, setActiveConvId] = useState<string>(
    state.conversations[0]?.id || ''
  )
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeConv = state.conversations.find(c => c.id === activeConvId)
  const messages = activeConv?.messages || state.messages

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { inputRef.current?.focus() }, [activeConvId])

  const newConversation = () => {
    const conv: Conversation = {
      id: generateId(),
      title: 'New Chat',
      messages: [{
        id: generateId(),
        text: "Welcome! I'm your AI study assistant. Try asking me about any subject — math, science, history, coding — or ask for study tips and exam advice!",
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }],
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_CONVERSATION', payload: conv })
    setActiveConvId(conv.id)
  }

  const deleteConv = (id: string) => {
    if (!window.confirm('Delete this conversation?')) return
    dispatch({ type: 'DELETE_CONVERSATION', payload: id })
    if (activeConvId === id) {
      const remaining = state.conversations.filter(c => c.id !== id)
      setActiveConvId(remaining[0]?.id || '')
    }
  }

  const autoRename = (convId: string, userText: string) => {
    const title = userText.length > 40 ? userText.slice(0, 37) + '...' : userText
    dispatch({ type: 'RENAME_CONVERSATION', payload: { id: convId, title } })
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    let convId = activeConvId
    let conv = state.conversations.find(c => c.id === convId)

    if (!conv) {
      newConversation()
      conv = state.conversations[0]
      convId = conv?.id || ''
      if (!convId) return
    }

    const isFirstUserMsg = !conv.messages.some(m => m.sender === 'user')

    const userMsg = {
      id: generateId(), text, sender: 'user' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    dispatch({ type: 'ADD_CONVERSATION_MESSAGE', payload: { conversationId: convId, message: userMsg } })

    if (isFirstUserMsg) autoRename(convId, text)

    setLoading(true)

    try {
      const updatedConv = state.conversations.find(c => c.id === convId)
      const history = (updatedConv?.messages || []).slice(-10).map(m => ({
        role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text,
      }))
      const reply = await callAiApi([...history, { role: 'user', content: text }])

      dispatch({
        type: 'ADD_CONVERSATION_MESSAGE',
        payload: {
          conversationId: convId,
          message: {
            id: generateId(), text: reply, sender: 'ai' as const,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        },
      })
    } catch (e: any) {
      dispatch({
        type: 'ADD_CONVERSATION_MESSAGE',
        payload: {
          conversationId: convId,
          message: {
            id: generateId(), text: `⚠️ ${e.message || 'Something went wrong. Try again.'}`, sender: 'ai' as const,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        },
      })
    }
    setLoading(false)
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] lg:h-[calc(100vh-8rem)] rounded-2xl border border-slate-700/30 overflow-hidden shadow-lg bg-card/90 max-w-6xl mx-auto">
      {/* Sidebar */}
      <div className={`flex-shrink-0 border-r border-slate-700/30 bg-sidebar/80 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'}`}>
        <div className="p-3 border-b border-slate-700/20">
          <button onClick={newConversation}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/30 transition-all">
            <Plus size={16} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          {state.conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all ${
                conv.id === activeConvId
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/10'
                  : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200 border border-transparent'
              }`}
            >
              <MessageSquare size={15} className="flex-shrink-0" />
              <span className="truncate flex-1">{conv.title}</span>
              <button
                onClick={e => { e.stopPropagation(); deleteConv(conv.id) }}
                className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all flex-shrink-0"
                aria-label="Delete conversation"
              >
                <Trash2 size={12} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-slate-700/20">
          <button onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 rounded-lg transition-all">
            <PanelLeftClose size={14} /> Collapse
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-slate-700/30 bg-gradient-to-r from-primary-900/20 to-indigo-900/20 flex-shrink-0">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-all">
              <PanelLeft size={18} />
            </button>
          )}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm ring-1 ring-white/10">
            <Bot size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-slate-100 text-sm truncate">{activeConv?.title || 'AI Study Assistant'}</h2>
            <p className="text-xs text-slate-500">{state.conversations.length} conversation{state.conversations.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            {activeConv && activeConv.messages.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all messages in this conversation?')) {
                    dispatch({ type: 'DELETE_CONVERSATION', payload: activeConv.id })
                    const remaining = state.conversations.filter(c => c.id !== activeConv.id)
                    const next = remaining[0]
                    if (next) setActiveConvId(next.id)
                    else newConversation()
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-red-500/10 transition-all text-slate-500 hover:text-red-400"
                aria-label="Clear conversation"
              >
                <Trash2 size={15} />
              </button>
            )}
            <Sparkles size={16} className="text-primary-400 animate-pulse-slow" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-page/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-primary-900/40 flex items-center justify-center flex-shrink-0 mt-1 ring-1 ring-primary-500/10">
                  <Bot size={16} className="text-primary-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-md shadow-lg shadow-primary-500/10'
                    : 'bg-slate-800/50 text-slate-200 border border-slate-700/30 rounded-bl-md shadow-sm'
                }`}
              >
                {msg.sender === 'ai' ? (
                  <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
                <p className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-primary-200' : 'text-slate-500'}`}>{msg.time}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0 mt-1 ring-1 ring-slate-600/30">
                  <UserIcon size={16} className="text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-primary-400" />
              </div>
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-slate-700/30 bg-sidebar/50 flex-shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2.5 bg-page/80 border border-slate-700/40 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20 active:scale-95"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
