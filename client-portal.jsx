import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

export default function LeadMatrixPortal() {
  const [leads, setLeads] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pipelineValue: 0,
    avgResponseTime: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('today');

  useEffect(() => {
    fetchDashboardData();
    
    const leadsSubscription = supabase
      .channel('revenue_channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          setLeads(prev => [payload.new, ...prev]);
          updateStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsSubscription);
    };
  }, [timeframe]);

  const fetchDashboardData = async () => {
    setLoading(true);
    const timeFilter = getTimeFilter(timeframe);
    
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', timeFilter)
      .order('created_at', { ascending: false });

    if (!leadsError && leadsData) {
      setLeads(leadsData);
    }

    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .gte('created_at', timeFilter)
      .order('scheduled_date', { ascending: true });

    if (!appointmentsError && appointmentsData) {
      setAppointments(appointmentsData);
    }

    if (leadsData) {
      const bookedCount = leadsData.filter(l => l.booked).length;
      const avgResponse = leadsData.reduce((sum, l) => sum + (l.response_time || 0), 0) / leadsData.length || 0;
      
      // Simulated revenue metrics for demonstration
      setStats({
        totalRevenue: bookedCount * 2500, // Assuming $2.5k per booking
        pipelineValue: leadsData.length * 1500,
        avgResponseTime: Math.round(avgResponse),
        conversionRate: leadsData.length > 0 ? Math.round((bookedCount / leadsData.length) * 100) : 0
      });
    }

    setLoading(false);
  };

  const getTimeFilter = (timeframe) => {
    const now = new Date();
    switch(timeframe) {
      case 'today': return new Date(now.setHours(0, 0, 0, 0)).toISOString();
      case 'week': return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'month': return new Date(now.setDate(now.getDate() - 30)).toISOString();
      default: return new Date(now.setHours(0, 0, 0, 0)).toISOString();
    }
  };

  const updateStats = () => fetchDashboardData();
  const formatTime = (seconds) => seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    const colors = { new: '#FF6B35', contacted: '#00F5FF', booked: '#4CAF50', lost: '#8F9BB3' };
    return colors[status] || '#8F9BB3';
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>LEAD<span>MATRIX</span></div>
          <div style={styles.headerRight}>
            <div style={styles.liveIndicator}>
              <span style={styles.liveDot}></span>
              <span style={styles.liveText}>REVENUE ENGINE LIVE</span>
            </div>
          </div>
        </div>
      </header>

      <div style={styles.main}>
        <div style={styles.topRow}>
          <div style={styles.timeframeSelector}>
            {['today', 'week', 'month'].map(t => (
              <button 
                key={t}
                style={{...styles.timeframeButton, ...(timeframe === t ? styles.timeframeActive : {})}}
                onClick={() => setTimeframe(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <button style={styles.refreshButton} onClick={fetchDashboardData}>Sync Data</button>
        </div>

        <div style={styles.statsGrid}>
          <StatCard label="Realized Revenue" value={formatCurrency(stats.totalRevenue)} color="#4CAF50" sub="+12.5% vs prev." />
          <StatCard label="Pipeline Value" value={formatCurrency(stats.pipelineValue)} color="#FF6B35" sub="Open Opportunities" />
          <StatCard label="Avg Response" value={formatTime(stats.avgResponseTime)} color="#00F5FF" sub="Target: < 60s" />
          <StatCard label="Conv. Rate" value={`${stats.conversionRate}%`} color="#FFFFFF" sub="Lead to Closed" />
        </div>

        <div style={styles.dashboardGrid}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Active Revenue Pipeline</h2>
            {loading ? <div style={styles.loading}>Analyzing pipeline...</div> : 
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Contact</th>
                      <th style={styles.th}>Source</th>
                      <th style={styles.th}>Response</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.leadName}>{lead.lead_name || 'Prospect'}</div>
                          <div style={styles.leadSub}>{lead.phone}</div>
                        </td>
                        <td style={styles.td}><span style={styles.sourceBadge}>{lead.source}</span></td>
                        <td style={styles.td}><span style={{color: lead.response_time < 60 ? '#4CAF50' : '#FF6B35'}}>{formatTime(lead.response_time || 0)}</span></td>
                        <td style={styles.td}>
                          <span style={{...styles.statusBadge, border: `1px solid ${getStatusColor(lead.status)}`, color: getStatusColor(lead.status)}}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Conversion Schedule</h2>
            <div style={styles.appointmentsGrid}>
              {appointments.slice(0, 4).map((apt) => (
                <div key={apt.id} style={styles.appointmentCard}>
                  <div style={styles.aptTime}>{formatDate(apt.scheduled_date)}</div>
                  <div style={styles.aptName}>{apt.customer_name}</div>
                  <div style={styles.aptService}>{apt.service_type}</div>
                  <div style={{...styles.statusBadge, marginTop: '1rem', background: 'rgba(255,255,255,0.05)'}}>{apt.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, sub }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{...styles.statValue, color}}>{value}</div>
      <div style={styles.statSub}>{sub}</div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#05070A', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" },
  header: { borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem 2rem', background: '#0A0E14' },
  headerContent: { maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: '800' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  liveIndicator: { display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(76, 175, 80, 0.1)', padding: '0.6rem 1.2rem', borderRadius: '4px', border: '1px solid rgba(76, 175, 80, 0.2)' },
  liveDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4CAF50' },
  liveText: { fontSize: '0.75rem', fontWeight: '700', color: '#4CAF50', letterSpacing: '0.05em' },
  main: { maxWidth: '1400px', margin: '0 auto', padding: '2rem' },
  topRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' },
  timeframeSelector: { display: 'flex', gap: '0.5rem', background: '#121720', padding: '0.4rem', borderRadius: '4px' },
  timeframeButton: { background: 'transparent', border: 'none', color: '#8F9BB3', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' },
  timeframeActive: { backgroundColor: '#FF6B35', color: '#FFF' },
  refreshButton: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  statCard: { background: '#0A0E14', border: '1px solid rgba(255,255,255,0.08)', padding: '2rem', borderRadius: '8px' },
  statLabel: { fontSize: '0.8rem', color: '#8F9BB3', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  statValue: { fontSize: '2.2rem', fontWeight: '800', fontFamily: "'Syne', sans-serif", marginBottom: '0.5rem' },
  statSub: { fontSize: '0.75rem', color: '#8F9BB3' },
  dashboardGrid: { display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' },
  section: { background: '#0A0E14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2rem' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: '700', marginBottom: '2rem', fontFamily: "'Syne', sans-serif", textTransform: 'uppercase' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '1rem', color: '#8F9BB3', fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.03)' },
  td: { padding: '1.2rem 1rem' },
  leadName: { fontWeight: '700', fontSize: '0.95rem' },
  leadSub: { fontSize: '0.8rem', color: '#8F9BB3' },
  sourceBadge: { background: 'rgba(0,245,255,0.05)', color: '#00F5FF', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' },
  statusBadge: { padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' },
  appointmentsGrid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  appointmentCard: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' },
  aptTime: { fontSize: '0.8rem', color: '#FF6B35', fontWeight: '700', marginBottom: '0.5rem' },
  aptName: { fontSize: '1.1rem', fontWeight: '700' },
  aptService: { fontSize: '0.85rem', color: '#8F9BB3' },
  loading: { padding: '4rem', textAlign: 'center', color: '#8F9BB3' }
};
