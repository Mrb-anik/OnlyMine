import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

// Hardcoded admin emails. The ideal way is to have an `is_admin` boolean or a `roles` table.
const ADMIN_EMAILS = [
  'hello@leadmatrixllc.us',
  'mrb.work.aus@gmail.com',
  'mrb.anik@yahoo.com',
  'admin@leadmatrixllc.us'
] // I've added a few variations based on git commits / general defaults.

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 })
    }

    // Fetch all clients
    const { data: clients } = await adminClient
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    // Fetch all audit_leads (from homepage forms)
    const { data: auditLeads } = await adminClient
      .from('audit_leads')
      .select('*')
      .order('created_at', { ascending: false })

    // Fetch system stats
    const { count: leadsCount } = await adminClient.from('leads').select('*', { count: 'exact', head: true })
    const { count: clientsCount } = await adminClient.from('clients').select('*', { count: 'exact', head: true })

    const { data: adminSettings } = await adminClient
      .from('clients')
      .select('cal_link')
      .eq('email', 'admin-settings@leadmatrixllc.us')
      .single()

    return NextResponse.json({
      success: true,
      data: {
        adminCalLink: adminSettings?.cal_link || 'https://cal.com/lead-matrix/audit-call',
        clients: clients || [],
        auditLeads: auditLeads || [],
        stats: {
          totalLeadsSystemWide: leadsCount || 0,
          totalClients: clientsCount || 0
        }
      }
    })
  } catch (err) {
    console.error('Admin API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
