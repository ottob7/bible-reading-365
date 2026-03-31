import { Check } from 'lucide-react'
import { formatChaptersShort } from '../../utils/dateHelpers'

export default function DayCard({ dayData, isCompleted, onToggle, compact = false }) {
  if (!dayData) return null

  const date = new Date(dayData.date + 'T00:00:00')
  const dayNum = date.getDate()

  if (compact) {
    return (
      <button
        onClick={() => onToggle?.(dayData.date)}
        className={`relative p-1 rounded-lg text-xs transition-all border ${
          isCompleted
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-white border-navy-100 text-navy-600 hover:border-gold-300'
        }`}
        title={formatChaptersShort(dayData.chapters)}
      >
        <div className="font-medium">{dayNum}</div>
        <div className="truncate text-[10px] leading-tight">{formatChaptersShort(dayData.chapters)}</div>
        {isCompleted && (
          <Check className="absolute top-0.5 right-0.5 h-3 w-3 text-green-500" />
        )}
      </button>
    )
  }

  return (
    <button
      onClick={() => onToggle?.(dayData.date)}
      className={`relative p-3 rounded-xl text-left transition-all border-2 w-full ${
        isCompleted
          ? 'bg-green-50 border-green-300 shadow-sm'
          : 'bg-white border-navy-100 hover:border-gold-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-navy-400">Day {dayData.day}</div>
          <div className="font-semibold text-navy-800 mt-0.5">
            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
          isCompleted
            ? 'bg-green-500 text-white'
            : 'border-2 border-navy-200'
        }`}>
          {isCompleted && <Check className="h-4 w-4" />}
        </div>
      </div>
      <div className="mt-2 text-sm text-navy-600">
        {formatChaptersShort(dayData.chapters)}
      </div>
    </button>
  )
}
