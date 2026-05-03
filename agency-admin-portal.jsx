import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

export default function MasterAgencyAdmin() {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('all');
  const [globalStats, setGlobalStats] = useState({
    managedRevenue: 0,
    totalPipeline: 0,
    avgROAS: 4.2,
    activePipelines: 0
  });
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClientId === 'all') {
      fetchGlobalStats();
    } else {
      fetchClientSpecificData(selectedClientId);
    }
  }, [selectedClientId]);

  const fetchClients = async () => {
    const { data, error } = await supabase.from('clients').select('*');
    if (!error && data) {
      setClients(data);
      setGlobalStats(prev => ({ ...prev, activePipelines: data.length }));
    }
  };

  const fetchGlobalStats = async () => {
    setLoading(true);
    const { data: leads, error } = await supabase.from('leads').select('booked, response_time');
    if (!error && leads) {
      const bookedCount = leads.filter(l => l.booked).length;
      setGlobalStats(prev => ({
        ...prev,
        managedRevenue: bookedCount * 2500,
        totalPipeline: leads.length * 1500
      }));
    }
    setLoading(false);
  };

  const fetchClientSpecificData = async (clientId) => {
    setLoading(true);
    const { data: leads, error: leadsError } = await supabase.from('leads').select('*').eq('client_id', clientId);
    const { data: client, error: clientError } = await supabase.from('clients').select('*').eq('id', clientId).single();

    if (!leadsError && leads) {
      const booked = leads.filter(l => l.booked).length;
      setClientData({
        client,
        leads,
        stats: {
          revenue: booked * 2500,
          pipeline: leads.length * 1500,
          convRate: leads.length > 0 ? Math.round((booked / leads.length) * 100) : 0,
          avgResponse: Math.round(leads.reduce((s, l) => s + (l.response_time || 0), 0) / leads.length) || 0
        }
      });
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <img src="./public/logo.png" alt="Lead Matrix" style={{height:'38px',width:'auto',display:'block',marginBottom:'3rem'}} onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='block'}} />
          <span style={{display:'none',fontFamily:"'Syne',sans-serif",fontSize:'1.4rem',fontWeight:'800',marginBottom:'3rem'}}>LEAD<span style={{color:'#3DAB3D'}}>MATRIX</span></span>
        </div>
        <div style={styles.sidebarLabel}>AGENCY COMMAND</div>
        <nav style={styles.sideNav}>
          <button 
            style={{...styles.navItem, ...(selectedClientId === 'all' ? styles.navItemActive : {})}}
            onClick={() => setSelectedClientId('all')}
          >
            🛰️ Global Portfolio
          </button>
          <div style={styles.sidebarDivider} />
          <div style={styles.sidebarLabel}>CLIENT PIPELINES</div>
          {clients.map(client => (
            <button 
              key={client.id}
              style={{...styles.navItem, ...(selectedClientId === client.id ? styles.navItemActive : {})}}
              onClick={() => setSelectedClientId(client.id)}
            >
              🏢 {client.business_name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>
            {selectedClientId === 'all' ? 'Agency Portfolio Overview' : `Client Command: ${clientData?.client?.business_name}`}
          </h1>
          <div style={styles.statusIndicator}>
            <div style={styles.pulse} /> System Operational
          </div>
        </header>

        {selectedClientId === 'all' ? (
          <GlobalDashboard stats={globalStats} clients={clients} />
        ) : (
          <ClientSuite data={clientData} loading={loading} />
        )}
      </main>
    </div>
  );
}

// --- SUB-DASHBOARD COMPONENTS ---

function GlobalDashboard({ stats, clients }) {
  return (
    <div style={styles.dashGrid}>
      <div style={styles.statsRow}>
        <StatCard label="Managed Revenue" value={formatCurrency(stats.managedRevenue)} color="#4CAF50" />
        <StatCard label="Total Pipeline" value={formatCurrency(stats.totalPipeline)} color="#56C240" />
        <StatCard label="Portfolio Avg ROAS" value="4.8x" color="#7ED348" />
        <StatCard label="Active Clients" value={stats.activePipelines} color="#FFF" />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Client Health Matrix</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Client</th>
              <th style={styles.th}>Revenue MTD</th>
              <th style={styles.th}>Conv %</th>
              <th style={styles.th}>Response Time</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} style={styles.tr}>
                <td style={styles.td}>{client.business_name}</td>
                <td style={styles.td}>$12,400</td>
                <td style={styles.td}>32%</td>
                <td style={styles.td}>42s</td>
                <td style={styles.td}><span style={styles.healthOk}>OPTIMIZED</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientSuite({ data, loading }) {
  if (loading || !data) return <div style={styles.loading}>Processing Revenue Logic...</div>;

  return (
    <div style={styles.dashGrid}>
      {/* Dashboard 1: Revenue Command Center */}
      <div style={styles.statsRow}>
        <StatCard label="Realized Revenue" value={formatCurrency(data.stats.revenue)} color="#56C240" />
        <StatCard label="Pipeline Value" value={formatCurrency(data.stats.pipeline)} color="#3DAB3D" />
        <StatCard label="Conversion" value={`${data.stats.convRate}%`} color="#7ED348" />
        <StatCard label="Response Velocity" value={`${data.stats.avgResponse}s`} color="#FFF" />
      </div>

      <div style={styles.dashboardSplit}>
        {/* Dashboard 2: Lead Engine & Conversion */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Lead Engine: Flow Analysis</h2>
          <div style={styles.metricList}>
            <MetricItem label="Total Inbound" value={data.leads.length} />
            <MetricItem label="Website Clicks" value="1,240" />
            <MetricItem label="Cost Per Lead" value="$42.10" />
            <MetricItem label="Marketing ROI" value="5.2x" />
          </div>
        </div>

        {/* Dashboard 3: Bottleneck Detector */}
        <div style={{...styles.section, borderColor: '#FF4D4D'}}>
          <h2 style={{...styles.sectionTitle, color: '#FF4D4D'}}>💀 Bottleneck Detector</h2>
          <div style={styles.alertItem}>
            <strong>Leaking Revenue:</strong> 12 prospects stalled in "Contacted" stage {'>'} 48h.
          </div>
          <div style={styles.alertItem}>
            <strong>Response Lag:</strong> Weekend response velocity dropped to 180s.
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Pipeline Tracker (Active Deals)</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Prospect</th>
              <th style={styles.th}>Value</th>
              <th style={styles.th}>Source</th>
              <th style={styles.th}>Stage</th>
            </tr>
          </thead>
          <tbody>
            {data.leads.slice(0, 5).map(lead => (
              <tr key={lead.id} style={styles.tr}>
                <td style={styles.td}>{lead.lead_name}</td>
                <td style={styles.td}>$2,500</td>
                <td style={styles.td}>{lead.source}</td>
                <td style={styles.td}>{lead.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- UTILS & COMPONENTS ---

function StatCard({ label, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{...styles.statValue, color}}>{value}</div>
    </div>
  );
}

function MetricItem({ label, value }) {
  return (
    <div style={styles.metricItem}>
      <span>{label}</span>
      <span style={{fontWeight: '700'}}>{value}</span>
    </div>
  );
}

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#040B04', color: '#FFF', fontFamily: "'Inter', sans-serif" },
  sidebar: { width: '300px', backgroundColor: '#060D06', borderRight: '1px solid rgba(61,171,61,0.12)', padding: '2rem' },
  logo: { fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: '800', marginBottom: '3rem' },
  sidebarLabel: { fontSize: '0.7rem', color: '#8FA88F', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '1rem' },
  sideNav: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  navItem: { background: 'transparent', border: 'none', color: '#8FA88F', textAlign: 'left', padding: '0.8rem 1rem', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' },
  navItemActive: { backgroundColor: 'rgba(61,171,61,0.1)', color: '#3DAB3D', fontWeight: '700' },
  sidebarDivider: { height: '1px', background: 'rgba(61,171,61,0.08)', margin: '1.5rem 0' },
  main: { flex: 1, padding: '3rem', overflowY: 'auto', background: '#05080A' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' },
  title: { fontFamily: "'Syne', sans-serif", fontSize: '2rem' },
  statusIndicator: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4CAF50', fontSize: '0.8rem', fontWeight: '700' },
  pulse: { width: '8px', height: '8px', background: '#4CAF50', borderRadius: '50%', animation: 'pulse 2s infinite' },
  dashGrid: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' },
  statCard: { background: '#080F08', border: '1px solid rgba(61,171,61,0.12)', padding: '1.5rem', borderRadius: '8px' },
  statLabel: { fontSize: '0.75rem', color: '#8F9BB3', textTransform: 'uppercase', marginBottom: '0.5rem' },
  statValue: { fontSize: '1.8rem', fontWeight: '800', fontFamily: "'Syne', sans-serif" },
  section: { background: '#080F08', border: '1px solid rgba(61,171,61,0.12)', padding: '2rem', borderRadius: '8px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', textTransform: 'uppercase', fontFamily: "'Syne', sans-serif" },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '1rem', color: '#8F9BB3', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  td: { padding: '1rem', borderBottom: '1px solid rgba(61,171,61,0.05)', fontSize: '0.9rem' },
  tr: { transition: 'background 0.2s' },
  healthOk: { color: '#56C240', fontSize: '0.7rem', fontWeight: '800', background: 'rgba(86,194,64,0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px' },
  dashboardSplit: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
  metricList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  metricItem: { display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' },
  alertItem: { background: 'rgba(255,77,77,0.05)', borderLeft: '3px solid #FF4D4D', padding: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#FFB8B8' },
  loading: { padding: '5rem', textAlign: 'center', color: '#8FA88F' }
};
