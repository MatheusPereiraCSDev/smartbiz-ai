/**
 * Purely decorative background element.
 * Two interlocking gears rotating slowly in the bottom-left corner,
 * kept at low opacity so it never competes with the foreground content.
 */

function GearShape({ teeth = 10 }: { teeth?: number }) {
  const outerR = 46
  const innerR = 34
  const toothH = 9
  const points: string[] = []

  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2
    const a1 = ((i + 0.35) / teeth) * Math.PI * 2
    const a2 = ((i + 0.5) / teeth) * Math.PI * 2
    const a3 = ((i + 0.85) / teeth) * Math.PI * 2

    points.push(`${50 + innerR * Math.cos(a0)},${50 + innerR * Math.sin(a0)}`)
    points.push(`${50 + (outerR + toothH) * Math.cos(a1)},${50 + (outerR + toothH) * Math.sin(a1)}`)
    points.push(`${50 + (outerR + toothH) * Math.cos(a2)},${50 + (outerR + toothH) * Math.sin(a2)}`)
    points.push(`${50 + innerR * Math.cos(a3)},${50 + innerR * Math.sin(a3)}`)
  }

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <polygon points={points.join(' ')} fill="currentColor" />
      <circle cx="50" cy="50" r="16" fill="#1E1F2A" />
      <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export default function AnimatedGears() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 left-0 z-0 h-72 w-72 select-none text-accent opacity-[0.07] sm:h-96 sm:w-96"
      style={{ transform: 'translate(-25%, 25%)' }}
    >
      <div className="absolute bottom-8 left-8 h-48 w-48 animate-spin-slow sm:h-64 sm:w-64">
        <GearShape teeth={12} />
      </div>
      <div className="absolute bottom-24 left-32 h-24 w-24 animate-spin-slow-reverse sm:h-32 sm:w-32">
        <GearShape teeth={8} />
      </div>
    </div>
  )
}
