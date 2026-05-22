import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bot, FileText, CheckSquare, Timer, BarChart3, Calendar,
  Sparkles, ArrowRight, BookOpen, Zap, Check,
  ChevronDown, Star, Layers, Target, Brain,
} from 'lucide-react'

const features = [
  { icon: Bot, title: 'AI Study Assistant', desc: 'Get instant answers, study tips, and personalized advice from your AI tutor — available 24/7.' },
  { icon: FileText, title: 'Smart Notes', desc: 'Capture and organize your notes with rich formatting. Search and find anything instantly.' },
  { icon: CheckSquare, title: 'Task Management', desc: 'Track assignments with priorities. Stay on top of deadlines and never miss a due date.' },
  { icon: Timer, title: 'Pomodoro Timer', desc: 'Boost focus with customizable study sessions. Track your daily concentration time.' },
  { icon: Layers, title: 'Flashcards', desc: 'Create digital flashcards with tap-to-flip. Perfect for active recall and exam prep.' },
  { icon: Target, title: 'Habit Tracker', desc: 'Build consistent study habits with daily check-ins and weekly progress tracking.' },
  { icon: Brain, title: 'Quiz Generator', desc: 'Generate dynamic quizzes on any subject. Test your knowledge with instant scoring.' },
  { icon: BarChart3, title: 'Study Analytics', desc: 'Visualize your progress with beautiful charts. Monitor streaks, trends, and habits.' },
  { icon: Calendar, title: 'Study Planner', desc: 'Generate personalized study plans based on your subjects, deadlines, and available time.' },
  { icon: Zap, title: 'Offline Ready', desc: 'Works offline with PWA support. Study anywhere, anytime — no internet needed.' },
]

const steps = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up free in seconds. No credit card needed. Start your study journey immediately.' },
  { num: '02', title: 'Set Up Your Workspace', desc: 'Add your subjects, create notes, and organize your tasks. Everything in one place.' },
  { num: '03', title: 'Study with AI', desc: 'Ask the AI assistant questions, generate study plans, and use the Pomodoro timer to stay focused.' },
  { num: '04', title: 'Track & Improve', desc: 'Monitor your analytics, review your progress, and keep your streak going. Watch yourself improve.' },
]

const painPoints = [
  { icon: BookOpen, title: 'Overwhelmed by material', desc: '"I have 3 exams next week and no idea where to start"' },
  { icon: Timer, title: 'Can\'t stay focused', desc: '"I sit down to study but get distracted after 10 minutes"' },
  { icon: FileText, title: 'Scattered notes', desc: '"My notes are everywhere — Google Docs, Notion, random papers"' },
  { icon: Bot, title: 'No one to ask', desc: '"It\'s midnight, I\'m stuck, and there\'s no one to explain"' },
]

const testimonials = [
  { name: 'Sarah K.', role: 'Computer Science, Stanford', text: 'The AI assistant is a game changer. It helps me break down complex topics I used to struggle with for hours.', stars: 5 },
  { name: 'James L.', role: 'Pre-Med, UCLA', text: 'I went from C\'s to A\'s after using the Pomodoro timer and study planner. The analytics keep me accountable.', stars: 5 },
  { name: 'Alex R.', role: 'Law, Harvard', text: 'Study plans + task management = I actually feel in control of my workload for the first time.', stars: 5 },
]

const faqs = [
  { q: 'Is StudyPortal really free?', a: 'Yes! StudyPortal is completely free to use. No hidden fees, no credit card required. All features are available from day one.' },
  { q: 'Can I use it offline?', a: 'Yes. StudyPortal is a PWA (Progressive Web App). Once loaded, it works offline so you can study anywhere.' },
  { q: 'What devices does it work on?', a: 'Any device with a browser — laptop, tablet, or phone. You can also install it as an app on your home screen.' },
  { q: 'Do I need an internet connection to use the AI assistant?', a: 'The AI assistant requires an internet connection. However, all other features like notes, tasks, and the Pomodoro timer work offline.' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-700/30 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left group">
        <span className="text-sm font-medium text-slate-300 group-hover:text-slate-50 transition-colors">{q}</span>
        <ChevronDown size={16} className={`text-slate-500 transition-all duration-200 ${open ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>
      {open && <p className="text-sm text-slate-400 pb-4 leading-relaxed animate-fade-in">{a}</p>}
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-page">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-page/80 backdrop-blur-2xl border-b border-slate-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10 transition-transform group-hover:scale-105">
              <span className="text-slate-50 font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-slate-50 text-lg tracking-tight">StudyPortal</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-slate-50 transition-colors">Sign in</Link>
            <Link to="/register" className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25">Get Started Free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6 shadow-lg shadow-indigo-500/5">
            <Sparkles size={14} /> AI-Powered Study Platform
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            Study Smarter,<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Stress Less</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Turn your study materials into a complete learning system — AI assistant, notes, tasks,
            Pomodoro timer, analytics, and study plans. Everything you need, completely free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-base font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98]">
              Start Studying Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-800/50 text-slate-200 rounded-xl text-base font-medium hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30">
              Sign In
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> No credit card</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> All features free</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Works offline</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Any device</span>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/3 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-400/70 mb-3">Sound familiar?</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Studying Feels Harder<br />Than It Should</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {painPoints.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group bg-slate-800/20 border border-slate-700/30 rounded-2xl p-5 text-center hover:bg-slate-800/30 hover:border-slate-600/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-700/50 transition-colors">
                  <Icon size={20} className="text-slate-400 group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-slate-500 text-sm">There's a better way. StudyPortal turns chaos into a structured study system — automatically.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24 bg-slate-800/10 border-y border-slate-800/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-400/70 mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Start in Minutes</h2>
            <p className="text-slate-400 mt-3 max-w-md mx-auto">Get started with StudyPortal in four simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300 group-hover:scale-105">
                  <span className="text-2xl font-bold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">{num}</span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-400/70 mb-3">Everything you need</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Built for <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Better Learning</span></h2>
            <p className="text-slate-400 mt-3 max-w-lg mx-auto">Powerful tools designed to help you study effectively, stay organized, and achieve your goals.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group bg-slate-800/20 border border-slate-700/30 rounded-2xl p-5 hover:bg-slate-800/30 hover:border-slate-600/30 transition-all duration-300 hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-3 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                  <Icon size={20} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 sm:py-24 bg-slate-800/10 border-y border-slate-800/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Study Smarter.<br /><span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Learn Faster</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/40 border border-slate-700/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-400 text-sm mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs">✕</span> The Old Way
              </h3>
              <div className="space-y-3">
                {['Scattered materials everywhere', 'Random study methods', 'Manual note-taking', 'Endless re-reading', 'No instant help'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="w-4 h-4 rounded-full bg-slate-800/50 flex items-center justify-center text-[10px] text-slate-500">✕</span> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-indigo-300 text-sm mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400">✓</span> The StudyPortal Way
              </h3>
              <div className="space-y-3">
                {['Everything in one place', 'AI-powered study methods', 'Auto-organized notes', 'Active recall & practice', 'AI tutor on demand 24/7'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-indigo-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-400">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-400/70 mb-3">Loved by learners</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">What Students Say</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map(({ name, role, text, stars }) => (
              <div key={name} className="group bg-slate-800/20 border border-slate-700/30 rounded-2xl p-5 hover:bg-slate-800/30 hover:border-slate-600/30 transition-all duration-300">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">"{text}"</p>
                <div>
                  <p className="text-sm font-medium text-white">{name}</p>
                  <p className="text-[10px] text-slate-500">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl border border-indigo-500/10 p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                { value: '100%', label: 'Free Forever' },
                { value: '10+', label: 'Study Tools' },
                { value: 'Offline', label: 'Works Anywhere' },
                { value: 'PWA', label: 'Installable' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</p>
                  <p className="text-xs text-slate-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24 bg-slate-800/10 border-y border-slate-800/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="bg-slate-800/20 border border-slate-700/30 rounded-2xl px-6">
            {faqs.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Ready to Transform Your Studies?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Join students who are studying smarter, not harder. Start free — no credit card needed.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-base font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-xl shadow-indigo-500/25 active:scale-[0.98]">
            Create Your Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-slate-50 font-bold text-xs">S</span>
            </div>
            <span className="text-sm text-slate-400">StudyPortal</span>
          </div>
          <p className="text-xs text-slate-600">Built for students who want to succeed.</p>
        </div>
      </footer>
    </div>
  )
}
