'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Zap, BarChart2, Users, Calendar, LogOut, RefreshCw,
  Phone, Mail, AlertCircle, Settings, UploadCloud, TrendingUp, Clock, ArrowUp, Menu
} from 'lucide-react'
import { AdminTab } from './AdminTab'
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
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${map[status] || 'status-lost'}`}>
      {status}
    </span>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, onLogout, mobileOpen, setMobileOpen, isAdmin }: {
  active: string
  setActive: (v: string) => void
  onLogout: () => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
  isAdmin: boolean
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'leads', label: 'Leads', icon: <Users className="w-5 h-5" /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> },
  ]
  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Hub', icon: <Settings className="w-5 h-5" /> })
  }

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

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = '#FF6B35', icon }: {
  label: string; value: string; sub?: string; color?: string; icon: React.ReactNode
}) {
  return (
    <div className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        {sub && (
          <div className="flex items-center gap-1 text-xs font-bold text-green-400">
            <ArrowUp className="w-3 h-3" /> {sub}
          </div>
        )}
      </div>
      <div className="text-3xl font-extrabold mb-1" style={{ fontFamily: 'Syne, sans-serif', color }}>
        {value}
      </div>
      <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{label}</div>
    </div>
  )
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab({ stats, leads }: { stats: DashboardStats; leads: Lead[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Today&apos;s Overview</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="New Leads" value={String(stats.totalLeads)} sub="+23% today"
          icon={<Users className="w-5 h-5" />} />
        <StatCard label="Avg Response" value={formatTime(stats.avgResponseTime)}
          color="#00D9FF" sub="67% faster" icon={<Clock className="w-5 h-5" />} />
        <StatCard label="Appointments" value={String(stats.bookedAppointments)}
          color="#4CAF50" sub="+35% booked" icon={<Calendar className="w-5 h-5" />} />
        <StatCard label="Conversion Rate" value={`${stats.conversionRate}%`}
          color="#FFA500" sub="↑ 12%" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      {/* Recent leads mini */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/08">
          <h3 className="font-bold">Recent Leads</h3>
          <div className="flex items-center gap-2 text-xs font-bold"
            style={{ color: '#00D9FF' }}>
            <div className="live-dot" /> LIVE
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="p-12 text-center text-white/40">No leads yet for this timeframe</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/08">
                  {['Time', 'Name', 'Phone', 'Source', 'Response', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 8).map((lead) => (
                  <tr key={lead.id} className="border-b border-white/04 hover:bg-white/02 transition-colors">
                    <td className="px-4 py-3 text-xs text-white/50">{formatDate(lead.created_at)}</td>
                    <td className="px-4 py-3 font-semibold text-sm">{lead.lead_name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-white/70">{lead.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{ background: 'rgba(0,217,255,0.12)', color: '#00D9FF' }}>
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-400">
                      {formatTime(lead.response_time ?? 0)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Leads Tab ────────────────────────────────────────────────────────────────
function LeadsTab({ leads, onRefresh }: { leads: Lead[], onRefresh: () => void }) {
  const [filter, setFilter] = useState<string>('all')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) return
    setUploading(true)
    setUploadMessage('')
    
    const formData = new FormData()
    formData.append('file', uploadFile)

    try {
      const res = await fetch('/api/leads/import-csv', { method: 'POST', body: formData })
      const json = await res.json()
      if (res.ok) {
         setUploadMessage(json.message)
         onRefresh()
      }
      else setUploadMessage(json.error || 'Upload failed')
    } catch (err: any) {
      setUploadMessage(err.message)
    } finally {
      setUploading(false)
      setUploadFile(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>All Leads</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
           {/* Upload Form */}
           <form onSubmit={handleUpload} className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
             <input type="file" accept=".csv" className="text-xs w-48 text-white/60 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#FF6B35] file:text-white hover:file:bg-[#e05b2c] cursor-pointer" onChange={e => setUploadFile(e.target.files?.[0] || null)} required />
             <button type="submit" disabled={uploading || !uploadFile} className="bg-[#FF6B35] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#e05b2c] transition-colors flex items-center gap-1 disabled:opacity-50">
               <UploadCloud className="w-3.5 h-3.5" />
               {uploading ? '...' : 'Import'}
             </button>
           </form>

           <div className="flex gap-2 flex-wrap">
             {['all', 'new', 'contacted', 'booked', 'completed', 'lost'].map(s => (
               <button
                 key={s}
                 onClick={() => setFilter(s)}
                 className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                   filter === s ? 'bg-[#FF6B35] text-white' : 'text-white/50 border border-white/15 hover:text-white'
                 }`}
               >
                 {s}
               </button>
             ))}
           </div>
        </div>
      </div>

      {uploadMessage && <div className="mb-6 p-4 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-semibold">{uploadMessage}</div>}

      <div className="glass-card rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-white/40">No leads match this filter</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/08">
                  {['Name', 'Contact', 'Source', 'Message', 'Response Time', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/04 hover:bg-white/02 transition-colors">
                    <td className="px-4 py-3 font-semibold">{lead.lead_name || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      {lead.phone && <div className="flex items-center gap-1 text-sm text-white/70"><Phone className="w-3 h-3" />{lead.phone}</div>}
                      {lead.email && <div className="flex items-center gap-1 text-xs text-white/45 mt-0.5"><Mail className="w-3 h-3" />{lead.email}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{ background: 'rgba(0,217,255,0.12)', color: '#00D9FF' }}>
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/60 max-w-[200px] truncate">
                      {lead.message || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-400">
                      {formatTime(lead.response_time ?? 0)}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3 text-xs text-white/40">{formatDate(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Appointments Tab ─────────────────────────────────────────────────────────
function AppointmentsTab({ appointments }: { appointments: Appointment[] }) {
  const upcoming = appointments.filter(a =>
    new Date(a.scheduled_date) >= new Date() && a.status !== 'cancelled'
  )
  const past = appointments.filter(a =>
    new Date(a.scheduled_date) < new Date() || a.status === 'cancelled'
  )

  const AppCard = ({ apt }: { apt: Appointment }) => (
    <div className="glass-card p-5 rounded-xl hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-bold text-[#FF6B35]">
          {new Date(apt.scheduled_date).toLocaleString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit'
          })}
        </div>
        <StatusBadge status={apt.status} />
      </div>
      <div className="font-bold text-lg mb-1">{apt.customer_name}</div>
      <div className="text-white/55 text-sm mb-2">{apt.service_type}</div>
      {apt.phone && (
        <div className="flex items-center gap-1.5 text-sm text-white/50">
          <Phone className="w-3.5 h-3.5" /> {apt.phone}
        </div>
      )}
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Appointments</h2>

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="glass-card p-16 rounded-2xl text-center">
          <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-lg">No appointments scheduled yet</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">Upcoming ({upcoming.length})</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {upcoming.map(apt => <AppCard key={apt.id} apt={apt} />)}
              </div>
            </>
          )}
          {past.length > 0 && (
            <>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">Past / Cancelled ({past.length})</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {past.map(apt => <AppCard key={apt.id} apt={apt} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

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
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')

  const ADMIN_EMAILS = ['hello@leadmatrixllc.us', 'mrb.work.aus@gmail.com', 'admin@leadmatrixllc.us', 'mrb.anik@yahoo.com']

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
    const email = user.email ?? ''
    setUserEmail(email)
    setIsAdmin(ADMIN_EMAILS.includes(email))

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
        isAdmin={isAdmin}
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
              {activeTab === 'leads' && <LeadsTab leads={leads} onRefresh={fetchData} />}
              {activeTab === 'appointments' && <AppointmentsTab appointments={appointments} />}
              {activeTab === 'admin' && isAdmin && <AdminTab userEmail={userEmail} />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
