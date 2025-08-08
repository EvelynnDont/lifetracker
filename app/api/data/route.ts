import { NextResponse } from 'next/server'
import { parse } from 'papaparse'

function toCsvUrl(input: string) {
  try {
    const u = new URL(input)
    const parts = u.pathname.split('/')
    const dIdx = parts.findIndex(p => p === 'd')
    const id = dIdx >= 0 ? parts[dIdx + 1] : ''
    if (id) return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`
  } catch {}
  return `https://docs.google.com/spreadsheets/d/${input}/export?format=csv`
}

export async function GET(req: Request) {
  try {
    const sp = new URL(req.url).searchParams
    const sheet = sp.get('sheet')
    if (!sheet) return NextResponse.json({ error: 'Missing ?sheet=<url|id>' }, { status: 400 })

    const res = await fetch(toCsvUrl(sheet), { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ error: `Fetch failed: ${res.status}` }, { status: 502 })
    const csv = await res.text()

    const parsed = parse<Record<string, any>>(csv, { header: true, dynamicTyping: true })
    const out: any[] = []
    let prevClose: number | null = null

    for (const row of parsed.data) {
      const dateCell = row.Date ?? row.date ?? row.DAY
      if (!dateCell) continue
      const d = new Date(dateCell)
      const date = isNaN(d.getTime()) ? String(dateCell) : d.toISOString().split('T')[0]

      const nums = [
        row['Personal Well-being'],
        row['Relationships'],
        row['Work/Career'],
        row['Health & Fitness'],
        row['Hobbies & Interests'],
        row['Personal Finance'],
        row['Learning & Growth'],
        row['Home & Environment'],
        row['Daily Total'],
      ].map(v => (typeof v === 'number' ? v : Number(v)))

      const open = prevClose ?? nums[8]
      const close = nums[8]
      prevClose = close

      out.push({
        date,
        open,
        close,
        high: Math.max(...nums),
        low: Math.min(...nums),
        personalWellBeing: nums[0],
        relationships: nums[1],
        workCareer: nums[2],
        healthFitness: nums[3],
        hobbiesInterests: nums[4],
        personalFinance: nums[5],
        learningGrowth: nums[6],
        homeEnvironment: nums[7],
        dailyTotal: nums[8],
      })
    }

    return NextResponse.json(out)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
