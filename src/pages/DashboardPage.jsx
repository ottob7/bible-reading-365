import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useReadingProgress } from '../hooks/useReadingProgress'
import readingPlan from '../data/reading-plan.json'
import ProgressRing from '../components/reading/ProgressRing'
import StreakBadge from '../components/reading/StreakBadge'
import DayCard from '../components/reading/DayCard'
import { getTodayString, formatChapters } from '../utils/dateHelpers'
import { calculateStreak, getProgressPercentage, getDaysOnTrack } from '../utils/progressHelpers'
import { BookOpen, Calendar, ArrowRight, Check } from 'lucide-react'

export default function DashboardPage() {
  const { profile } = useAuth()
  const { completedDates, loading, toggleDay } = useReadingProgress()

  const today = getTodayString()
  const todayReading = readingPlan.find(d => d.date === today)
  const isTodayCompleted = completedDates.includes(today)

  const stats = useMemo(() => {
    const streak = calculateStreak(completedDates)
    const percentage = getProgressPercentage(completedDates.length)
    const trackStatus = getDaysOnTrack(completedDates)
    return { streak, percentage, trackStatus }
  }, [completedDates])

  // Get this week's readings (next 6 reading days)
  const todayIdx = readingPlan.findIndex(d => d.date === today)
  const upcomingDays = readingPlan.slice(
    Math.max(0, todayIdx),
    Math.max(0, todayIdx) + 6
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-800">
          Welcome back, {profile?.display_name || 'Reader'}
        </h1>
        <p className="text-navy-500 mt-1">
          {todayReading ? `Day ${todayReading.day} of 313` : 'Keep up the great work!'}
        </p>
      </div>

      {/* Today's Reading - Hero Card */}
      {todayReading ? (
        <div className={`rounded-2xl p-6 mb-8 border-2 transition-all ${
          isTodayCompleted
            ? 'bg-green-50 border-green-300'
            : 'bg-white border-gold-200 shadow-lg'
        }`}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-gold-500" />
                <span className="text-sm font-medium text-gold-600 uppercase tracking-wide">
                  Today's Reading
                </span>
              </div>
              <h2 className="text-xl font-bold text-navy-800 mb-1">
                {formatChapters(todayReading.chapters)}
              </h2>
              <p className="text-navy-500 text-sm">
                {todayReading.chapters.length} chapter{todayReading.chapters.length > 1 ? 's' : ''} &middot; {todayReading.weekday}
              </p>
            </div>

            <button
              onClick={() => toggleDay(today)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all text-lg ${
                isTodayCompleted
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gold-400 text-navy-900 hover:bg-gold-300 shadow-md hover:shadow-lg'
              }`}
            >
              {isTodayCompleted ? (
                <>
                  <Check className="h-5 w-5" />
                  Completed
                </>
              ) : (
                'Mark as Read'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-6 mb-8 bg-navy-100 border border-navy-200 text-center">
          <p className="text-navy-600">
            {today < '2026-04-01'
              ? 'The reading plan starts April 1, 2026. Get ready!'
              : 'No reading assigned for today. Enjoy your rest!'}
          </p>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Progress Ring */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100 flex flex-col items-center">
          <ProgressRing percentage={stats.percentage} />
          <p className="mt-3 text-sm text-navy-500">
            {completedDates.length} of 313 days completed
          </p>
        </div>

        {/* Streaks */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-navy-500 mb-3 uppercase tracking-wide">Streaks</h3>
          <StreakBadge current={stats.streak.current} longest={stats.streak.longest} />
        </div>

        {/* Track Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-navy-500 mb-3 uppercase tracking-wide">Status</h3>
          <div className={`text-lg font-bold ${
            stats.trackStatus.status === 'on-track' ? 'text-green-600' :
            stats.trackStatus.status === 'slightly-behind' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {stats.trackStatus.status === 'on-track'
              ? 'On Track!'
              : `${stats.trackStatus.days} day${stats.trackStatus.days > 1 ? 's' : ''} behind`
            }
          </div>
          {stats.trackStatus.status === 'on-track' && stats.trackStatus.days > 0 && (
            <p className="text-sm text-green-500 mt-1">{stats.trackStatus.days} day{stats.trackStatus.days > 1 ? 's' : ''} ahead</p>
          )}
        </div>
      </div>

      {/* Upcoming Readings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-navy-800">Upcoming Readings</h3>
          <Link to="/calendar" className="flex items-center gap-1 text-sm text-gold-500 hover:text-gold-600 font-medium">
            <Calendar className="h-4 w-4" />
            Full Calendar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {upcomingDays.map(day => (
            <DayCard
              key={day.date}
              dayData={day}
              isCompleted={completedDates.includes(day.date)}
              onToggle={toggleDay}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
