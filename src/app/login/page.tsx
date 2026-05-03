'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/portal')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: '#0A0E27' }}>
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] radial-blob rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,217,255,0.06) 0%, transparent 65%)' }} />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <img src="/logo.png" alt="Lead Matrix" className="h-12 w-auto object-contain" />
        </Link>

        {/* Card */}
        <div className="glass-card p-10 rounded-2xl">
          <h1 className="text-3xl font-extrabold mb-2 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>
            Client Portal
          </h1>
          <p className="text-white/55 text-center text-sm mb-8">
            Sign in to view your leads, bookings & analytics
          </p>

          {error && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 text-sm"
              style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.35)', color: '#FF6B6B' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="text-sm text-white/65 mb-1.5 block font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  className="form-input !pl-11"
                  placeholder="you@business.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-white/65 mb-1.5 block font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="form-input !pl-11 !pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary justify-center w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In to Portal →'}
            </button>
          </form>

          <p className="text-center text-white/40 text-xs mt-6">
            Don&apos;t have access?{' '}
            <a href="mailto:hello@leadmatrixllc.us" className="text-[#3DAB3D] hover:underline">
              Contact Lead Matrix
            </a>
          </p>
        </div>

        <p className="text-center text-white/25 text-xs mt-6">
          © {new Date().getFullYear()} Lead Matrix LLC
        </p>
      </div>
    </div>
  )
}
