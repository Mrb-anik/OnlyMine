import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized to import' }, { status: 401 })
    }
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
    const requiredHeaders = ['name', 'email']
    const hasRequiredHeaders = requiredHeaders.every(header => headers.includes(header))

    if (!hasRequiredHeaders) {
      return NextResponse.json(
        { error: 'CSV must contain "name" and "email" columns' },
        { status: 400 }
      )
    }

    let clientId = formData.get('client_id') as string

    // Check if acting normally, lookup client_id from user.id
    if (!clientId) {
      const { data: clientData } = await adminClient
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (clientData) {
        clientId = clientData.id
      }
    }

    if (!clientId) {
      return NextResponse.json({ error: 'Could not determine a valid client profile to assign these leads' }, { status: 400 })
    }

    // Fuzzy matching functions
    const findIndex = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)))
    
    const nameIdx = findIndex(['name', 'first', 'contact', 'person'])
    const emailIdx = findIndex(['email', 'e-mail', 'mail'])
    const phoneIdx = findIndex(['phone', 'mobile', 'cell', 'number', 'tel'])
    const srcIdx = findIndex(['source', 'from', 'medium'])
    const msgIdx = findIndex(['message', 'note', 'comment'])

    const leads = []
    for (let i = 1; i < lines.length; i++) {
      // Split ignoring commas inside quotes
      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || lines[i].split(',').map(v => v.trim())
      
      const rawName = nameIdx >= 0 ? values[nameIdx] : ''
      const rawEmail = emailIdx >= 0 ? values[emailIdx] : ''
      
      const finalName = rawName || 'Unknown Lead'
      const finalEmail = rawEmail || `unknown-${Date.now()}-${i}@example.com`

      leads.push({
        client_id: clientId,
        lead_name: finalName,
        email: finalEmail,
        phone: phoneIdx >= 0 ? values[phoneIdx] : null,
        source: srcIdx >= 0 && values[srcIdx] ? values[srcIdx] : 'csv_import',
        message: msgIdx >= 0 ? values[msgIdx] : null,
        status: 'new',
      })
    }

    if (leads.length === 0) {
      return NextResponse.json({ error: 'No valid leads found in CSV' }, { status: 400 })
    }

    const { data, error } = await adminClient
      .from('leads')
      .insert(leads)
      .select()

    if (error) {
      console.error('CSV import error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${data?.length || 0} leads`,
      count: data?.length || 0,
    })
  } catch (err) {
    console.error('CSV import error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}