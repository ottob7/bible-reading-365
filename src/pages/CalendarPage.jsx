import { useReadingProgress } from '../hooks/useReadingProgress'
import CalendarView from '../components/reading/CalendarView'
import { Link } from 'react-router-dom'
import { Printer } from 'lucide-react'

export default function CalendarPage() {
  const { completedDates, loading, toggleDay } = useReadingProgress()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Reading Calendar</h1>
          <p className="text-navy-500 text-sm mt-1">Tap any day to mark it complete</p>
        </div>
        <Link
          to="/plan/print"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-600 hover:bg-navy-50 transition-colors"
        >
          <Printer className="h-4 w-4" />
          Print Plan
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100">
        <CalendarView
          completedDates={completedDates}
          onToggle={toggleDay}
        />
      </div>
    </div>
  )
}
