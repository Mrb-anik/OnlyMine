import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@leadmatrixllc.us'

/**
 * Lead Matrix - Automated Follow-Up Cron Job
 * This API is triggered by Vercel Cron or any scheduled trigger.
 * It checks for "pending" audit leads and sends follow-ups at 1, 3, and 7 days.
 */
export async function GET(req: Request) {
  try {
    // 1. Verify Request (simple check for CRON_SECRET if set)
    const authHeader = req.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // 2. Fetch leads in the "follow-up window"
    // We only follow up if status is 'pending' (hasn't booked or been contacted manually)
    const { data: leads, error: dbError } = await adminClient
      .from('audit_leads')
      .select('*')
      .eq('status', 'pending')
      .lte('created_at', oneDayAgo.toISOString()) // At least 24h old

    if (dbError) throw dbError
    if (!leads || leads.length === 0) return NextResponse.json({ message: 'No leads to follow up' })

    const results = []

    for (const lead of leads) {
      const createdAt = new Date(lead.created_at)
      const dayDiff = Math.floor((now.getTime() - createdAt.getTime()) / (24 * 60 * 60 * 1000))

      // 3. Determine Step (Day 1, 3, or 7)
      let sequenceType = ''
      let subject = ''
      let message = ''

      if (dayDiff === 1) {
        sequenceType = 'follow_up_day_1'
        subject = `${lead.name}, still interested in your Lead Loss Audit?`
        message = `Quick follow-up - I saw you requested a free audit for ${lead.business_name || 'your company'} yesterday, but didn't get a chance to book your call yet.`
      } else if (dayDiff === 3) {
        sequenceType = 'follow_up_day_3'
        subject = `Last chance for your free audit call, ${lead.name}`
        message = `I'm holding your spot for 24 more hours. Most HVAC/Plumbing owners find at least $50k in hidden revenue during this call.`
      } else if (dayDiff === 7) {
        sequenceType = 'follow_up_day_7'
        subject = `Closing your audit request for ${lead.business_name || 'your company'}`
        message = `No worries if you're not interested right now! I'll close this audit request out for you.`
      } else {
        continue // Skip if not on a target day
      }

      // 4. Check if sequence already sent
      const { data: existing } = await adminClient
        .from('email_sequences')
        .select('id')
        .eq('lead_id', lead.id)
        .eq('sequence_type', sequenceType)
        .single()

      if (existing) continue // Skip if already sent

      // 5. Send Follow-up Email
      const emailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: lead.email,
        subject,
        html: `
          <div style="font-family: sans-serif; background: #0A0E27; color: #fff; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
            <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">Hi ${lead.name},</p>
            <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">${message}</p>
            <div style="margin: 32px 0;">
               <a href="https://cal.com/lead-matrix/audit-call" style="display: inline-block; background: #FF6B35; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px;">
                 Choose a Time to Talk →
               </a>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.5);">Best,<br>Lead Matrix Team</p>
          </div>
        `,
      })

      // 6. Log completion
      if (!emailResult.error) {
        await adminClient.from('email_sequences').insert({
          lead_id: lead.id,
          sequence_type: sequenceType,
          email_subject: subject,
          email_body: message,
        })
        
        await adminClient.from('automation_logs').insert({
          lead_id: lead.id,
          action_type: 'follow_up_sent',
          details: { day: dayDiff, sequence: sequenceType, email_id: emailResult.data?.id },
          success: true
        })
      }

      results.push({ lead_id: lead.id, sequenceType, success: !emailResult.error })
    }

    return NextResponse.json({ success: true, results })
  } catch (err) {
    console.error('Follow-up cron error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}