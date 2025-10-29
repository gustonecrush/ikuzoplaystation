'use client'

import { Fade } from 'react-awesome-reveal'

export default function ReservationLegend({
  legends = [
    { color: 'green', label: 'selected' },
    { color: 'yellow', label: 'in hold' },
    { color: 'red', label: 'reserved' },
    { color: 'gray', label: 'available' },
  ],
  delay = 700,
  duration = 1300,
  textColor = 'text-white',
  textSize = 'text-xs',
  gap = 'gap-2',
  className = '',
}) {
  return (
    <Fade delay={delay} duration={duration}>
      <div
        className={`flex flex-row ${gap} items-center justify-center mb-8 ${className}`}
      >
        {legends.map((legend, index) => (
          <LegendItem
            key={index}
            color={legend.color}
            label={legend.label}
            textColor={textColor}
            textSize={textSize}
          />
        ))}
      </div>
    </Fade>
  )
}

function LegendItem({ color, label, textColor, textSize }) {
  return (
    <div className="flex gap-1 items-center">
      <div
        className={`w-4 h-4 border border-${color}-500 bg-${color}-500 bg-opacity-25 rounded-sm`}
      />
      <p className={`${textSize} ${textColor}`}>{label}</p>
    </div>
  )
}
