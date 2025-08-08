import { NextResponse } from 'next/server'
import { parse } from 'papaparse'

// Turn a full Google Sheets URL or a bare ID into a CSV export URL
function toCsvUrl(input: string) {
  try {
    const u = new URL(input)
    const parts = u.pathname.split('/')
    const dIdx = parts.findIndex(p => p === 'd')
    const id = dIdx >= 0 ? parts[dIdx + 1] : ''
    if (id) return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`
  } catch {
    /* not a URL, assume it's an ID */
  }
  return `https://docs.google.com/spreadsheets/d/${input}/export?format=csv`
}

async function fetchSheetCsv(sheetParam: string): Promise<string> {
  const url = toCsvUrl(sheetParam)
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch Google Sheet: ${res.status}`)
  return await res.text()
}

interface DataRecord {
  date: string
  open: number
  close: number
  high: number
  low: number
  personalWellBeing: number
  relationships: number
  workCareer: number
  healthFitness: number
  hobbiesInterests: number
  personalFinance: number
  learningGrowth: number
  homeEnvironment: number
  dailyTotal: number
}

export async function GET(req: Request) {
  try {
    const sp = new URL(req.url).searchParams
    const sheet = sp.get('sheet')
    if (!sheet) return NextResponse.json({ error: 'Missing ?sheet=<url|id>' }, { status: 400 })

    const csvText = await fetchSheetCsv(sheet)
    const result = parse<Record<string, any>>(csvText, { header: true, dynamicTyping: true })
    const raw = result.data as Record<string, any>[]

    const records: DataRecord[] = []
    let prevClose: number | null = null

    for (const row of raw) {
      const dateCell = row.Date ?? row.date ?? row.DAY
      if (!dateCell) continue

      const parsedDate = new Date(dateCell)
      const isoDate = isNaN(parsedDate.getTime())
        ? String(dateCell)
        : parsedDate.toISOString().split('T')[0]

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

      const high = Math.max(...nums)
      const low  = Math.min(...nums)
      const open = prevClose !== null ? prevClose : nums[nums.length - 1]
      const close = nums[nums.length - 1]
      prevClose = close

      records.push({
        date: isoDate,
        open, close, high, low,
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

    return NextResponse.json(records)
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Server error' }, { status: 500 })
  }
}
