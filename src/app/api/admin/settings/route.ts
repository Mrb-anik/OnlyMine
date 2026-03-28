import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = [
  'hello@leadmatrixllc.us',
  'mrb.work.aus@gmail.com',
  'mrb.anik@yahoo.com',
  'admin@leadmatrixllc.us'
]

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || (!user.email && !ADMIN_EMAILS.includes(user.email ?? ''))) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 })
    }

    const body = await req.json()
    const { calLink } = body

    if (!calLink) {
        return NextResponse.json({ error: 'Cal.com link is required' }, { status: 400 })
    }

    // Check if the settings row exists
    const { data: existing } = await adminClient
        .from('clients')
        .select('id')
        .eq('email', 'admin-settings@leadmatrixllc.us')
        .single()

    if (existing) {
        const { error } = await adminClient.from('clients').update({ cal_link: calLink }).eq('id', existing.id)
        if (error) throw error
    } else {
        const { error } = await adminClient.from('clients').insert({
            email: 'admin-settings@leadmatrixllc.us',
            business_name: 'Lead Matrix System Settings',
            industry: 'other',
            plan: 'growth-engine',
            cal_link: calLink,
            active: true
        })
        if (error) throw error
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' })
  } catch (err) {
    console.error('Admin settings error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
