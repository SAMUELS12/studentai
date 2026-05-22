import { Suspense, lazy, useState, useEffect, useRef } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import WelcomeGuide from './components/WelcomeGuide'
import Sidebar, { MobileHeader } from './components/Sidebar'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Notes = lazy(() => import('./pages/Notes'))
const Tasks = lazy(() => import('./pages/Tasks'))
const AIAssistantPage = lazy(() => import('./pages/AIAssistantPage'))
const Pomodoro = lazy(() => import('./pages/Pomodoro'))
const Analytics = lazy(() => import('./pages/Analytics'))
const StudyPlan = lazy(() => import('./pages/StudyPlan'))
const Profile = lazy(() => import('./pages/Profile'))
const Flashcards = lazy(() => import('./pages/Flashcards'))
const Habits = lazy(() => import('./pages/Habits'))
const QuizPage = lazy(() => import('./pages/Quiz'))

function Loading() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="relative">
        <div className="w-8 h-8 border-2 border-indigo-800 rounded-full" />
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
      </div>
    </div>
  )
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { state, dispatch } = useApp()
  const tickRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (state.pomodoroRunning) {
      tickRef.current = setInterval(() => {
        dispatch({ type: 'TICK_POMODORO' })
      }, 1000)
    }
    return () => clearInterval(tickRef.current)
  }, [state.pomodoroRunning, dispatch])

  return (
    <div className="flex min-h-screen bg-page transition-colors duration-300 bg-grid">
      <WelcomeGuide />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        <MobileHeader onMenuOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto page-container">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
        <AppProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="notes" element={<Notes />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="ai-assistant" element={<AIAssistantPage />} />
                <Route path="pomodoro" element={<Pomodoro />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="study-plan" element={<StudyPlan />} />
                <Route path="flashcards" element={<Flashcards />} />
                <Route path="habits" element={<Habits />} />
                <Route path="quiz" element={<QuizPage />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </Suspense>
        </AppProvider>
      </AuthProvider>
  )
}
