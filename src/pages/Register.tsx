import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password) { setError('Please fill in all fields'); return }
    if (password.length < 4) { setError('Password must be at least 4 characters'); return }
    setSubmitting(true)
    const result = await register(name.trim(), email.trim(), password)
    setSubmitting(false)
    if (result.success) {
      navigate('/app')
    } else {
      setError(result.error || 'An account with this email already exists')
    }
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4 bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10 transition-transform group-hover:scale-105">
              <span className="text-slate-50 font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-slate-50 text-lg tracking-tight">StudyPortal</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-50">Create your account</h1>
          <p className="text-slate-400 text-sm mt-1">Start your study journey today</p>
        </div>

        <div className="bg-card/80 border border-slate-700/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium tracking-wide">Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-page/80 border border-slate-700/50 rounded-xl text-sm text-slate-100
                             placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
                  placeholder="Your name" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium tracking-wide">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-page/80 border border-slate-700/50 rounded-xl text-sm text-slate-100
                             placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
                  placeholder="you@school.edu" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium tracking-wide">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 bg-page/80 border border-slate-700/50 rounded-xl text-sm text-slate-100
                             placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
                  placeholder="At least 4 characters" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl
                         text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus size={16} />}
              {submitting ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/20 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium inline-flex items-center gap-0.5">
                Sign in <ArrowRight size={12} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
