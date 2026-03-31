import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import readingPlan from '../../data/reading-plan.json'
import { getMonthName, getDaysInMonth, getFirstDayOfMonth, formatChaptersShort } from '../../utils/dateHelpers'

// Build a lookup from date string to reading plan entry
const planByDate = {}
for (const entry of readingPlan) {
  planByDate[entry.date] = entry
}

export default function CalendarView({ completedDates = [], onToggle, readOnly = false }) {
  // 12 months: April 2026 (index 0) through March 2027 (index 11)
  const months = []
  for (let i = 0; i < 12; i++) {
    const monthIdx = (3 + i) % 12 // Start from April (3)
    const year = i < 9 ? 2026 : 2027 // April-Dec 2026, Jan-Mar 2027
    months.push({ year, month: monthIdx })
  }

  const [currentMonthIdx, setCurrentMonthIdx] = useState(0)
  const { year, month } = months[currentMonthIdx]

  const completedSet = new Set(completedDates)
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Build calendar grid
  const cells = []
  // Empty cells for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    cells.push(null)
  }
  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const date = new Date(year, month, day)
    const isSunday = date.getDay() === 0
    const planEntry = planByDate[dateStr]
    const isCompleted = completedSet.has(dateStr)

    cells.push({ day, dateStr, isSunday, planEntry, isCompleted })
  }

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonthIdx(i => Math.max(0, i - 1))}
          disabled={currentMonthIdx === 0}
          className="p-2 rounded-lg hover:bg-navy-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-navy-600" />
        </button>
        <h2 className="text-xl font-bold text-navy-800">
          {getMonthName(month)} {year}
        </h2>
        <button
          onClick={() => setCurrentMonthIdx(i => Math.min(11, i + 1))}
          disabled={currentMonthIdx === 11}
          className="p-2 rounded-lg hover:bg-navy-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-navy-600" />
        </button>
      </div>

      {/* Month dots */}
      <div className="flex justify-center gap-1.5 mb-6">
        {months.map((m, i) => (
          <button
            key={i}
            onClick={() => setCurrentMonthIdx(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentMonthIdx ? 'bg-gold-400 w-6' : 'bg-navy-200 hover:bg-navy-300'
            }`}
          />
        ))}
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map(day => (
          <div key={day} className={`text-center text-xs font-medium py-2 ${
            day === 'Sun' ? 'text-navy-300' : 'text-navy-500'
          }`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) {
            return <div key={`empty-${i}`} className="aspect-square" />
          }

          const { day, dateStr, isSunday, planEntry, isCompleted } = cell

          if (isSunday) {
            return (
              <div key={dateStr} className="aspect-square rounded-lg bg-navy-50 flex flex-col items-center justify-center text-navy-300 text-xs">
                <span className="font-medium">{day}</span>
                <span className="text-[9px] mt-0.5">Rest</span>
              </div>
            )
          }

          if (!planEntry) {
            return (
              <div key={dateStr} className="aspect-square rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 text-xs">
                {day}
              </div>
            )
          }

          return (
            <button
              key={dateStr}
              onClick={() => !readOnly && onToggle?.(dateStr)}
              disabled={readOnly}
              className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-center text-xs transition-all border ${
                isCompleted
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-white border-navy-100 hover:border-gold-300 text-navy-600'
              } ${readOnly ? '' : 'cursor-pointer'}`}
              title={formatChaptersShort(planEntry.chapters)}
            >
              <span className="font-medium">{day}</span>
              <span className="text-[9px] leading-tight truncate w-full text-center mt-0.5">
                {formatChaptersShort(planEntry.chapters).split(',')[0]}
              </span>
              {isCompleted && <Check className="h-3 w-3 text-green-500 mt-0.5" />}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-navy-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white border border-navy-100" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-navy-50" />
          <span>Sunday (Rest)</span>
        </div>
      </div>
    </div>
  )
}
