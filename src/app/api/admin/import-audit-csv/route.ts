import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Invalid file type. Only CSV files are supported.' }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file must contain headers and at least one data row' }, { status: 400 })
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    // Fuzzy matching functions
    const findIndex = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)))
    
    const nameIdx = findIndex(['name', 'first', 'contact', 'person'])
    const emailIdx = findIndex(['email', 'e-mail', 'mail'])
    const phoneIdx = findIndex(['phone', 'mobile', 'cell', 'number', 'tel'])
    const businessIdx = findIndex(['business', 'company', 'org', 'dealership'])
    const revIdx = findIndex(['revenue', 'income', 'sales'])

    const auditLeads = []
    for (let i = 1; i < lines.length; i++) {
      // Split ignoring commas inside quotes
      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || lines[i].split(',').map(v => v.trim())
      
      const rawName = nameIdx >= 0 ? values[nameIdx] : ''
      const rawEmail = emailIdx >= 0 ? values[emailIdx] : ''
      
      const finalName = rawName || 'Unknown Contact'
      const finalEmail = rawEmail || `unknown-${Date.now()}-${i}@example.com`

      auditLeads.push({
        name: finalName,
        email: finalEmail,
        phone: phoneIdx >= 0 ? values[phoneIdx] : null,
        business_name: businessIdx >= 0 ? values[businessIdx] : null,
        revenue_range: revIdx >= 0 ? values[revIdx] : null,
        status: 'pending',
      })
    }

    if (auditLeads.length === 0) {
      return NextResponse.json({ error: 'No valid leads found in CSV' }, { status: 400 })
    }

    const { data, error } = await adminClient
      .from('audit_leads')
      .insert(auditLeads)
      .select()

    if (error) {
      console.error('CSV import error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${data?.length || 0} prospects into Audit Leads`,
      count: data?.length || 0,
    })
  } catch (err) {
    console.error('CSV import error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
