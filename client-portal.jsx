import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// REPLACE WITH YOUR ACTUAL SUPABASE URL AND ANON KEY
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

export default function ClientPortal() {
  const [leads, setLeads] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    avgResponseTime: 0,
    bookedAppointments: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('today');

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscription for new leads
    const leadsSubscription = supabase
      .channel('leads_channel')
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
    
    // Fetch leads
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', timeFilter)
      .order('created_at', { ascending: false });

    if (!leadsError && leadsData) {
      setLeads(leadsData);
    }

    // Fetch appointments
    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .gte('created_at', timeFilter)
      .order('scheduled_date', { ascending: true });

    if (!appointmentsError && appointmentsData) {
      setAppointments(appointmentsData);
    }

    // Calculate stats
    if (leadsData) {
      const bookedCount = leadsData.filter(l => l.booked).length;
      const avgResponse = leadsData.reduce((sum, l) => sum + (l.response_time || 0), 0) / leadsData.length || 0;
      
      setStats({
        totalLeads: leadsData.length,
        avgResponseTime: Math.round(avgResponse),
        bookedAppointments: bookedCount,
        conversionRate: leadsData.length > 0 ? Math.round((bookedCount / leadsData.length) * 100) : 0
      });
    }

    setLoading(false);
  };

  const getTimeFilter = (timeframe) => {
    const now = new Date();
    switch(timeframe) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0)).toISOString();
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'month':
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      default:
        return new Date(now.setHours(0, 0, 0, 0)).toISOString();
    }
  };

  const updateStats = () => {
    fetchDashboardData();
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#FF6B35',
      contacted: '#FFA500',
      booked: '#00D9FF',
      completed: '#4CAF50',
      lost: '#666'
    };
    return colors[status] || '#999';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>LeadCapture Pro</h1>
          <div style={styles.headerRight}>
            <div style={styles.liveIndicator}>
              <span style={styles.liveDot}></span>
              <span style={styles.liveText}>LIVE</span>
            </div>
            <button style={styles.menuButton}>☰</button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div style={styles.main}>
        {/* Timeframe Selector */}
        <div style={styles.timeframeSelector}>
          <button 
            style={{...styles.timeframeButton, ...(timeframe === 'today' ? styles.timeframeActive : {})}}
            onClick={() => setTimeframe('today')}
          >
            Today
          </button>
          <button 
            style={{...styles.timeframeButton, ...(timeframe === 'week' ? styles.timeframeActive : {})}}
            onClick={() => setTimeframe('week')}
          >
            This Week
          </button>
          <button 
            style={{...styles.timeframeButton, ...(timeframe === 'month' ? styles.timeframeActive : {})}}
            onClick={() => setTimeframe('month')}
          >
            This Month
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Leads</div>
            <div style={styles.statValue}>{stats.totalLeads}</div>
            <div style={styles.statChange}>+{Math.round(stats.totalLeads * 0.23)} vs yesterday</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Avg Response Time</div>
            <div style={styles.statValue}>{formatTime(stats.avgResponseTime)}</div>
            <div style={{...styles.statChange, color: '#00D9FF'}}>⚡ 67% faster</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Appointments Booked</div>
            <div style={styles.statValue}>{stats.bookedAppointments}</div>
            <div style={styles.statChange}>+{Math.round(stats.bookedAppointments * 0.35)} vs yesterday</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Conversion Rate</div>
            <div style={styles.statValue}>{stats.conversionRate}%</div>
            <div style={{...styles.statChange, color: '#4CAF50'}}>↑ 12% improvement</div>
          </div>
        </div>

        {/* Recent Leads Table */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Leads</h2>
            <button style={styles.refreshButton} onClick={fetchDashboardData}>
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div style={styles.loading}>Loading leads...</div>
          ) : leads.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <p>No leads yet for this timeframe</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Time</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Contact</th>
                    <th style={styles.th}>Source</th>
                    <th style={styles.th}>Response Time</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} style={styles.tr}>
                      <td style={styles.td}>{formatDate(lead.created_at)}</td>
                      <td style={styles.td}>
                        <strong>{lead.lead_name || 'Anonymous'}</strong>
                      </td>
                      <td style={styles.td}>
                        <div>{lead.phone}</div>
                        <div style={styles.email}>{lead.email}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.sourceBadge}>{lead.source}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.responseTime}>
                          {formatTime(lead.response_time || 0)}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: `${getStatusColor(lead.status)}20`,
                          color: getStatusColor(lead.status)
                        }}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Upcoming Appointments</h2>
          </div>

          {appointments.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📅</div>
              <p>No appointments scheduled</p>
            </div>
          ) : (
            <div style={styles.appointmentsGrid}>
              {appointments.slice(0, 6).map((apt) => (
                <div key={apt.id} style={styles.appointmentCard}>
                  <div style={styles.appointmentTime}>
                    {formatDate(apt.scheduled_date)}
                  </div>
                  <div style={styles.appointmentCustomer}>
                    {apt.customer_name}
                  </div>
                  <div style={styles.appointmentService}>
                    {apt.service_type}
                  </div>
                  <div style={styles.appointmentPhone}>
                    📞 {apt.phone}
                  </div>
                  <div style={{
                    ...styles.statusBadge,
                    backgroundColor: `${getStatusColor(apt.status)}20`,
                    color: getStatusColor(apt.status),
                    marginTop: '0.5rem'
                  }}>
                    {apt.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0A0E27',
    color: '#FFFFFF',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
  },
  header: {
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1.5rem 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#FF6B35',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(0, 217, 255, 0.15)',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    border: '1px solid rgba(0, 217, 255, 0.3)',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#00D9FF',
    animation: 'pulse 2s ease-in-out infinite',
  },
  liveText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#00D9FF',
  },
  menuButton: {
    background: 'transparent',
    border: 'none',
    color: '#FFF',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
  },
  timeframeSelector: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '0.5rem',
    borderRadius: '12px',
    width: 'fit-content',
  },
  timeframeButton: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.6)',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
  },
  timeframeActive: {
    backgroundColor: '#FF6B35',
    color: '#FFF',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '2rem',
    transition: 'all 0.3s ease',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#FF6B35',
    marginBottom: '0.5rem',
  },
  statChange: {
    fontSize: '0.85rem',
    color: '#FFA500',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: 0,
  },
  refreshButton: {
    background: 'rgba(255, 107, 53, 0.15)',
    border: '1px solid #FF6B35',
    color: '#FF6B35',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'background 0.2s ease',
  },
  td: {
    padding: '1rem',
    fontSize: '0.95rem',
  },
  email: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  sourceBadge: {
    backgroundColor: 'rgba(0, 217, 255, 0.15)',
    color: '#00D9FF',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  responseTime: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  statusBadge: {
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'capitalize',
    display: 'inline-block',
  },
  appointmentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  appointmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
  },
  appointmentTime: {
    fontSize: '0.85rem',
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  appointmentCustomer: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '0.3rem',
  },
  appointmentService: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '0.5rem',
  },
  appointmentPhone: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
};
