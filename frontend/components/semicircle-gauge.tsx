import { cn } from "@/lib/utils"

type SemiCircleGaugeProps = {
  percent: number // 0..100
  className?: string
  // When status is "real", we color with primary; when "fake", destructive.
  status?: "real" | "fake"
  // Optional caption shown beneath the gauge
  caption?: string
}

export function SemiCircleGauge({ percent, className, status = "real", caption }: SemiCircleGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)))
  // Geometry
  const size = 240
  const stroke = 16
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const x0 = cx - r
  const x1 = cx + r
  const d = `M ${x0} ${cy} A ${r} ${r} 0 0 1 ${x1} ${cy}`

  const barColorClass = status === "real" ? "text-primary" : "text-destructive"

  // tick marks at 0,25,50,75,100
  const ticks = [0, 25, 50, 75, 100]
  const tickElems = ticks.map((t) => {
    const angle = Math.PI * (1 - t / 100) // map 0..100 to PI..0
    const tx0 = cx + (r - stroke * 0.9) * Math.cos(angle)
    const ty0 = cy + (r - stroke * 0.9) * Math.sin(angle)
    const tx1 = cx + (r - stroke * 0.5) * Math.cos(angle)
    const ty1 = cy + (r - stroke * 0.5) * Math.sin(angle)
    return (
      <line
        key={t}
        x1={tx0}
        y1={ty0}
        x2={tx1}
        y2={ty1}
        stroke="currentColor"
        className="text-muted-foreground"
        strokeWidth={t % 50 === 0 ? 2 : 1}
        opacity={0.5}
      />
    )
  })

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${size} ${size / 2 + stroke}`}
        width="100%"
        role="img"
        aria-label={`Likelihood gauge ${clamped}% ${status}`}
      >
        {/* Track */}
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          className="text-muted"
          strokeWidth={stroke}
          strokeLinecap="round"
          opacity={0.35}
          pathLength={100}
        />
        {/* Active arc */}
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          className={barColorClass}
          strokeWidth={stroke}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${clamped} ${100 - clamped}`}
        />
        {/* Ticks */}
        <g>{tickElems}</g>

        {/* Percentage and label */}
        <g>
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            className="fill-foreground"
            style={{ fontSize: 28, fontWeight: 700 }}
          >
            {clamped}%
          </text>
          <text x={cx} y={cy + 24} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 14 }}>
            Likelihood {status === "real" ? "Real" : "Fake"}
          </text>
        </g>
      </svg>
      {caption ? (
        <p className="mt-2 text-center text-sm text-muted-foreground" aria-live="polite">
          {caption}
        </p>
      ) : null}
    </div>
  )
}
