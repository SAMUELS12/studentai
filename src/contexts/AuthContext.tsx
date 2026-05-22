import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../utils/firebase'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid, 'profile', 'main'))
          const name = profileDoc.exists() ? profileDoc.data().name : firebaseUser.displayName || 'Student'
          setUser({ id: firebaseUser.uid, name, email: firebaseUser.email || '' })
        } catch {
          setUser({ id: firebaseUser.uid, name: firebaseUser.displayName || 'Student', email: firebaseUser.email || '' })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (e: any) {
      const code = e.code
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        return { success: false, error: 'Invalid email or password' }
      }
      if (code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many attempts. Try again later.' }
      }
      return { success: false, error: 'Login failed. Check your connection.' }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', cred.user.uid, 'profile', 'main'), { name, email })
      return { success: true }
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        return { success: false, error: 'An account with this email already exists' }
      }
      return { success: false, error: 'Registration failed. Try again.' }
    }
  }

  const logout = () => { signOut(auth) }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
