import React, { useState, useEffect } from 'react'
import { Users, AlertCircle, UploadCloud, CheckCircle, Link as LinkIcon, Save } from 'lucide-react'

export function AdminTab({ userEmail }: { userEmail: string }) {
  const [data, setData] = useState<{ clients: any[], auditLeads: any[], stats: any, adminCalLink: string } | null>(null)
  const [adminCalLink, setAdminCalLink] = useState('')
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsSuccess, setSettingsSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadClientId, setUploadClientId] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState('')

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(d => {
        if (d.success) {
           setData(d.data)
           setAdminCalLink(d.data.adminCalLink)
        }
        else setError(d.error || 'Failed to load admin data')
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile || !uploadClientId) {
       setError('Please select a client and a CSV file.')
       return
    }
    setUploading(true)
    setError('')
    setUploadSuccess('')

    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('client_id', uploadClientId)

    try {
      const res = await fetch('/api/leads/import-csv', { method: 'POST', body: formData })
      const json = await res.json()
      if (res.ok) setUploadSuccess(json.message)
      else setError(json.error || 'Upload failed')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
      setUploadFile(null)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSettings(true)
    setError('')
    setSettingsSuccess('')
    try {
       const res = await fetch('/api/admin/settings', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ calLink: adminCalLink })
       })
       const json = await res.json()
       if (res.ok) setSettingsSuccess(json.message)
       else setError(json.error || 'Failed to save settings')
    } catch (err: any) {
       setError(err.message)
    } finally {
       setSavingSettings(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-white/50">Loading Admin Hub...</div>
  if (error && !data) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!data) return null

  return (
    <div className="space-y-8 animate-in fade-in">
      <h2 className="text-3xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif' }}>
        Admin Hub
      </h2>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
      {uploadSuccess && <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {uploadSuccess}</div>}
      {settingsSuccess && <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {settingsSuccess}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl">
           <div className="text-sm text-white/50 mb-1">Total System Clients</div>
           <div className="text-2xl font-bold">{data.stats.totalClients}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
           <div className="text-sm text-white/50 mb-1">Total System Leads</div>
           <div className="text-2xl font-bold">{data.stats.totalLeadsSystemWide}</div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
         <div className="p-6 border-b border-white/10 font-bold flex items-center gap-2">
           <UploadCloud className="w-5 h-5 text-[#FF6B35]" /> Upload Leads CSV
         </div>
         <form onSubmit={handleUpload} className="p-6 flex flex-col md:flex-row gap-4 items-end">
           <div className="flex-1">
             <label className="text-xs text-white/60 mb-2 block font-bold uppercase tracking-wider">Select Client</label>
             <select className="form-input" value={uploadClientId} onChange={e => setUploadClientId(e.target.value)} required>
               <option value="">-- Choose a Client --</option>
               {data.clients.map((c: any) => <option key={c.id} value={c.id}>{c.business_name} ({c.email})</option>)}
             </select>
           </div>
           <div className="flex-1">
             <label className="text-xs text-white/60 mb-2 block font-bold uppercase tracking-wider">CSV File</label>
             <input type="file" accept=".csv" className="form-input !p-2 cursor-pointer" onChange={e => setUploadFile(e.target.files?.[0] || null)} required />
           </div>
           <button type="submit" disabled={uploading || !uploadFile || !uploadClientId} className="btn-primary w-full md:w-auto h-11 px-8 rounded-xl font-bold hover:-translate-y-0.5 transition-all">
             {uploading ? 'Uploading...' : 'Import Leads'}
           </button>
         </form>
         <div className="px-6 pb-6 text-xs text-white/40">
           Note: The CSV must contain at minimum 'name' and 'email' header columns.
         </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden mt-8">
         <div className="p-6 border-b border-white/10 font-bold flex items-center gap-2">
           <LinkIcon className="w-5 h-5 text-[#00D9FF]" /> System Settings
         </div>
         <form onSubmit={handleSaveSettings} className="p-6 flex flex-col sm:flex-row gap-4 items-end">
           <div className="flex-1 w-full">
             <label className="text-xs text-white/60 mb-2 block font-bold uppercase tracking-wider">Master Booking Link (Cal.com URL)</label>
             <input type="url" className="form-input" value={adminCalLink} onChange={e => setAdminCalLink(e.target.value)} required placeholder="https://cal.com/your-name/audit-call" />
           </div>
           <button type="submit" disabled={savingSettings || !adminCalLink} className="btn-primary w-full sm:w-auto h-11 px-8 rounded-xl font-bold hover:-translate-y-0.5 transition-all flex items-center gap-2">
             <Save className="w-4 h-4" />
             {savingSettings ? 'Saving...' : 'Save Settings'}
           </button>
         </form>
         <div className="px-6 pb-6 text-xs text-white/40">
           This link will be sent to all inbound prospects who request a website lead audit.
         </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden mt-8">
        <div className="p-6 font-bold border-b border-white/10 flex items-center justify-between">
          <span>Recent Web Audit Submissions</span>
          <span className="text-xs px-2 py-1 rounded bg-white/5">{data.auditLeads.length} Total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead>
               <tr className="border-b border-white/10 text-white/40">
                 <th className="p-4 font-normal">Date</th>
                 <th className="p-4 font-normal">Business</th>
                 <th className="p-4 font-normal">Contact</th>
                 <th className="p-4 font-normal">Status</th>
               </tr>
             </thead>
             <tbody>
               {data.auditLeads.slice(0, 20).map((lead: any) => (
                 <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                   <td className="p-4 text-white/60">{new Date(lead.created_at).toLocaleDateString()}</td>
                   <td className="p-4 font-medium">{lead.business_name || lead.name}</td>
                   <td className="p-4">
                     <div className="text-white">{lead.email}</div>
                     <div className="text-xs text-white/40">{lead.phone || 'No phone'}</div>
                   </td>
                   <td className="p-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${lead.status === 'pending' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                        {lead.status}
                     </span>
                   </td>
                 </tr>
               ))}
               {data.auditLeads.length === 0 && (
                 <tr><td colSpan={4} className="p-8 text-center text-white/40">No audit leads yet.</td></tr>
               )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
