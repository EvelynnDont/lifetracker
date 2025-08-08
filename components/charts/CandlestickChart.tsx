import { useMemo } from 'react'

interface CandleData {
  date: string
  open: number
  close: number
  high: number
  low: number
}

interface CandlestickChartProps {
  data: CandleData[]
  height?: number
  maxPoints?: number
}

/**
 * A simple candlestick chart rendered using divs. It approximates the look of a candlestick
 * chart without relying on a heavy charting library. Each candlestick consists of a high-low
 * line and a body representing the open and close values. Up candles are green and down candles
 * are red. If more than maxPoints data points are passed, the chart uses only the most recent
 * entries.
 */
export default function CandlestickChart({ data, height = 300, maxPoints = 60 }: CandlestickChartProps) {
  // Limit data to last maxPoints items
  const sliced = useMemo(() => {
    if (!data) return []
    return data.slice(Math.max(0, data.length - maxPoints))
  }, [data, maxPoints])

  // Compute global min and max for scaling
  const { min, max } = useMemo(() => {
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    sliced.forEach((d) => {
      if (d.low < min) min = d.low
      if (d.high > max) max = d.high
    })
    return { min, max }
  }, [sliced])

  const scale = (value: number) => {
    if (max === min) return 0
    // Flip so higher values have smaller y coordinate (toward top)
    return ((max - value) / (max - min)) * height
  }

  return (
    <div className="overflow-x-auto">
      <div className="relative flex items-end" style={{ height }}>
        {sliced.map((d, idx) => {
          const highY = scale(d.high)
          const lowY = scale(d.low)
          const openY = scale(d.open)
          const closeY = scale(d.close)
          const top = Math.min(openY, closeY)
          const bottom = Math.max(openY, closeY)
          const isUp = d.close >= d.open
          const bodyHeight = Math.max(2, bottom - top)
          return (
            <div key={idx} className="flex flex-col items-center flex-none" style={{ width: 8 }}>
              {/* High-low line */}
              <div
                className="w-px bg-border"
                style={{ height: lowY - highY, marginTop: highY }}
              />
              {/* Body */}
              <div
                className={
                  isUp
                    ? 'bg-primary border border-primary/60'
                    : 'bg-destructive border border-destructive/60'
                }
                style={{ height: bodyHeight, marginTop: top - highY, width: 6 }}
              />
            </div>
          )
        })}
      </div>
      {/* X-axis labels */}
      <div className="flex mt-2 text-xs text-muted-foreground">
        {sliced.map((d, idx) => {
          // Show label for first of month or first data point
          const date = new Date(d.date)
          const showLabel = idx === 0 || date.getDate() === 1
          return (
            <div key={idx} className="flex-none text-center" style={{ width: 8 }}>
              {showLabel ? date.toLocaleDateString('en-US', { month: 'short' }) : ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}