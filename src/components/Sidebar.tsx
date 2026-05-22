import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, CheckSquare, Bot, Timer,
  User, X, Menu, BarChart3, Calendar, LogOut,
  Layers, Target, Brain,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const links = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/notes', icon: FileText, label: 'Notes' },
  { to: '/app/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/app/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { to: '/app/pomodoro', icon: Timer, label: 'Pomodoro' },
  { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/app/flashcards', icon: Layers, label: 'Flashcards' },
  { to: '/app/habits', icon: Target, label: 'Habits' },
  { to: '/app/quiz', icon: Brain, label: 'Quiz' },
  { to: '/app/study-plan', icon: Calendar, label: 'Study Plan' },
]

interface SidebarProps { open: boolean; onClose: () => void }

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden" onClick={onClose} />}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 lg:w-72
          bg-sidebar/90 backdrop-blur-2xl
          border-r border-slate-800/30
          transform transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          flex flex-col shadow-2xl shadow-black/20
          ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 h-16 flex-shrink-0 bg-gradient-to-r from-primary-500/5 to-transparent border-b border-slate-800/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
              <span className="text-slate-50 font-bold text-base">S</span>
            </div>
            <div>
              <span className="font-semibold text-slate-100 text-base tracking-tight">StudyPortal</span>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5 tracking-wide">Your study companion</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800/50" aria-label="Close menu">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 px-3 sm:px-4 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/10 text-indigo-300 shadow-sm border border-indigo-500/10'
                    : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200 border border-transparent'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex-shrink-0 bg-gradient-to-t from-page/80 to-transparent pt-2">
          {user && (
            <button
              onClick={() => { navigate('/app/profile'); onClose() }}
              className="w-full px-4 sm:px-5 py-2.5 flex items-center gap-3 hover:bg-slate-800/20 transition-colors group mx-3 sm:mx-4 rounded-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-white/10">
                <span className="text-sm font-bold text-slate-50">{user.name[0]?.toUpperCase() || '?'}</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-slate-200 truncate group-hover:text-slate-50 transition-colors">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>
              <div className="w-7 h-7 rounded-lg bg-slate-800/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <User size={14} className="text-slate-400" />
              </div>
            </button>
          )}
          <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between border-t border-slate-800/20">
            <button
              onClick={() => { logout(); navigate('/') }}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export function MobileHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <header className="sticky top-0 z-10 lg:hidden bg-sidebar/80 backdrop-blur-2xl border-b border-slate-800/20 px-4 h-14 flex items-center justify-between">
      <button onClick={onMenuOpen} className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors" aria-label="Open menu">
        <Menu size={22} className="text-slate-300" />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-slate-50 font-bold text-xs">S</span>
        </div>
        <span className="font-semibold text-sm text-slate-100 tracking-tight">StudyPortal</span>
      </div>
      <div className="w-10" />
    </header>
  )
}
