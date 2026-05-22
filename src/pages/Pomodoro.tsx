import { useState } from 'react'
import { Timer, Play, Pause, RotateCcw, Coffee, Settings, Plus, Minus, Zap } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function Pomodoro() {
  const { state, dispatch } = useApp()
  const [showSettings, setShowSettings] = useState(false)
  const [focusMin, setFocusMin] = useState(state.pomodoroDuration)
  const [breakMin, setBreakMin] = useState(state.breakDuration)

  const { pomodoroMode, pomodoroTimeLeft, pomodoroRunning } = state
  const timeLeft = pomodoroTimeLeft
  const running = pomodoroRunning
  const mode = pomodoroMode

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const total = mode === 'focus' ? state.pomodoroDuration * 60 : state.breakDuration * 60
  const progress = 1 - timeLeft / total

  const toggle = () => {
    dispatch({ type: running ? 'STOP_POMODORO' : 'START_POMODORO' })
  }

  const reset = () => {
    dispatch({ type: 'STOP_POMODORO' })
    dispatch({ type: 'SET_POMODORO_MODE', payload: mode })
  }

  const saveSettings = () => {
    const pom = Math.max(1, Math.min(120, focusMin))
    const brk = Math.max(1, Math.min(30, breakMin))
    dispatch({ type: 'SET_POMODORO', payload: { pomodoroDuration: pom, breakDuration: brk } })
    dispatch({ type: 'STOP_POMODORO' })
    dispatch({ type: 'SET_POMODORO_MODE', payload: mode })
    setFocusMin(pom); setBreakMin(brk); setShowSettings(false)
  }

  const sessionsToday = state.sessions.filter(s => s.date.startsWith(new Date().toISOString().split('T')[0]) && s.type === 'focus').length
  const focusToday = state.sessions
    .filter(s => s.date.startsWith(new Date().toISOString().split('T')[0]) && s.type === 'focus')
    .reduce((sum, s) => sum + s.duration, 0)

  return (
    <div className="max-w-md mx-auto text-center animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 ring-1 ring-white/10">
          <Timer size={20} className="text-white" />
        </div>
        <div>
          <h1 className="page-title text-slate-100">Pomodoro</h1>
          <p className="page-subtitle">{sessionsToday} sessions today</p>
        </div>
      </div>

      <div className="stat-card p-6 sm:p-8">
        <div className="flex justify-center gap-2 mb-6">
          <button onClick={() => dispatch({ type: 'SET_POMODORO_MODE', payload: 'focus' })}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              mode === 'focus' ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'
            }`}>
            <Play size={14} className="inline mr-1.5" /> Focus
          </button>
          <button onClick={() => dispatch({ type: 'SET_POMODORO_MODE', payload: 'break' })}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              mode === 'break' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'
            }`}>
            <Coffee size={14} className="inline mr-1.5" /> Break
          </button>
        </div>

        <div className="relative w-52 h-52 sm:w-60 sm:h-60 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6"
              className="text-slate-800" />
            <circle cx="50" cy="50" r="45" fill="none"
              stroke={mode === 'focus' ? '#6366f1' : '#10b981'} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
              className="transition-all duration-1000 ease-linear drop-shadow-lg" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-bold text-slate-100 tabular-nums tracking-tight">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-500 mt-1.5 capitalize font-medium">{mode} time</span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button onClick={toggle}
            className="w-14 h-14 p-3 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white
                       hover:from-primary-700 hover:to-primary-800 shadow-xl shadow-primary-500/30
                       flex items-center justify-center transition-all duration-200 active:scale-90"
            aria-label={running ? 'Pause' : 'Start'}>
            {running ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
          </button>
          <button onClick={reset}
            className="w-14 h-14 p-3 rounded-full bg-slate-800/50 text-slate-400
                       hover:bg-slate-700/50 hover:text-slate-200 flex items-center justify-center transition-all duration-200 active:scale-90 border border-slate-700/30"
            aria-label="Reset">
            <RotateCcw size={22} />
          </button>
          <button onClick={() => setShowSettings(!showSettings)}
            className="w-14 h-14 p-3 rounded-full bg-slate-800/50 text-slate-400
                       hover:bg-slate-700/50 hover:text-slate-200 flex items-center justify-center transition-all duration-200 active:scale-90 border border-slate-700/30"
            aria-label="Settings">
            <Settings size={22} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mt-4 stat-card p-5 animate-slide-up">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Timer Settings</h3>
          <div className="flex gap-6 justify-center">
            {[
              { label: 'Focus', value: focusMin, set: setFocusMin, min: 1, max: 120 },
              { label: 'Break', value: breakMin, set: setBreakMin, min: 1, max: 30 },
            ].map(({ label, value, set, min, max }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-sm text-slate-400">{label}:</span>
                <div className="flex items-center gap-1.5 bg-slate-800/50 rounded-lg p-1">
                  <button onClick={() => set(Math.max(min, value - 1))} className="p-1.5 rounded-md hover:bg-slate-700/50 transition-colors">
                    <Minus size={14} className="text-slate-500" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-slate-100">{value}m</span>
                  <button onClick={() => set(Math.min(max, value + 1))} className="p-1.5 rounded-md hover:bg-slate-700/50 transition-colors">
                    <Plus size={14} className="text-slate-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={saveSettings}
            className="mt-4 btn-primary">Apply Changes</button>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Zap size={12} className="text-primary-400" /> {focusToday} min focused today</span>
        <span>Fire {state.streak} day streak</span>
      </div>
    </div>
  )
}
