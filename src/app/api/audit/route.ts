import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { generateCalLink } from '@/lib/cal'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@leadmatrixllc.us'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, business, revenue } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const startTime = Date.now()

    // 1. Save lead to Supabase
    const { data: leadData, error: dbError } = await adminClient
      .from('audit_leads')
      .insert({
        name,
        email,
        phone: phone || null,
        business_name: business || null,
        revenue_range: revenue || null,
        status: 'pending',
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // We continue even if DB fails to log, to prioritize the customer experience
    }

    // 2. Generate the Lead Matrix Audit Cal.com link
    // Replace 'leadmatrix' and 'audit-call' with your actual Cal.com details
    const calLink = generateCalLink('leadmatrix', 'audit-call')

    // 3. Send AUTO-RESPONSE EMAIL (Speed to Lead)
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${name}, let's talk about ${business || 'your business'}`,
      html: `
        <div style="font-family: sans-serif; background: #0A0E27; color: #fff; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B35; font-size: 24px; margin-bottom: 16px;">Thanks for your interest, ${name}! 👋</h2>
          <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">
            I've received your request for a <strong>Free Lead Loss Audit</strong> for ${business || 'your company'}. 
            Most contracting businesses we audit are losing between $30k - $200k a year simply by responding too slowly.
          </p>
          <div style="background: rgba(255,107,53,0.1); border: 2px solid #FF6B35; padding: 24px; border-radius: 12px; margin: 32px 0; text-align: center;">
             <p style="font-weight: bold; margin-bottom: 16px;">📅 Choose a time for your 15-min audit call:</p>
             <a href="${calLink}" style="display: inline-block; background: #FF6B35; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px;">
               Book My Free Audit →
             </a>
          </div>
          <p style="font-size: 14px; color: rgba(255,255,255,0.5);">
            Talk soon,<br>The Lead Matrix Team
          </p>
        </div>
      `,
    })

    const responseTime = Math.round((Date.now() - startTime) / 1000)

    // 4. Log the automation event
    if (leadData) {
      await adminClient.from('automation_logs').insert({
        lead_id: leadData.id,
        action_type: 'initial_auto_response',
        details: {
          email_id: emailData?.id,
          response_time_seconds: responseTime,
          cal_link: calLink,
        },
        success: !emailError,
        error_message: emailError?.message || null,
      })
      
      // Initialize the sequence trackers
      await adminClient.from('email_sequences').insert({
        lead_id: leadData.id,
        sequence_type: 'initial_response',
        email_subject: `${name}, let's talk about ${business || 'your business'}`,
        email_body: 'Initial speed-to-lead auto-response sent.',
      })
    }

    // 5. Notify the Owner (Non-blocking)
    resend.emails.send({
      from: FROM_EMAIL,
      to: 'hello@leadmatrixllc.us',
      subject: `🔔 NEW AUDIT LEAD: ${business || name} (${responseTime}s response)`,
      html: `
        <h3>New Lead Details:</h3>
        <p><b>Name:</b> ${name}<br><b>Email:</b> ${email}<br><b>Phone:</b> ${phone || 'N/A'}<br><b>Business:</b> ${business || 'N/A'}<br><b>Revenue:</b> ${revenue || 'N/A'}</p>
        <p><b>Auto-response sent in ${responseTime} seconds.</b></p>
      `,
    }).catch(e => console.error('Owner notification failed', e))

    return NextResponse.json({ 
      success: true, 
      responseTime,
      auditId: leadData?.id
    })
  } catch (err) {
    console.error('Audit API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
