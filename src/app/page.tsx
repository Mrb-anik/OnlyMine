'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Zap, Calendar, Target, BarChart2, RefreshCw,
  Phone, Clock, CheckCircle, XCircle, ChevronRight,
  ArrowRight, Star, Menu, X, TrendingUp, DollarSign,
  Activity, ShieldAlert, Search, Filter, ShieldCheck,
  AlertCircle
} from 'lucide-react'

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0E27]/95 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Lead Matrix" className="h-10 w-auto object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            ['#system', 'The System'],
            ['#dashboards', 'Dashboards'],
            ['#case-studies', 'Results'],
            ['#offer', 'The Offer'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="nav-link text-white/80 hover:text-white font-medium text-sm transition-colors">{label}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-white/80 hover:text-white font-medium text-sm transition-colors">Client Login</Link>
          <a href="#audit" className="bg-[#3DAB3D] hover:bg-[#1A6B1A] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(61,171,61,0.4)]">
            Free Revenue Audit →
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0A0E27]/98 border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {[
            ['#system', 'The System'],
            ['#dashboards', 'Dashboards'],
            ['#case-studies', 'Results'],
            ['#offer', 'The Offer'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="text-white/80 hover:text-white font-medium text-lg" onClick={() => setOpen(false)}>{label}</a>
          ))}
          <Link href="/login" className="text-white/80 hover:text-white font-medium text-lg" onClick={() => setOpen(false)}>Client Login</Link>
          <a href="#audit" className="bg-[#3DAB3D] text-white w-full text-center py-3 rounded-xl font-bold" onClick={() => setOpen(false)}>
            Get Free Audit →
          </a>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center pt-20 overflow-hidden bg-[#0A0E27]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-15%] w-[700px] h-[700px] rounded-full blur-[120px] bg-[#3DAB3D]/10 animate-pulse-slow" />
        <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] bg-[#00D9FF]/5" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 text-sm font-bold animate-[fadeInUp_0.6s_ease_both]"
            style={{ background: 'rgba(61,171,61,0.12)', border: '1px solid #3DAB3D', color: '#3DAB3D' }}>
            <div className="w-2 h-2 rounded-full bg-[#3DAB3D] animate-pulse" />
            BEYOND LEAD GENERATION
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.08] mb-6 animate-[fadeInUp_0.7s_ease_0.1s_both]"
            style={{ fontFamily: 'Syne, sans-serif' }}>
            We Don't Sell Leads.<br />
            We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#56C240] to-[#3DAB3D]">Revenue Infrastructure.</span>
          </h1>

          <p className="text-lg md:text-2xl text-white/75 max-w-3xl leading-relaxed mb-6 animate-[fadeInUp_0.7s_ease_0.2s_both]">
            <strong className="text-white font-semibold">Control your pipeline, or your pipeline controls your revenue.</strong> Stop paying marketing agencies for traffic that doesn’t convert. We install predictable, end-to-end revenue systems for service businesses that capture, qualify, and close high-ticket clients automatically.
          </p>
          
          <div className="text-xl font-bold text-[#3DAB3D] mb-10 animate-[fadeInUp_0.7s_ease_0.25s_both]">
            "We don't run marketing. We run your revenue pipeline."
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-14 animate-[fadeInUp_0.7s_ease_0.3s_both]">
            <a href="#audit" className="bg-[#3DAB3D] hover:bg-[#1A6B1A] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(61,171,61,0.3)]">
              Audit My Revenue Pipeline <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#system" className="border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all">
              See The System <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Who This Is For ─────────────────────────────────────────────────────────
function WhoThisIsFor() {
  return (
    <section className="py-24 bg-[#060D06] border-y border-[#3DAB3D]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Who This Is For</h2>
          <p className="text-white/60 text-lg">We only build infrastructure for businesses ready to scale.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-[#0A0E27] border border-[#3DAB3D]/30 p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3DAB3D]/10 rounded-full blur-[40px]" />
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-[#3DAB3D]" /> This IS For Service Businesses That:
            </h3>
            <ul className="space-y-5">
              {[
                'Are generating leads but struggling to convert them fast enough.',
                'Don’t know which marketing source actually drives realized revenue.',
                'Rely on inconsistent, unpredictable deal flow month to month.',
                'Close high-ticket clients ($1K–$10K+) where every lost lead hurts.'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4 text-white/80 text-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3DAB3D] mt-2.5 flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0A0E27] border border-red-500/20 p-10 rounded-3xl relative overflow-hidden opacity-80">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-500" /> This is NOT For:
            </h3>
            <ul className="space-y-5">
              {[
                'Early-stage businesses with zero existing demand or traffic.',
                'Companies looking to buy "cheap shared leads".',
                'Teams without a dedicated sales process or capacity to take jobs.',
                'Businesses selling low-ticket commoditized products.'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4 text-white/60 text-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2.5 flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Problem ──────────────────────────────────────────────────────────────────
function Problem() {
  return (
    <section className="py-28 bg-[#0A0E27]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-[#3DAB3D] font-bold tracking-widest text-sm uppercase mb-4 block">The Hard Truth</span>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-10 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Your Business is Bleeding Revenue, and Your Agency is Sending You "Click" Reports.
        </h2>
        
        <div className="text-left space-y-6 text-xl text-white/75 leading-relaxed bg-white/5 p-10 rounded-3xl border border-white/10">
          <p>Let’s be honest.</p>
          <p>You are generating leads, but they aren’t converting fast enough. You are spending money on marketing, but you have absolutely <strong className="text-white">zero visibility</strong> into where the actual cash is being made or lost.</p>
          <p>And the worst part? Your marketing agency doesn’t care. They don’t take responsibility for your bank account. They hide behind vanity metrics like "impressions" and "cost-per-click" while your sales team drowns in unqualified tire-kickers.</p>
          <div className="pt-6 border-t border-white/10 mt-6 font-bold text-2xl text-white text-center">
            If you can’t see the bottleneck, you can’t fix the leak.
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Mechanism & 30 Seconds ──────────────────────────────────────────────────
function Mechanism() {
  return (
    <section id="system" className="py-28 bg-[#040B04] border-y border-[#3DAB3D]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[#3DAB3D] font-bold tracking-widest text-sm uppercase mb-4 block">The Architecture</span>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            The Pipeline Control System™
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            We replace manual chaos, spreadsheets, and disjointed marketing with a single, controlled infrastructure.
          </p>
        </div>

        {/* How It Works in 30 Seconds */}
        <div className="max-w-5xl mx-auto mb-24">
          <h3 className="text-2xl font-bold mb-8 text-center">How It Works in 30 Seconds:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '1', title: 'We capture demand', icon: <Search className="w-6 h-6 text-[#3DAB3D]" /> },
              { num: '2', title: 'We filter & qualify', icon: <Filter className="w-6 h-6 text-[#3DAB3D]" /> },
              { num: '3', title: 'We convert instantly', icon: <Zap className="w-6 h-6 text-[#3DAB3D]" /> },
              { num: '4', title: 'We track every dollar', icon: <DollarSign className="w-6 h-6 text-[#3DAB3D]" /> }
            ].map((step) => (
              <div key={step.num} className="bg-[#0A0E27] border border-[#3DAB3D]/20 p-6 rounded-2xl text-center relative group hover:border-[#3DAB3D]/50 transition-colors">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#3DAB3D] text-[#0A0E27] font-black rounded-full flex items-center justify-center">
                  {step.num}
                </div>
                <div className="flex justify-center mb-4 mt-2">{step.icon}</div>
                <div className="font-bold text-white/90">{step.title}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 text-2xl font-extrabold text-[#3DAB3D]" style={{ fontFamily: 'Syne, sans-serif' }}>
            You don't manage marketing. You monitor revenue.
          </div>
        </div>

        {/* 4 Layers Deep Dive */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: '1. Demand Capture',
              desc: 'We don’t build brochures; we build conversion assets. High-performing landing pages and funnels designed exclusively to turn passive traffic into active intent.'
            },
            {
              title: '2. Lead Qualification',
              desc: 'Stop wasting time on bad fits. We build automated filtering systems that score and route leads instantly, so your team only talks to prospects ready to buy.'
            },
            {
              title: '3. Conversion System',
              desc: 'The fastest business wins. We deploy relentless follow-up sequences and instant booking calendars that respond to leads in under 60 seconds.'
            },
            {
              title: '4. Revenue Dashboard',
              desc: 'Total visibility. No more guessing what’s working. You see exactly what is happening in your business, in real-time.'
            }
          ].map((layer) => (
            <div key={layer.title} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-[#3DAB3D]/30 transition-all">
              <h4 className="text-xl font-bold mb-4 text-white">{layer.title}</h4>
              <p className="text-white/60 leading-relaxed text-lg">{layer.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Dashboards & Ongoing Intelligence ────────────────────────────────────────
function DashboardSection() {
  return (
    <section id="dashboards" className="py-28 bg-[#0A0E27]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#3DAB3D] font-bold tracking-widest text-sm uppercase mb-4 block">Decision Intelligence</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            Your Business — Fully Visible. No More Guessing.
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Most businesses fly blind. Generic dashboards show you page views and bounce rates. Our dashboards show you your business heartbeat.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-8">
            {[
              { title: 'Revenue Command Center', desc: 'See your realized ROI in real-time. Know exactly what hit the bank today, this week, and this month.' },
              { title: 'Sales Pipeline Tracker', desc: 'See exactly where high-ticket deals are stalling, who needs a push, and what revenue is actively on the table.' },
              { title: 'Marketing ROI Dashboard', desc: 'Stop ad-spend anxiety. See exactly what your marketing dollars are doing, down to the penny.' },
              { title: 'Bottleneck Detection System', desc: 'Get proactive, automated alerts when response times drop or when a campaign starts leaking money.' }
            ].map((f) => (
              <div key={f.title} className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-[#3DAB3D] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">{f.title}</h4>
                  <p className="text-white/60">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Dashboard Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#3DAB3D]/20 blur-[100px] rounded-full" />
            <div className="relative bg-[#060D06] border border-[#3DAB3D]/30 rounded-3xl p-6 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="font-bold flex items-center gap-2"><BarChart2 className="w-5 h-5 text-[#3DAB3D]" /> Command Center</div>
                <div className="text-xs bg-[#3DAB3D]/20 text-[#3DAB3D] px-3 py-1 rounded-full font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#3DAB3D] animate-pulse" /> LIVE
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-2xl">
                  <div className="text-xs text-white/50 mb-1">Realized Revenue</div>
                  <div className="text-3xl font-extrabold text-[#56C240]">$142,500</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                  <div className="text-xs text-white/50 mb-1">Pipeline Value</div>
                  <div className="text-3xl font-extrabold text-white">$450,000</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider">Active Pipeline</div>
                {[
                  { name: 'Mike T.', stage: 'Contract Sent', val: '$12,000', color: '#56C240' },
                  { name: 'Sarah W.', stage: 'Qualification', val: '$8,500', color: '#00D9FF' },
                  { name: 'James R.', stage: 'Follow Up', val: '$15,000', color: '#FFA500' }
                ].map(r => (
                  <div key={r.name} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="font-semibold text-white/80">{r.name}</span>
                    <span className="text-xs px-2 py-1 rounded bg-white/5" style={{ color: r.color }}>{r.stage}</span>
                    <span className="font-mono font-bold text-white/90">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing Intelligence */}
        <div className="bg-[#040B04] border border-[#3DAB3D]/20 rounded-3xl p-12 text-center max-w-5xl mx-auto relative overflow-hidden">
          <Activity className="absolute top-[-20%] right-[-10%] w-64 h-64 text-[#3DAB3D]/5" />
          <h3 className="text-3xl font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Ongoing Revenue Intelligence</h3>
          <p className="text-xl text-white/70 mb-10 max-w-3xl mx-auto">
            We don't just build the dashboard and leave. Our system actively monitors your pipeline and feeds you actionable intelligence.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { alert: "⚠️ Your conversion dropped 18% this week. Investigating bottleneck in stage 2." },
              { alert: "📈 Your fastest closing channel this month is Google Ads. Recommend scaling spend." },
              { alert: "⏱️ Leads are stalling at qualification stage. Deploying automated re-engagement sequence." }
            ].map((a, i) => (
              <div key={i} className="bg-[#0A0E27] border border-[#3DAB3D]/30 p-5 rounded-2xl text-sm font-semibold text-white/90 shadow-[0_0_15px_rgba(61,171,61,0.1)]">
                {a.alert}
              </div>
            ))}
          </div>
          <div className="mt-10 font-bold text-lg text-[#3DAB3D]">
            We are not a dashboard company. We are a revenue intelligence system.
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Case Study ───────────────────────────────────────────────────────────────
function CaseStudy() {
  return (
    <section id="case-studies" className="py-28 bg-[#060D06] border-y border-[#3DAB3D]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#3DAB3D] font-bold tracking-widest text-sm uppercase mb-4 block">Project StoreX</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            From Manual Chaos to Total Pipeline Control
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8 text-lg text-white/75 leading-relaxed">
            <div>
              <h4 className="font-bold text-white mb-2">The Problem:</h4>
              <p>The client was operating on a fragmented infrastructure. They relied on manual queries and client-side logic, resulting in zero real-time visibility into their inventory, their marketing performance, or their actual realized revenue.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">The System We Built:</h4>
              <p>We stripped out the manual processes and migrated their entire infrastructure to a centralized, database-driven architecture. We installed automated functions, abandoned cart recovery loops, dynamic validation, and Stripe-driven order fulfillment.</p>
            </div>
          </div>

          {/* Before vs After */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl">
              <h4 className="text-red-400 font-bold text-xl mb-6 flex items-center gap-2"><XCircle className="w-5 h-5"/> BEFORE</h4>
              <ul className="space-y-4 text-white/70">
                <li>• No pipeline visibility</li>
                <li>• Manual, slow processes</li>
                <li>• Slow lead response time</li>
                <li>• Revenue leaks untracked</li>
              </ul>
            </div>
            <div className="bg-[#3DAB3D]/10 border border-[#3DAB3D]/30 p-8 rounded-3xl">
              <h4 className="text-[#3DAB3D] font-bold text-xl mb-6 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> AFTER</h4>
              <ul className="space-y-4 text-white/90 font-medium">
                <li>• Real-time revenue tracking</li>
                <li>• 100% automated workflows</li>
                <li>• Instant under-60s response</li>
                <li>• Infinite pipeline scalability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Anti-Agency ──────────────────────────────────────────────────────────────
function AntiAgency() {
  return (
    <section className="py-28 bg-[#0A0E27]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-16" style={{ fontFamily: 'Syne, sans-serif' }}>
          The Agency Model is Broken.<br/>We Are The Alternative.
        </h2>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-white/5 p-10 rounded-3xl border border-white/10 opacity-75">
            <h3 className="text-2xl font-bold mb-8 text-white/50">Marketing Agencies:</h3>
            <ul className="space-y-6">
              {[
                'Send you monthly PDFs you don\'t read.',
                'Chase "impressions" and "brand awareness".',
                'Blame your sales team when cheap leads don\'t close.',
                'Do not own the final outcome.'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4 text-white/60 text-lg">
                  <XCircle className="w-6 h-6 text-white/20 flex-shrink-0 mt-1" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#040B04] p-10 rounded-3xl border border-[#3DAB3D]/40 shadow-[0_0_30px_rgba(61,171,61,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3DAB3D]/10 rounded-full blur-[40px]" />
            <h3 className="text-2xl font-extrabold mb-8 text-white">Lead Matrix (Revenue Partners):</h3>
            <ul className="space-y-6">
              {[
                'We build permanent infrastructure you own.',
                'We track and optimize for realized revenue in the bank.',
                'We identify sales bottlenecks and engineer solutions to fix them.',
                'We own the outcome.'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4 text-white/90 text-lg font-medium">
                  <CheckCircle className="w-6 h-6 text-[#3DAB3D] flex-shrink-0 mt-1" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Offer & Pricing ──────────────────────────────────────────────────────────
function Offer() {
  return (
    <section id="offer" className="py-28 bg-[#060D06] border-t border-[#3DAB3D]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#3DAB3D] font-bold tracking-widest text-sm uppercase mb-4 block">The Infrastructure</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            The Done-For-You Revenue Engine
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            One unified infrastructure. One predictable outcome. Stop buying disjointed services and start investing in an asset that grows your company.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-[#0A0E27] rounded-3xl border border-[#3DAB3D]/40 overflow-hidden shadow-[0_0_50px_rgba(61,171,61,0.15)] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#3DAB3D] text-white text-xs font-black px-6 py-1.5 rounded-b-xl uppercase tracking-wider">
            Flagship Product
          </div>
          
          <div className="p-12">
            <h3 className="text-3xl font-bold mb-8 text-center border-b border-white/10 pb-8">Everything Included:</h3>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { title: 'High-Converting Funnels', sub: 'Engineered for capture' },
                { title: 'Integrated CRM & Automation', sub: 'Engineered for speed' },
                { title: 'Decision Intelligence Dashboards', sub: 'Engineered for clarity' },
                { title: 'Ongoing Pipeline Optimization', sub: 'Engineered for scale' },
                { title: 'Dedicated Account Manager', sub: 'Your strategic partner' },
                { title: 'Bottleneck Detection System', sub: 'Proactive alerts' }
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-[#3DAB3D] flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white text-lg">{item.title}</div>
                    <div className="text-white/50 text-sm">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/5 p-8 text-center border-t border-white/10">
            <a href="#audit" className="bg-[#3DAB3D] hover:bg-[#1A6B1A] text-white px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
              Get Your Custom Revenue Map <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Audit CTA & Risk Reversal ────────────────────────────────────────────────
function AuditCTA() {
  const [form, setForm] = useState({ name: '', email: '', business: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1000)
  }

  return (
    <section id="audit" className="py-28 relative overflow-hidden bg-[#0A0E27]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3DAB3D]/20 via-[#0A0E27] to-[#0A0E27]" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
          If your revenue depends on inconsistent leads, your business is unstable.
        </h2>
        <p className="text-white/80 text-2xl mb-12 max-w-2xl mx-auto">
          Take absolute control of your pipeline. Build an automated engine that captures, qualifies, and converts—whether you are in the office or on a beach.
        </p>

        {/* Risk Reversal & Urgency */}
        <div className="bg-[#060D06]/80 border border-[#3DAB3D]/30 p-8 rounded-3xl mb-12 backdrop-blur-md inline-block text-left max-w-3xl">
          <div className="flex items-start gap-4 mb-4">
            <ShieldAlert className="w-8 h-8 text-[#3DAB3D] flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xl text-white mb-1">Our Iron-Clad Guarantee</h4>
              <p className="text-white/70">You will leave the strategy call with a clear revenue map showing exactly how to fix your pipeline—whether you work with us or not. <strong className="text-white">If we can’t identify at least one major revenue leak, the audit is completely free.</strong></p>
            </div>
          </div>
          <div className="flex items-start gap-4 pt-4 border-t border-white/10">
            <Clock className="w-8 h-8 text-[#FFA500] flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xl text-white mb-1">Limited Availability</h4>
              <p className="text-white/70">We only take on a limited number of clients per quarter to ensure full system implementation and continuous optimization. Secure your spot.</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="bg-white/10 p-10 rounded-3xl border border-white/20 text-center max-w-2xl mx-auto backdrop-blur-md">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#3DAB3D]" />
            <h3 className="text-3xl font-bold mb-3">Audit Requested</h3>
            <p className="text-white/90 text-lg">
              We'll review your details and send your personalized Revenue Map to <strong>{form.email}</strong> shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 p-10 rounded-3xl border border-white/10 text-left max-w-2xl mx-auto backdrop-blur-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 text-center">Request Your Pipeline Audit</h3>
            <div className="space-y-5 mb-8">
              <div>
                <label className="text-sm font-semibold text-white/80 mb-2 block">Name</label>
                <input required className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3DAB3D] transition-colors" placeholder="John Doe"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80 mb-2 block">Business Email</label>
                <input type="email" required className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3DAB3D] transition-colors" placeholder="john@company.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80 mb-2 block">Company Name</label>
                <input required className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3DAB3D] transition-colors" placeholder="ACME Service Co."
                  value={form.business} onChange={e => setForm({ ...form, business: e.target.value })} />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#3DAB3D] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1A6B1A] transition-all shadow-[0_0_15px_rgba(61,171,61,0.3)] disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Get Revenue Map →'}
              </button>
              <button type="button" className="flex-1 bg-transparent border border-white/20 text-white py-4 rounded-xl font-bold text-lg hover:bg-white/5 transition-all">
                Book Strategy Call
              </button>
            </div>
            <div className="text-center mt-6 text-xl font-bold text-white/80">
              "We don't run marketing. We run your revenue pipeline."
            </div>
          </form>
        )}
      </div>
      
      <div className="mt-32 border-t border-white/10 pt-10 text-center text-white/30 text-sm">
        <img src="/logo.png" alt="Lead Matrix" className="h-8 w-auto mx-auto mb-6 opacity-50 grayscale" />
        <p>© {new Date().getFullYear()} Lead Matrix LLC. We build revenue infrastructure.</p>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0E27] text-white font-sans selection:bg-[#3DAB3D]/30">
      <Navbar />
      <Hero />
      <WhoThisIsFor />
      <Problem />
      <Mechanism />
      <DashboardSection />
      <CaseStudy />
      <AntiAgency />
      <Offer />
      <AuditCTA />
    </div>
  )
}
