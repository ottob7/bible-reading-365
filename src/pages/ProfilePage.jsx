import { useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useReadingProgress } from '../hooks/useReadingProgress'
import { useQuizzes } from '../hooks/useQuizzes'
import readingPlan from '../data/reading-plan.json'
import ProgressRing from '../components/reading/ProgressRing'
import StreakBadge from '../components/reading/StreakBadge'
import { calculateStreak, getProgressPercentage } from '../utils/progressHelpers'
import { BookOpen, Calendar, ClipboardList, TrendingUp } from 'lucide-react'

export default function ProfilePage() {
  const { profile } = useAuth()
  const { completedDates, loading } = useReadingProgress()
  const { userResults } = useQuizzes()

  const stats = useMemo(() => {
    const streak = calculateStreak(completedDates)
    const percentage = getProgressPercentage(completedDates.length)
    const totalChaptersRead = readingPlan
      .filter(d => completedDates.includes(d.date))
      .reduce((sum, d) => sum + d.chapters.length, 0)

    const avgQuizScore = userResults.length > 0
      ? Math.round(userResults.reduce((sum, r) => sum + (r.score / r.total_questions * 100), 0) / userResults.length)
      : 0

    return { streak, percentage, totalChaptersRead, avgQuizScore }
  }, [completedDates, userResults])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-navy-100 text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-navy-800 text-gold-400 text-2xl font-bold mb-4">
          {profile?.display_name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <h1 className="text-2xl font-bold text-navy-800">{profile?.display_name}</h1>
        <p className="text-navy-500 text-sm mt-1">{profile?.email}</p>
        {profile?.role === 'admin' && (
          <span className="inline-block mt-2 px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-xs font-medium">
            Administrator
          </span>
        )}
      </div>

      {/* Progress Ring */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-navy-100 flex flex-col items-center mb-8">
        <ProgressRing percentage={stats.percentage} size={160} strokeWidth={12} />
        <p className="mt-4 text-navy-500">{completedDates.length} of 313 reading days completed</p>
        <StreakBadge current={stats.streak.current} longest={stats.streak.longest} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-navy-100 text-center">
          <BookOpen className="h-6 w-6 text-gold-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-navy-800">{stats.totalChaptersRead}</div>
          <div className="text-xs text-navy-500 mt-1">Chapters Read</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-navy-100 text-center">
          <Calendar className="h-6 w-6 text-gold-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-navy-800">{completedDates.length}</div>
          <div className="text-xs text-navy-500 mt-1">Days Completed</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-navy-100 text-center">
          <ClipboardList className="h-6 w-6 text-gold-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-navy-800">{userResults.length}</div>
          <div className="text-xs text-navy-500 mt-1">Quizzes Taken</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-navy-100 text-center">
          <TrendingUp className="h-6 w-6 text-gold-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-navy-800">{stats.avgQuizScore}%</div>
          <div className="text-xs text-navy-500 mt-1">Avg Quiz Score</div>
        </div>
      </div>
    </div>
  )
}
