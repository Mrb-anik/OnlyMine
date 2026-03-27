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
    const requiredHeaders = ['name', 'email']
    const hasRequiredHeaders = requiredHeaders.every(header => headers.includes(header))

    if (!hasRequiredHeaders) {
      return NextResponse.json(
        { error: 'CSV must contain "name" and "email" columns' },
        { status: 400 }
      )
    }

    const leads = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row = Object.fromEntries(headers.map((header, idx) => [header, values[idx]]))

      if (!row.name || !row.email) continue

      leads.push({
        lead_name: row.name,
        email: row.email,
        phone: row.phone || null,
        source: row.source || 'csv_import',
        message: row.message || null,
        status: row.status || 'new',
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