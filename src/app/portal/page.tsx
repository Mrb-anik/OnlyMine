use client

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Zap, BarChart2, Users, Calendar, LogOut, RefreshCw,
  TrendingUp, Clock, CheckCircle, ArrowUp, Menu, X,
  Phone, Mail, MapPin, AlertCircle, Upload
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Lead, Appointment, DashboardStats } from '@/lib/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (!seconds || seconds === 0) return '—'
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: 'status-new',
    contacted: 'status-contacted',
    booked: 'status-booked',
    completed: 'status-completed',
    lost: 'status-lost',
    scheduled: 'status-booked',
    confirmed: 'status-completed',
    cancelled: 'status-lost',
  }
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${map[status] || 'status-lost'}`}>{status}</span>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, onLogout, mobileOpen, setMobileOpen }: {
  active: string
  setActive: (v: string) => void
  onLogout: () => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'leads', label: 'Leads', icon: <Users className="w-5 h-5" /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> },
  ]

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF6B35] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-lg font-extrabold" style={{ fontFamily: 'Syne, sans-serif' }}>
            Lead<span className="text-[#FF6B35]">Matrix</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => { setActive(id); setMobileOpen(false) }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full text-left transition-all duration-200 ${
              active === id
                ? 'bg-[#FF6B35] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/08'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full text-left text-white/50 hover:text-white hover:bg-white/05 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen flex-shrink-0"
        style={{ background: '#111629', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        <Content />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col"
            style={{ background: '#111629', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <Content />
          </aside>
        </div>
      )}
    </>
  )
}

// ...rest of the previous file content remains unchanged...

// ─── Main Portal Page ─────────────────────────────────────────────────────────
export default function PortalPage() {
  const router = useRouter()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today')
  const [leads, setLeads] = useState<Lead[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<DashboardStats>({ totalLeads: 0, avgResponseTime: 0, bookedAppointments: 0, conversionRate: 0 })
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [error, setError] = useState('')

  const getTimeFilter = useCallback((tf: string) => {
    const now = new Date()
    switch (tf) {
      case 'today': return new Date(now.setHours(0, 0, 0, 0)).toISOString()
      case 'week': { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString() }
      case 'month': { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString() }
      default: return new Date(now.setHours(0, 0, 0, 0)).toISOString()
    }
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUserEmail(user.email ?? '')

    const timeFilter = getTimeFilter(timeframe)

    const [{ data: leadsData, error: le }, { data: aptsData, error: ae }] = await Promise.all([
      supabase.from('leads').select('*').gte('created_at', timeFilter).order('created_at', { ascending: false }),
      supabase.from('appointments').select('*').gte('created_at', timeFilter).order('scheduled_date', { ascending: true }),
    ])

    if (le || ae) {
      setError('Failed to load data. Please refresh.')
    }

    const l = leadsData ?? []
    const a = aptsData ?? []
    setLeads(l as Lead[])
    setAppointments(a as Appointment[])

    const booked = l.filter((x: Lead) => x.booked || x.status === 'booked' || x.status === 'completed').length
    const avgResp = l.length > 0
      ? Math.round(l.reduce((sum: number, x: Lead) => sum + (x.response_time || 0), 0) / l.length)
      : 0

    setStats({
      totalLeads: l.length,
      avgResponseTime: avgResp,
      bookedAppointments: booked,
      conversionRate: l.length > 0 ? Math.round((booked / l.length) * 100) : 0,
    })

    setLoading(false)
  }, [supabase, timeframe, router, getTimeFilter])

  useEffect(() => {
    fetchData()

    // Real-time subscription
    const channel = supabase
      .channel('portal-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, () => fetchData())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, () => fetchData())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchData, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0A0E27' }}>
      <Sidebar
        active={activeTab}
        setActive={setActiveTab}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/08 sticky top-0 z-30"
          style={{ background: 'rgba(10,14,39,0.95)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button className="md:hidden text-white/70 hover:text-white" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold capitalize">{activeTab}</h1>
              <p className="text-xs text-white/40">{userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timeframe */}
            <div className="hidden sm:flex gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {(['today', 'week', 'month'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    timeframe === tf ? 'bg-[#FF6B35] text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {tf === 'today' ? 'Today' : tf === 'week' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="text-white/50 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/05"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          {error && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 text-sm"
              style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.35)', color: '#FF6B6B' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-[#FF6B35] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/40">Loading your dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardTab stats={stats} leads={leads} />}
              {activeTab === 'leads' && <LeadsTab leads={leads} />}
              {activeTab === 'appointments' && <AppointmentsTab appointments={appointments} />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}