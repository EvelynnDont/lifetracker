'use client'
import { useEffect, useMemo, useState } from 'react'
import Layout from '../layout'
import CandlestickChart from '../charts/CandlestickChart'

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

export default function Dashboard() {
  const [data, setData] = useState<DataRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sheet, setSheet] = useState<string | null>(null)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lifetracker:sheet') : null
    setSheet(saved)
    async function fetchData() {
      try {
        setError(null); setLoading(true)
        const url = saved ? `/api/data?sheet=${encodeURIComponent(saved)}` : '/api/data'
        const res = await fetch(url, { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Failed to fetch data')
        setData(json as DataRecord[])
      } catch (err:any) {
        setError(err.message || 'Error loading data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const kpis = useMemo(() => {
    if (!data.length) return null
    const last = data[data.length - 1]
    const lastSeven = data.slice(Math.max(0, data.length - 7))
    const avg = lastSeven.reduce((acc, d) => acc + d.dailyTotal, 0) / lastSeven.length
    const best = Math.max(...data.map(d => d.dailyTotal))
    const worst = Math.min(...data.map(d => d.dailyTotal))
    return [
      { title: "Today's Score", value: last.dailyTotal },
      { title: '7-Day Avg', value: avg.toFixed(2) },
      { title: 'Best Day', value: best },
      { title: 'Worst Day', value: worst }
    ]
  }, [data])

  return (
    <Layout title="Dashboard">
      {loading && <div className="text-muted-foreground">Loading data…</div>}
      {error && (
        <div className="text-destructive">
          Error: {error}
          <div className="text-muted-foreground text-sm mt-1">
            {sheet ? 'Check sharing/columns on your Sheet.' : 'Go to Settings and save your Google Sheet link.'}
          </div>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis?.map((kpi) => (
              <div key={kpi.title} className="bg-card p-4 rounded-lg border border-border flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">{kpi.title}</span>
                <span className="text-2xl font-semibold">{kpi.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-card p-4 rounded-lg border border-border mb-6">
            <h2 className="text-lg font-semibold mb-4">Daily Total Candlestick</h2>
            <CandlestickChart data={data} height={300} maxPoints={90} />
          </div>

          <div className="bg-card p-4 rounded-lg border border-border overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Recent Entries</h2>
            <table className="min-w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="px-2 py-2 text-left">Date</th>
                  <th className="px-2 py-2 text-left">Personal</th>
                  <th className="px-2 py-2 text-left">Relationships</th>
                  <th className="px-2 py-2 text-left">Work</th>
                  <th className="px-2 py-2 text-left">Health</th>
                  <th className="px-2 py-2 text-left">Hobbies</th>
                  <th className="px-2 py-2 text-left">Finance</th>
                  <th className="px-2 py-2 text-left">Learning</th>
                  <th className="px-2 py-2 text-left">Home</th>
                  <th className="px-2 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(Math.max(0, data.length - 20)).reverse().map((d) => (
                  <tr key={d.date} className="border-b border-border last:border-0">
                    <td className="px-2 py-2 whitespace-nowrap">{d.date}</td>
                    <td className="px-2 py-2">{d.personalWellBeing}</td>
                    <td className="px-2 py-2">{d.relationships}</td>
                    <td className="px-2 py-2">{d.workCareer}</td>
                    <td className="px-2 py-2">{d.healthFitness}</td>
                    <td className="px-2 py-2">{d.hobbiesInterests}</td>
                    <td className="px-2 py-2">{d.personalFinance}</td>
                    <td className="px-2 py-2">{d.learningGrowth}</td>
                    <td className="px-2 py-2">{d.homeEnvironment}</td>
                    <td className="px-2 py-2 font-semibold">{d.dailyTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  )
}
