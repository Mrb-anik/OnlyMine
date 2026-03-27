import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

// n8n calls this to create/update leads in Supabase
// Auth: expect X-Webhook-Secret header
export async function POST(req: Request) {
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== process.env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { client_id, name, phone, email, source, message, response_time, status } = body

    if (!client_id) {
      return NextResponse.json({ error: 'client_id required' }, { status: 400 })
    }

    const { data, error } = await adminClient
      .from('leads')
      .insert({
        client_id,
        lead_name: name || null,
        phone: phone || null,
        email: email || null,
        source: source || 'other',
        message: message || null,
        response_time: response_time ?? null,
        status: status || 'new',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Lead insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, lead_id: data.id })
  } catch (err) {
    console.error('n8n lead webhook error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// n8n calls this to update lead status/response_time
export async function PATCH(req: Request) {
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== process.env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { lead_id, status, response_time, booked } = body

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (status) updates.status = status
    if (response_time !== undefined) updates.response_time = response_time
    if (booked !== undefined) updates.booked = booked

    const { error } = await adminClient
      .from('leads')
      .update(updates)
      .eq('id', lead_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('n8n lead update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
