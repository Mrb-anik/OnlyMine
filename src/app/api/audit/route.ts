import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { resend, FROM_EMAIL } from '@/lib/resend'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, business, revenue } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Save to Supabase audit_leads table
    const { error: dbError } = await adminClient
      .from('audit_leads')
      .insert({
        name,
        email,
        phone: phone || null,
        business_name: business || null,
        revenue_range: revenue || null,
        status: 'pending',
      })

    if (dbError) {
      console.error('Supabase insert error:', dbError)
      // Don't fail — still send email even if DB insert fails
    }

    // Send confirmation email to prospect
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your Free Lead Loss Audit Request – Lead Matrix',
      html: `
        <div style="font-family: 'DM Sans', sans-serif; background: #0A0E27; color: #fff; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
          <div style="font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 900; color: #FF6B35; margin-bottom: 8px;">
            Lead<span style="color: #fff;">Matrix</span>
          </div>
          <h1 style="font-size: 28px; font-weight: 800; margin: 24px 0 12px;">
            We got your audit request, ${name}! 🎉
          </h1>
          <p style="color: rgba(255,255,255,0.75); font-size: 16px; line-height: 1.7; margin-bottom: 16px;">
            Thank you for reaching out. We're preparing your personalized <strong>Lead Loss Audit</strong> for <strong>${business}</strong>.
          </p>
          <p style="color: rgba(255,255,255,0.75); font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
            You'll hear back from us within <strong>24 hours</strong> with a detailed breakdown of where you may be losing revenue — and exactly how to capture it.
          </p>
          <div style="background: rgba(255,107,53,0.12); border: 1px solid rgba(255,107,53,0.4); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="font-weight: 700; margin: 0 0 8px; color: #FF6B35;">While you wait:</p>
            <ul style="color: rgba(255,255,255,0.75); margin: 0; padding-left: 20px; line-height: 1.9;">
              <li>78% of customers hire the first contractor to respond</li>
              <li>40–60% of leads come after business hours</li>
              <li>Average client books 35% more jobs in 90 days with Lead Matrix</li>
            </ul>
          </div>
          <p style="color: rgba(255,255,255,0.5); font-size: 14px;">
            Questions? Reply to this email or reach us at hello@leadmatrixllc.us
          </p>
        </div>
      `,
    }).catch(console.error)

    // Notify owner (you) about new audit request
    await resend.emails.send({
      from: FROM_EMAIL,
      to: 'hello@leadmatrixllc.us',
      subject: `🔔 New Audit Lead: ${business || name}`,
      html: `
        <h2>New Audit Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Business:</strong> ${business || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Revenue:</strong> ${revenue || 'N/A'}</p>
      `,
    }).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Audit API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
