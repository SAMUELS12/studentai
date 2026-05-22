import { createContext, useContext, useReducer, useEffect, useRef, useState, ReactNode } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { generateId } from '../utils/helpers'
import { useAuth } from './AuthContext'

export interface Note {
  id: string; title: string; content: string; date: string; color: string
}

export interface Task {
  id: string; text: string; done: boolean; priority: 'low' | 'medium' | 'high'
}

export interface Message {
  id: string; text: string; sender: 'user' | 'ai'; time: string
}

export interface StudySession {
  id: string; date: string; duration: number; type: 'focus' | 'break'
}

export interface StudyPlan {
  id: string; title: string; plan: string; date: string
}

export interface Flashcard {
  id: string; front: string; back: string
}

export interface FlashcardDeck {
  id: string; title: string; description: string; cards: Flashcard[]; createdAt: string
}

export interface Habit {
  id: string; name: string; icon: string; logs: Record<string, boolean>
}

export interface QuizQuestion {
  id: string; question: string; options: string[]; correctIndex: number; userAnswer: number | null
}

export interface Quiz {
  id: string; title: string; subject: string; questions: QuizQuestion[]; score: number; completed: boolean; createdAt: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: string
}

const APP_VERSION = 6

export interface AppState {
  version: number
  notes: Note[]
  tasks: Task[]
  messages: Message[]
  conversations: Conversation[]
  sessions: StudySession[]
  plans: StudyPlan[]
  decks: FlashcardDeck[]
  habits: Habit[]
  quizzes: Quiz[]
  pomodoroDuration: number
  breakDuration: number
  focusMinutes: number
  streak: number
  lastActiveDate: string
  newUser: boolean
  pomodoroRunning: boolean
  pomodoroMode: 'focus' | 'break'
  pomodoroTimeLeft: number
}

type Action =
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'ADD_SESSION'; payload: StudySession }
  | { type: 'ADD_PLAN'; payload: StudyPlan }
  | { type: 'DELETE_PLAN'; payload: string }
  | { type: 'SET_POMODORO'; payload: { pomodoroDuration: number; breakDuration: number } }
  | { type: 'UPDATE_FOCUS'; payload: number }
  | { type: 'SET_STREAK'; payload: { streak: number; lastActiveDate: string } }
  | { type: 'DISMISS_WELCOME' }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'DELETE_CONVERSATION'; payload: string }
  | { type: 'ADD_CONVERSATION_MESSAGE'; payload: { conversationId: string; message: Message } }
  | { type: 'RENAME_CONVERSATION'; payload: { id: string; title: string } }
  | { type: 'ADD_DECK'; payload: FlashcardDeck }
  | { type: 'DELETE_DECK'; payload: string }
  | { type: 'UPDATE_DECK'; payload: FlashcardDeck }
  | { type: 'START_POMODORO' }
  | { type: 'STOP_POMODORO' }
  | { type: 'TICK_POMODORO' }
  | { type: 'SET_POMODORO_MODE'; payload: 'focus' | 'break' }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'TOGGLE_HABIT'; payload: string }
  | { type: 'ADD_QUIZ'; payload: Quiz }
  | { type: 'ANSWER_QUESTION'; payload: { quizId: string; questionId: string; answerIndex: number } }
  | { type: 'DELETE_QUIZ'; payload: string }

const today = new Date().toDateString()

function seedId() { return generateId() }

function makeWelcomeMsg() {
  return {
    id: seedId(),
    text: "Welcome! I'm your AI study assistant. Try asking me about any subject — math, science, history, coding — or ask for study tips and exam advice!",
    sender: 'ai' as const,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

const initialSampleData: AppState = {
  version: APP_VERSION,
  notes: [],
  tasks: [],
  messages: [makeWelcomeMsg()],
  conversations: [{
    id: seedId(),
    title: 'General Chat',
    messages: [makeWelcomeMsg()],
    createdAt: new Date().toISOString(),
  }],
  sessions: [],
  plans: [],
  decks: [],
  habits: [],
  quizzes: [],
  pomodoroDuration: 25,
  breakDuration: 5,
  focusMinutes: 0,
  streak: 0,
  lastActiveDate: new Date().toDateString(),
  newUser: true,
  pomodoroRunning: false,
  pomodoroMode: 'focus',
  pomodoroTimeLeft: 25 * 60,
}

function computeStreak(sessions: StudySession[]): { streak: number; lastActiveDate: string } {
  if (!sessions.length) return { streak: 0, lastActiveDate: today }
  const focusSessions = sessions.filter(s => s.type === 'focus')
  if (!focusSessions.length) return { streak: 0, lastActiveDate: today }

  const dates = [...new Set(focusSessions.map(s => s.date.split('T')[0]))].sort().reverse()
  let streak = 0
  const todayStr = new Date().toISOString().split('T')[0]
  let check = new Date(todayStr)

  for (const dateStr of dates) {
    const d = new Date(dateStr)
    const diff = Math.round((check.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    if (diff <= 1) {
      streak++
      check = d
    } else {
      break
    }
  }

  return { streak, lastActiveDate: dates[0] }
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] }
    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter(n => n.id !== action.payload) }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'TOGGLE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload ? { ...t, done: !t.done } : t) }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] }
    case 'ADD_SESSION': {
      const newSessions = [...state.sessions, action.payload]
      return { ...state, sessions: newSessions, ...computeStreak(newSessions) }
    }
    case 'ADD_PLAN':
      return { ...state, plans: [action.payload, ...state.plans] }
    case 'DELETE_PLAN':
      return { ...state, plans: state.plans.filter(p => p.id !== action.payload) }
    case 'START_POMODORO':
      return { ...state, pomodoroRunning: true }
    case 'STOP_POMODORO':
      return { ...state, pomodoroRunning: false }
    case 'TICK_POMODORO':
      if (state.pomodoroTimeLeft <= 1) {
        const isFocus = state.pomodoroMode === 'focus'
        const newMode = isFocus ? 'break' : 'focus'
        const newTime = newMode === 'focus' ? state.pomodoroDuration * 60 : state.breakDuration * 60
        const newSessions = isFocus
          ? [...state.sessions, { id: generateId(), date: new Date().toISOString(), duration: state.pomodoroDuration, type: 'focus' as const }]
          : state.sessions
        return {
          ...state,
          pomodoroRunning: false,
          pomodoroTimeLeft: newTime,
          pomodoroMode: newMode,
          sessions: newSessions,
          focusMinutes: isFocus ? state.focusMinutes + state.pomodoroDuration : state.focusMinutes,
          ...(isFocus ? computeStreak(newSessions) : {}),
        }
      }
      return { ...state, pomodoroTimeLeft: state.pomodoroTimeLeft - 1 }
    case 'SET_POMODORO_MODE':
      return {
        ...state,
        pomodoroMode: action.payload,
        pomodoroRunning: false,
        pomodoroTimeLeft: action.payload === 'focus' ? state.pomodoroDuration * 60 : state.breakDuration * 60,
      }
    case 'ADD_DECK':
      return { ...state, decks: [action.payload, ...state.decks] }
    case 'DELETE_DECK':
      return { ...state, decks: state.decks.filter(d => d.id !== action.payload) }
    case 'UPDATE_DECK':
      return { ...state, decks: state.decks.map(d => d.id === action.payload.id ? action.payload : d) }
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] }
    case 'DELETE_HABIT':
      return { ...state, habits: state.habits.filter(h => h.id !== action.payload) }
    case 'TOGGLE_HABIT': {
      const today = new Date().toISOString().split('T')[0]
      return {
        ...state,
        habits: state.habits.map(h =>
          h.id === action.payload
            ? { ...h, logs: { ...h.logs, [today]: !h.logs[today] } }
            : h
        ),
      }
    }
    case 'ADD_QUIZ':
      return { ...state, quizzes: [action.payload, ...state.quizzes] }
    case 'ANSWER_QUESTION':
      return {
        ...state,
        quizzes: state.quizzes.map(q =>
          q.id === action.payload.quizId
            ? {
                ...q,
                questions: q.questions.map(qu =>
                  qu.id === action.payload.questionId
                    ? { ...qu, userAnswer: action.payload.answerIndex }
                    : qu
                ),
              }
            : q
        ),
      }
    case 'DELETE_QUIZ':
      return { ...state, quizzes: state.quizzes.filter(q => q.id !== action.payload) }
    case 'SET_POMODORO':
      return { ...state, ...action.payload }
    case 'UPDATE_FOCUS':
      return { ...state, focusMinutes: state.focusMinutes + action.payload }
    case 'SET_STREAK':
      return { ...state, ...action.payload }
    case 'DISMISS_WELCOME':
      return { ...state, newUser: false }
    case 'LOAD_STATE':
      return action.payload
    case 'ADD_CONVERSATION':
      return { ...state, conversations: [action.payload, ...state.conversations] }
    case 'DELETE_CONVERSATION':
      return { ...state, conversations: state.conversations.filter(c => c.id !== action.payload) }
    case 'ADD_CONVERSATION_MESSAGE': {
      const { conversationId, message } = action.payload
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c
        ),
      }
    }
    case 'RENAME_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c.id === action.payload.id ? { ...c, title: action.payload.title } : c
        ),
      }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [ready, setReady] = useState(false)
  const initialStateSet = useRef(false)

  const [state, dispatch] = useReducer(reducer, initialSampleData)

  useEffect(() => {
    if (initialStateSet.current) return
    if (!userId) {
      setReady(true)
      return
    }
    const load = async () => {
      try {
        const docRef = doc(db, 'users', userId, 'data', 'appState')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data() as AppState
          if (data.version === APP_VERSION) {
            dispatch({ type: 'LOAD_STATE', payload: data })
          }
        }
      } catch {}
      initialStateSet.current = true
      setReady(true)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!ready || !userId) return
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      setDoc(doc(db, 'users', userId, 'data', 'appState'), { ...state, newUser: false })
        .catch(() => {})
    }, 600)
    return () => clearTimeout(saveTimerRef.current)
  }, [state, userId, ready])

  if (!ready) return (
    <div className="flex items-center justify-center min-h-screen bg-page">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
