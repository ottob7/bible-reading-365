import readingPlan from '../data/reading-plan.json'
import { getMonthName, getDaysInMonth, getFirstDayOfMonth, formatChaptersShort } from '../utils/dateHelpers'
import { BookOpen, Printer } from 'lucide-react'

// Build lookup
const planByDate = {}
for (const entry of readingPlan) {
  planByDate[entry.date] = entry
}

export default function PrintablePlanPage() {
  // 12 months
  const months = []
  for (let i = 0; i < 12; i++) {
    const monthIdx = (3 + i) % 12
    const year = i < 9 ? 2026 : 2027
    months.push({ year, month: monthIdx })
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Print button (hidden in print) */}
      <div className="no-print flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">IOGC Bible Reading 365</h1>
          <p className="text-navy-500 mt-1">April 2026 - March 2027 &middot; King James Version</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2.5 bg-gold-400 text-navy-900 rounded-lg font-medium hover:bg-gold-300 transition-colors"
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
      </div>

      {/* Print header */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-2xl font-bold">IOGC Bible Reading 365</h1>
        <p className="text-sm text-gray-600 mt-1">Read the King James Bible in One Year &middot; April 2026 - March 2027</p>
        <p className="text-xs text-gray-500 mt-1">3-4 chapters daily, Monday through Saturday &middot; Sundays are rest days</p>
      </div>

      {/* Monthly grids */}
      <div className="space-y-8 print:space-y-4">
        {months.map(({ year, month }, mIdx) => {
          const daysInMonth = getDaysInMonth(year, month)
          const firstDay = getFirstDayOfMonth(year, month)

          const cells = []
          for (let i = 0; i < firstDay; i++) cells.push(null)
          for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const date = new Date(year, month, day)
            const isSunday = date.getDay() === 0
            const planEntry = planByDate[dateStr]
            cells.push({ day, isSunday, planEntry })
          }

          return (
            <div key={mIdx} className="print:break-inside-avoid">
              <h2 className="text-lg font-bold text-navy-800 mb-2 print:text-base print:mb-1">
                {getMonthName(month)} {year}
              </h2>
              <div className="border border-navy-200 rounded-lg overflow-hidden print:rounded-none">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 bg-navy-800 text-white print:bg-gray-800">
                  {weekdays.map(day => (
                    <div key={day} className="text-center text-xs font-medium py-1.5 print:py-1">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Days grid */}
                <div className="grid grid-cols-7">
                  {cells.map((cell, i) => {
                    if (!cell) {
                      return <div key={`e-${i}`} className="border-b border-r border-navy-100 p-1.5 min-h-[60px] print:min-h-[48px] bg-gray-50" />
                    }
                    const { day, isSunday, planEntry } = cell
                    return (
                      <div
                        key={`d-${day}`}
                        className={`border-b border-r border-navy-100 p-1.5 min-h-[60px] print:min-h-[48px] ${
                          isSunday ? 'bg-navy-50 print:bg-gray-100' : 'bg-white'
                        }`}
                      >
                        <div className={`text-xs font-bold ${isSunday ? 'text-navy-300' : 'text-navy-700'}`}>
                          {day}
                        </div>
                        {isSunday ? (
                          <div className="text-[10px] text-navy-300 italic mt-0.5">Rest</div>
                        ) : planEntry ? (
                          <div className="text-[10px] text-navy-600 mt-0.5 leading-tight">
                            {formatChaptersShort(planEntry.chapters)}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer info (print) */}
      <div className="hidden print:block mt-6 text-center text-xs text-gray-500 border-t pt-4">
        <p>IOGC Bible Reading 365 &middot; 66 Books &middot; 1,189 Chapters &middot; 313 Reading Days</p>
        <p>"Thy word is a lamp unto my feet, and a light unto my path." — Psalm 119:105</p>
      </div>

      {/* Screen footer */}
      <div className="no-print mt-8 text-center text-sm text-navy-400">
        <p>Tip: Use your browser's Print function (Ctrl+P / Cmd+P) to save as PDF or print.</p>
      </div>
    </div>
  )
}
