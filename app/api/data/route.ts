import { NextResponse } from 'next/server'
import { parse } from 'papaparse'

// Google Sheet ID for the life tracking data
const SHEET_ID = '1VEpSZMyKmfZNzW-LdYM4IRO5cyMeImpEEvyA7n4GHu8'

// Fetches the CSV from Google Sheets
async function fetchSheetCsv(): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`
  const res = await fetch(url, {
    // Use no-store to prevent caching so the latest data is always fetched
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch Google Sheet')
  }
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

export async function GET() {
  try {
    const csvText = await fetchSheetCsv()
    // Parse CSV into records
    const result = parse<Record<string, string>>(csvText, { header: true, dynamicTyping: true })
    const raw = result.data
    const records: DataRecord[] = []
    let prevClose: number | null = null
    for (const row of raw) {
      if (!row.Date) continue
      // Parse date into ISO (yyyy-mm-dd)
      const parsedDate = new Date(row.Date)
      const isoDate = isNaN(parsedDate.getTime())
        ? row.Date
        : parsedDate.toISOString().split('T')[0]
      // Extract categories
      const categories = [
        row['Personal Well-being'],
        row['Relationships'],
        row['Work/Career'],
        row['Health & Fitness'],
        row['Hobbies & Interests'],
        row['Personal Finance'],
        row['Learning & Growth'],
        row['Home & Environment'],
        row['Daily Total']
      ].map((v) => (typeof v === 'number' ? v : parseFloat(String(v))))
      const high = Math.max(...categories)
      const low = Math.min(...categories)
      const open = prevClose !== null ? prevClose : categories[categories.length - 1]
      const close = categories[categories.length - 1]
      prevClose = close
      records.push({
        date: isoDate,
        open,
        close,
        high,
        low,
        personalWellBeing: categories[0],
        relationships: categories[1],
        workCareer: categories[2],
        healthFitness: categories[3],
        hobbiesInterests: categories[4],
        personalFinance: categories[5],
        learningGrowth: categories[6],
        homeEnvironment: categories[7],
        dailyTotal: categories[8]
      })
    }
    return NextResponse.json(records)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}