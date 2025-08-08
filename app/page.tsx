'use client'
import Layout from '../../components/layout'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [sheetUrl, setSheetUrl] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle')

  useEffect(() => {
    const saved = localStorage.getItem('lifetracker:sheet')
    if (saved) setSheetUrl(saved)
  }, [])

  async function saveAndTest() {
    setStatus('loading')
    try {
      const r = await fetch(`/api/data?sheet=${encodeURIComponent(sheetUrl)}`, { cache: 'no-store' })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || 'Fetch failed')
      localStorage.setItem('lifetracker:sheet', sheetUrl)
      setStatus('ok')
    } catch {
      setStatus('err')
    }
  }

  return (
    <Layout title="Settings">
      <div className="max-w-xl space-y-3">
        <label className="text-sm">Google Sheets link (Anyone with the link can view)</label>
        <input
          className="w-full px-3 py-2 rounded border border-border bg-muted"
          value={sheetUrl}
          onChange={e=>setSheetUrl(e.target.value)}
          placeholder="Paste your Google Sheet URL"
        />
        <button onClick={saveAndTest} className="px-4 py-2 rounded bg-primary text-primary-foreground">
          Save & Test
        </button>
        {status==='loading' && <p className="text-muted-foreground text-sm">Testing…</p>}
        {status==='ok' && <p className="text-green-400 text-sm">Connected!</p>}
        {status==='err' && <p className="text-red-400 text-sm">Couldn’t read the sheet. Check sharing & URL.</p>}
      </div>
    </Layout>
  )
}
