'use client'
import Layout from '../../components/layout'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [sheetUrl, setSheetUrl] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('lifetracker:sheet')
    if (saved) setSheetUrl(saved)
  }, [])

  async function saveAndTest() {
    if (!sheetUrl.trim()) { setMsg('Paste your Google Sheet link.'); return }
    setStatus('loading'); setMsg('')
    try {
      const r = await fetch(`/api/data?sheet=${encodeURIComponent(sheetUrl)}`, { cache: 'no-store' })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || 'Fetch failed')
      localStorage.setItem('lifetracker:sheet', sheetUrl.trim())
      setStatus('ok'); setMsg('Connected. Redirecting to Dashboard…')
      setTimeout(() => router.push('/'), 600)
    } catch (e:any) {
      setStatus('err'); setMsg(e?.message || 'Could not read the sheet. Check sharing & URL.')
    }
  }

  return (
    <Layout title="Settings">
      <div className="max-w-xl space-y-4">
        <label className="text-sm">Google Sheets Link (share: Anyone with the link → Viewer)</label>
        <input
          className="w-full px-3 py-2 rounded border border-border bg-muted"
          value={sheetUrl}
          onChange={e=>setSheetUrl(e.target.value)}
          placeholder="https://docs.google.com/spreadsheets/d/<ID>/edit"
        />
        <button onClick={saveAndTest} className="px-4 py-2 rounded bg-primary text-primary-foreground">
          Save & Test
        </button>
        {status==='loading' && <p className="text-muted-foreground text-sm">Testing…</p>}
        {!!msg && <p className={status==='err' ? 'text-red-400 text-sm' : 'text-green-400 text-sm'}>{msg}</p>}
      </div>
    </Layout>
  )
}
