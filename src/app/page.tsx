'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Zap, Calendar, Target, BarChart2, RefreshCw,
  Phone, Clock, CheckCircle, XCircle, ChevronRight,
  ArrowRight, Star, Menu, X, TrendingUp, DollarSign
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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Lead Matrix" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            ['#problem', 'Problem'],
            ['#solution', 'Solution'],
            ['#case-studies', 'Results'],
            ['#pricing', 'Pricing'],
            ['#resources', 'Resources'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="nav-link">{label}</a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="nav-link">Client Login</Link>
          <a href="#audit" className="btn-primary !px-5 !py-2.5 !text-base rounded-lg">
            Free Audit →
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          id="mobile-menu-btn"
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0A0E27]/98 border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {[
            ['#problem', 'Problem'],
            ['#solution', 'Solution'],
            ['#case-studies', 'Results'],
            ['#pricing', 'Pricing'],
            ['#resources', 'Resources'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="text-white/80 hover:text-white font-medium text-lg" onClick={() => setOpen(false)}>{label}</a>
          ))}
          <Link href="/login" className="text-white/80 hover:text-white font-medium text-lg" onClick={() => setOpen(false)}>Client Login</Link>
          <a href="#audit" className="btn-primary w-full text-center !py-3" onClick={() => setOpen(false)}>
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
    <section className="relative min-h-[95vh] flex items-center pt-20 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-15%] w-[700px] h-[700px] radial-blob rounded-full animate-pulse-slow" />
        <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,217,255,0.07) 0%, transparent 65%)' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-4xl">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 text-sm font-semibold animate-[fadeInUp_0.6s_ease_both]"
            style={{ background: 'rgba(61,171,61,0.12)', border: '1px solid #3DAB3D', color: '#3DAB3D' }}>
            <div className="live-dot" />
            Trusted by 200+ Home Service Businesses
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.08] mb-6 animate-[fadeInUp_0.7s_ease_0.1s_both]"
            style={{ fontFamily: 'Syne, sans-serif' }}>
            Stop Losing Leads<br />
            to <span className="text-gradient">Faster Competitors</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-2xl text-white/75 max-w-2xl leading-relaxed mb-10 animate-[fadeInUp_0.7s_ease_0.2s_both]">
            Respond in 60 seconds. Book more jobs. Automatically.<br />
            The complete technology solution for HVAC, plumbing, and electrical contractors who want to grow without working harder.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14 animate-[fadeInUp_0.7s_ease_0.3s_both]">
            <a href="#audit" className="btn-primary">
              Get Your Free Lead Loss Audit <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#solution" className="btn-secondary">
              See How It Works <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg animate-[fadeInUp_0.7s_ease_0.4s_both]">
            {[
              { num: '60s', label: 'Average Response Time' },
              { num: '35%', label: 'More Jobs Booked' },
              { num: '24/7', label: 'Automated Booking' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="stat-num">{num}</div>
                <div className="text-white/60 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Problem Section ──────────────────────────────────────────────────────────
function Problem() {
  const problems = [
    {
      icon: <Phone className="w-7 h-7" />,
      title: 'After-Hours Calls Go to Voicemail',
      desc: '40–60% of leads come outside business hours. While you sleep, competitors with automation capture your customers.',
      stat: '40–60% of leads lost',
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: 'Customers Choose Fastest Response',
      desc: '78% of customers hire the first contractor to respond — not the cheapest or best-reviewed. Speed wins, every time.',
      stat: '78% go to fastest responder',
    },
    {
      icon: <Calendar className="w-7 h-7" />,
      title: 'Manual Scheduling Chaos',
      desc: 'Your team wastes 15–20 hours weekly playing phone tag, double-booking, and managing calendars by hand.',
      stat: '20hrs wasted weekly',
    },
    {
      icon: <DollarSign className="w-7 h-7" />,
      title: 'Revenue Bleeding You Can\'t See',
      desc: 'If you\'re doing $2M/year and losing 30% of leads, that\'s $600K walking out the door every single year.',
      stat: '$600K/yr invisible loss',
    },
    {
      icon: <RefreshCw className="w-7 h-7" />,
      title: 'Poor Follow-Up Kills Deals',
      desc: 'Most contractors follow up once or twice. Automated systems follow up 7+ times across multiple channels — capturing more closes.',
      stat: '7x more follow-up touchpoints',
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: 'Inefficient Technician Routing',
      desc: 'Unoptimized routing wastes 2+ hours per tech per day. That\'s billable time evaporating into windshield time.',
      stat: '2+ hours wasted per tech/day',
    },
  ]

  return (
    <section id="problem" className="py-28" style={{ background: 'linear-gradient(180deg, #0A0E27 0%, #1A1F3A 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-badge mb-4">THE PROBLEM</span>
          <h2 className="text-4xl md:text-6xl mt-4 mb-6">
            Your Business Is <span className="text-gradient">Bleeding Revenue</span>
          </h2>
          <p className="text-white/65 text-xl max-w-2xl mx-auto">Sound familiar? You're not alone — and none of this is your fault. The system just isn't built for speed.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map(({ icon, title, desc, stat }) => (
            <div key={title}
              className="glass-card p-8 group hover:border-[#3DAB3D]/50 hover:-translate-y-2 transition-all duration-300 hover:glow-green">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-[#3DAB3D]"
                  style={{ background: 'rgba(61,171,61,0.12)', border: '1px solid rgba(61,171,61,0.25)' }}>
                  {icon}
                </div>
                <div className="text-sm font-bold text-[#3DAB3D] mt-3">{stat}</div>
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-white/65 leading-relaxed text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-white/50 mt-12 text-lg italic">
          "Sound familiar? You're not alone."
        </p>
      </div>
    </section>
  )
}

// ─── Solution Section ─────────────────────────────────────────────────────────
function Solution() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: '60-Second AI Auto-Response',
      desc: 'AI responds to every lead via email in under 60 seconds — 24/7, 365 days. No call center needed.',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Automated Appointment Booking',
      desc: 'Customers book directly into your calendar via Cal.com. No phone tag. No back-and-forth. Just appointments.',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Smart Lead Routing & Priority',
      desc: 'Emergency calls get flagged instantly. Regular inquiries enter nurture sequences. Every lead handled perfectly.',
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: 'Real-Time Client Dashboard',
      desc: 'Clients see every lead, response time, booking rate, and revenue metric — live, from any device.',
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: 'Automatic Multi-Touch Follow-Up',
      desc: 'No-shows get rescheduling emails. Completed jobs get review requests. Old leads get re-engaged. All automatic.',
    },
  ]

  return (
    <section id="solution" className="py-28" style={{ background: '#1A1F3A' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Features */}
          <div>
            <span className="section-badge mb-4">THE SOLUTION</span>
            <h2 className="text-4xl md:text-5xl mt-4 mb-4">
              Response & Revenue<br /><span className="text-gradient">Accelerator</span>
            </h2>
            <p className="text-white/65 text-lg mb-10">
              One integrated system that captures every lead, responds instantly, books automatically, and reports in real time.
            </p>

            <div className="flex flex-col gap-7">
              {features.map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-5 items-start">
                  <div className="feature-icon">{icon}</div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{title}</h4>
                    <p className="text-white/65 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Live dashboard preview */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl"
              style={{ background: 'radial-gradient(circle, rgba(61,171,61,0.15) 0%, transparent 65%)' }} />

            <div className="relative glass-card p-6 rounded-2xl border border-white/10">
              {/* Dashboard Header */}
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-[#3DAB3D]" />
                  <span className="font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>Today&apos;s Performance</span>
                </div>
                <div className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
                  style={{ background: 'rgba(0,217,255,0.12)', color: '#00D9FF', border: '1px solid rgba(0,217,255,0.25)' }}>
                  <div className="live-dot" />
                  LIVE
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'New Leads', val: '12', color: '#3DAB3D' },
                  { label: 'Avg Response', val: '45s', color: '#00D9FF' },
                  { label: 'Booked', val: '8', color: '#4CAF50' },
                  { label: 'Conversion', val: '67%', color: '#FFA500' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="text-xs text-white/55 mb-1">{label}</div>
                    <div className="text-3xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent leads mini-table */}
              <div className="text-xs text-white/40 font-bold uppercase tracking-wider mb-3">Recent Leads</div>
              {[
                { name: 'Mike Thompson', source: 'Google', status: 'booked', time: '2m ago' },
                { name: 'Sarah Williams', source: 'Website', status: 'contacted', time: '8m ago' },
                { name: 'James Rodriguez', source: 'Facebook', status: 'new', time: '12m ago' },
              ].map(({ name, source, status, time }) => (
                <div key={name} className="flex items-center justify-between py-2.5 border-t border-white/05">
                  <div>
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-xs text-white/45">{source} · {time}</div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full status-${status}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Case Studies ─────────────────────────────────────────────────────────────
function CaseStudies() {
  const [active, setActive] = useState(0)

  const studies = [
    {
      quote: 'We went from missing 30% of after-hours calls to capturing 95% of all leads. Revenue up $180K in just 6 months.',
      name: 'Mike Johnson',
      role: 'Owner',
      company: 'Johnson HVAC',
      location: 'Phoenix, AZ',
      before: '$2.3M',
      after: '$3.1M',
      industry: 'HVAC',
      emoji: '❄️',
    },
    {
      quote: 'The automated follow-up alone recovered $40K in leads we would have totally lost. ROI on day 1 was insane.',
      name: 'Danielle Torres',
      role: 'Operations Manager',
      company: 'Premier Plumbing Solutions',
      location: 'Austin, TX',
      before: '$1.1M',
      after: '$1.6M',
      industry: 'Plumbing',
      emoji: '🔧',
    },
    {
      quote: 'I stopped answering my phone after 6pm on weekends, and bookings actually went UP. The AI handles everything.',
      name: 'Robert Chen',
      role: 'Owner',
      company: 'Voltage Electric',
      location: 'Seattle, WA',
      before: '$800K',
      after: '$1.2M',
      industry: 'Electrical',
      emoji: '⚡',
    },
  ]

  const cs = studies[active]

  return (
    <section id="case-studies" className="py-28" style={{ background: '#0A0E27' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-badge mb-4">REAL RESULTS</span>
          <h2 className="text-4xl md:text-6xl mt-4">Client <span className="text-gradient">Success Stories</span></h2>
          <p className="text-white/60 text-xl mt-4">Average client books 35% more jobs in 90 days</p>
        </div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-10 rounded-3xl border border-white/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-8xl opacity-10 p-6">{cs.emoji}</div>

            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#FFA500] text-[#FFA500]" />)}
            </div>

            <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8 text-white/90">
              &ldquo;{cs.quote}&rdquo;
            </blockquote>

            <div className="flex items-center justify-between flex-wrap gap-6">
              <div>
                <div className="font-bold text-lg">{cs.name}</div>
                <div className="text-white/55 text-sm">{cs.role}, {cs.company} · {cs.location}</div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-white/50 text-xs mb-1">BEFORE</div>
                  <div className="text-xl font-bold text-white/60">{cs.before}</div>
                </div>
                <div className="text-center">
                  <div className="text-[#3DAB3D] text-xs mb-1 font-bold">AFTER</div>
                  <div className="text-xl font-bold text-[#3DAB3D]">{cs.after}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-3">
            {studies.map((s, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  i === active
                    ? 'bg-[#3DAB3D] text-white'
                    : 'text-white/50 hover:text-white border border-white/20'
                }`}
              >
                {s.emoji} {s.industry}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: 'Speed-to-Lead',
      price: '$997',
      desc: 'Perfect for contractors ready to stop missing leads',
      features: [
        'AI lead response under 60 seconds',
        'Email auto-response sequences',
        'Cal.com booking integration',
        'Lead tracking dashboard',
        'Weekly performance report',
        'Email support',
      ],
      cta: 'Start Free Audit',
      featured: false,
    },
    {
      name: 'Complete Tech',
      price: '$2,497',
      desc: 'Full automation for serious growth',
      features: [
        'Everything in Speed-to-Lead',
        'Full n8n automation engine',
        'Multi-channel follow-up (email)',
        'Advanced lead routing & scoring',
        'Real-time client portal access',
        'Monthly strategy call',
        'Priority support',
        'Custom onboarding (2-3 hrs)',
      ],
      cta: 'Start Free Audit',
      featured: true,
    },
    {
      name: 'Growth Engine',
      price: 'Custom',
      desc: 'White-glove solution for scaling teams',
      features: [
        'Everything in Complete Tech',
        'Multi-location management',
        'Custom automation workflows',
        'Dedicated account manager',
        'Bi-weekly strategy sessions',
        'Custom integrations',
        'SLA guarantee',
      ],
      cta: 'Schedule Consultation',
      featured: false,
    },
  ]

  return (
    <section id="pricing" className="py-28" style={{ background: 'linear-gradient(180deg, #0A0E27 0%, #1A1F3A 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          <span className="section-badge mb-4">PRICING</span>
          <h2 className="text-4xl md:text-6xl mt-4 mb-3">
            Investment That <span className="text-gradient">Pays for Itself</span>
          </h2>
          <p className="text-white/60 text-xl">Most clients see ROI in 30–45 days</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card p-8 rounded-2xl relative transition-all duration-300 group ${
                plan.featured
                  ? 'border-[#3DAB3D]/60 scale-105 glow-green'
                  : 'hover:border-[#3DAB3D]/40 hover:-translate-y-2'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3DAB3D] text-white text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className="text-sm font-bold text-[#3DAB3D] uppercase tracking-wider mb-2">{plan.name}</div>
                <div className="text-5xl font-extrabold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="text-lg text-white/50 font-normal">/mo</span>}
                </div>
                <p className="text-white/55 text-sm">{plan.desc}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                    <CheckCircle className="w-4 h-4 text-[#3DAB3D] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#audit"
                className={`w-full py-3.5 rounded-xl font-bold text-center block transition-all duration-200 ${
                  plan.featured
                    ? 'bg-[#3DAB3D] text-white hover:bg-[#1A6B1A]'
                    : 'border border-[#3DAB3D] text-[#3DAB3D] hover:bg-[#3DAB3D] hover:text-white'
                }`}
              >
                {plan.cta} →
              </a>
            </div>
          ))}
        </div>

        {/* ROI Calculator */}
        <ROICalculator />
      </div>
    </section>
  )
}

// ─── ROI Calculator ───────────────────────────────────────────────────────────
function ROICalculator() {
  const [revenue, setRevenue] = useState(200000)
  const [jobValue, setJobValue] = useState(500)
  const [leads, setLeads] = useState(100)
  const [conversion, setConversion] = useState(30)
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    const improvement = 0.25
    const additionalLeads = leads * improvement
    const additionalRevenue = additionalLeads * (conversion / 100) * jobValue
    setResult(Math.round(additionalRevenue))
  }

  return (
    <div className="mt-20 glass-card p-10 rounded-3xl max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <TrendingUp className="w-10 h-10 text-[#3DAB3D] mx-auto mb-3" />
        <h3 className="text-3xl font-bold mb-2">💰 ROI Calculator</h3>
        <p className="text-white/55">See your potential revenue increase in seconds</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {[
          { label: 'Current Monthly Revenue ($)', val: revenue, set: setRevenue, min: 10000, max: 5000000, step: 10000 },
          { label: 'Average Job Value ($)', val: jobValue, set: setJobValue, min: 100, max: 10000, step: 50 },
          { label: 'Leads Per Month', val: leads, set: setLeads, min: 10, max: 1000, step: 5 },
          { label: 'Current Conversion Rate (%)', val: conversion, set: setConversion, min: 5, max: 80, step: 1 },
        ].map(({ label, val, set, min, max, step }) => (
          <div key={label}>
            <label className="text-sm text-white/60 mb-2 block">{label}</label>
            <div className="flex items-center gap-3">
              <input
                type="range" min={min} max={max} step={step} value={val}
                onChange={(e) => set(Number(e.target.value))}
                className="flex-1 accent-[#3DAB3D]"
              />
              <div className="form-input !w-28 !py-2 text-center text-sm font-bold">
                {val.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          id="calculate-roi-btn"
          onClick={calculate}
          className="btn-primary mx-auto"
        >
          Calculate Your Potential <ArrowRight className="w-5 h-5" />
        </button>

        {result !== null && (
          <div className="mt-8 p-6 rounded-2xl" style={{ background: 'rgba(61,171,61,0.08)', border: '1px solid rgba(61,171,61,0.3)' }}>
            <p className="text-white/70 mb-2 text-sm">With 25% improvement in lead capture, you could add:</p>
            <div className="text-5xl font-extrabold text-[#3DAB3D] mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
              ${result.toLocaleString()}<span className="text-2xl">/mo</span>
            </div>
            <div className="text-2xl font-bold text-white/80">
              = ${(result * 12).toLocaleString()} annual growth
            </div>
            <a href="#audit" className="btn-primary mx-auto mt-4 inline-flex">
              Claim This Revenue →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Resources ────────────────────────────────────────────────────────────────
function Resources() {
  const resources = [
    {
      emoji: '📋',
      type: 'FREE PDF',
      title: 'The 60-Second Lead Response Playbook',
      desc: 'Step-by-step guide to respond to every lead in under 60 seconds — even with a 2-person team.',
    },
    {
      emoji: '✅',
      type: 'FREE CHECKLIST',
      title: 'Tech Stack Audit Checklist for Home Service Businesses',
      desc: 'Know exactly what technology gaps are costing you leads and revenue right now.',
    },
    {
      emoji: '🎥',
      type: 'FREE VIDEO',
      title: '10 Leads You\'re Losing Right Now (And How to Capture Them)',
      desc: 'Watch our founder walk through the 10 most common lead loss points — and the exact fixes.',
    },
  ]

  return (
    <section id="resources" className="py-28" style={{ background: '#1A1F3A' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-badge mb-4">FREE RESOURCES</span>
          <h2 className="text-4xl md:text-5xl mt-4 mb-3">
            Start <span className="text-gradient">Capturing More Leads</span> Today
          </h2>
          <p className="text-white/60 text-xl">No credit card. No sales call. Just results.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {resources.map(({ emoji, type, title, desc }) => (
            <div key={title}
              className="glass-card p-8 rounded-2xl hover:border-[#3DAB3D]/40 hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <div className="text-5xl mb-5">{emoji}</div>
              <div className="text-xs font-black text-[#3DAB3D] tracking-widest mb-3">{type}</div>
              <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-[#3DAB3D] transition-colors">{title}</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">{desc}</p>
              <div className="flex items-center gap-2 text-[#3DAB3D] font-semibold text-sm group-hover:gap-3 transition-all">
                Download Free <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Audit CTA ────────────────────────────────────────────────────────────────
function AuditCTA() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', revenue: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).catch(() => {})
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section id="audit" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #3DAB3D 0%, #1A6B1A 100%)' }} />
      <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
        style={{ background: 'rgba(0,0,0,0.12)' }} />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
          Find Out Exactly How Much Revenue You&apos;re Losing
        </h2>
        <p className="text-white/90 text-xl mb-10">
          Get your free personalized Lead Loss Audit — we&apos;ll show you exactly where revenue is slipping and how to capture it.
        </p>

        {submitted ? (
          <div className="glass-card p-10 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-white" />
            <h3 className="text-3xl font-bold mb-3">You&apos;re in! 🎉</h3>
            <p className="text-white/90 text-lg">
              We&apos;ll send your personalized Lead Loss Audit to <strong>{form.email}</strong> within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl p-8 text-left" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-semibold text-white/80 mb-1.5 block">Your Name *</label>
                <input id="audit-name" required className="form-input" placeholder="Mike Johnson"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80 mb-1.5 block">Business Name *</label>
                <input id="audit-business" required className="form-input" placeholder="Johnson HVAC"
                  value={form.business} onChange={e => setForm({ ...form, business: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80 mb-1.5 block">Email Address *</label>
                <input id="audit-email" type="email" required className="form-input" placeholder="mike@johnsonhvac.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80 mb-1.5 block">Phone Number</label>
                <input id="audit-phone" className="form-input" placeholder="(555) 000-0000"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="mb-6">
              <label className="text-sm font-semibold text-white/80 mb-1.5 block">Approximate Annual Revenue</label>
              <select id="audit-revenue" className="form-input" value={form.revenue} onChange={e => setForm({ ...form, revenue: e.target.value })}>
                <option value="">Select range...</option>
                <option value="under500k">Under $500K</option>
                <option value="500k-1m">$500K – $1M</option>
                <option value="1m-3m">$1M – $3M</option>
                <option value="3m-10m">$3M – $10M</option>
                <option value="over10m">Over $10M</option>
              </select>
            </div>
            <button
              id="audit-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-lg transition-all duration-200"
              style={{ background: '#0A0E27', color: 'white' }}
            >
              {loading ? 'Sending...' : 'Get My Free Lead Loss Audit →'}
            </button>
            <p className="text-white/55 text-xs text-center mt-3">
              No spam. No sales pressure. Honest analysis only. Usually responds within 24hrs.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 border-t border-white/10" style={{ background: '#1A1F3A' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Lead Matrix" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
              The complete AI-powered lead capture & automation platform for home service contractors. Respond faster. Book more. Grow.
            </p>
            <div className="mt-4 text-sm text-white/45">
              <a href="mailto:hello@leadmatrixllc.us" className="hover:text-[#3DAB3D] transition-colors">
                hello@leadmatrixllc.us
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">Platform</div>
            <div className="flex flex-col gap-3">
              {['#solution', '#pricing', '#case-studies', '#resources'].map((href) => (
                <a key={href} href={href} className="text-white/60 hover:text-white text-sm transition-colors">
                  {href.slice(1).replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">Company</div>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="text-white/60 hover:text-white text-sm transition-colors">Client Login</Link>
              <a href="#audit" className="text-white/60 hover:text-white text-sm transition-colors">Free Audit</a>
              <a href="mailto:hello@leadmatrixllc.us" className="text-white/60 hover:text-white text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/35 text-sm">
            © {new Date().getFullYear()} Lead Matrix LLC · leadmatrixllc.us
          </p>
          <p className="text-white/35 text-sm">
            Built for HVAC, plumbing & electrical contractors
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <CaseStudies />
        <Pricing />
        <Resources />
        <AuditCTA />
      </main>
      <Footer />
    </>
  )
}
