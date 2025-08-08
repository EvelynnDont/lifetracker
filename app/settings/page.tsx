import Layout from '../../components/layout'

export default function SettingsPage() {
  return (
    <Layout title="Settings">
      <div className="max-w-lg space-y-4">
        <h2 className="text-lg font-semibold">Google Sheets Link</h2>
        <p className="text-muted-foreground text-sm">
          Enter the URL of your publicly shared Google Sheet. The dashboard will fetch data from this sheet.
        </p>
        <input
          type="text"
          className="w-full px-3 py-2 rounded-md bg-muted border border-border text-foreground placeholder-muted-foreground"
          defaultValue={`https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_SHEET_ID ?? ''}/edit`}
        />
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Save
        </button>
      </div>
    </Layout>
  )
}