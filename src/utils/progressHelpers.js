import readingPlan from '../data/reading-plan.json'
import { getTodayString } from './dateHelpers'

export function calculateStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return { current: 0, longest: 0 }

  // Sort dates
  const sorted = [...completedDates].sort()

  // Build set of all reading dates from plan
  const readingDates = new Set(readingPlan.map(d => d.date))

  // Calculate longest streak
  let longest = 1
  let currentRun = 1
  for (let i = 1; i < sorted.length; i++) {
    // Check if these are consecutive reading days
    const prevIdx = readingPlan.findIndex(d => d.date === sorted[i - 1])
    const currIdx = readingPlan.findIndex(d => d.date === sorted[i])
    if (currIdx === prevIdx + 1) {
      currentRun++
      longest = Math.max(longest, currentRun)
    } else {
      currentRun = 1
    }
  }

  // Calculate current streak (from most recent completed day going backwards)
  const today = getTodayString()
  const todayIdx = readingPlan.findIndex(d => d.date === today)
  const completedSet = new Set(sorted)

  let current = 0
  // Start from today or the most recent reading day
  let checkIdx = todayIdx >= 0 ? todayIdx : readingPlan.length - 1

  // If today isn't a reading day or hasn't been completed, start from yesterday
  if (checkIdx >= 0 && !completedSet.has(readingPlan[checkIdx]?.date)) {
    checkIdx--
  }

  while (checkIdx >= 0 && completedSet.has(readingPlan[checkIdx]?.date)) {
    current++
    checkIdx--
  }

  return { current, longest: Math.max(longest, current) }
}

export function getProgressPercentage(completedCount) {
  return Math.round((completedCount / 313) * 100)
}

export function getDaysOnTrack(completedDates) {
  const today = getTodayString()
  const expectedDays = readingPlan.filter(d => d.date <= today).length
  const completedCount = completedDates?.length || 0
  const diff = completedCount - expectedDays

  if (diff >= 0) return { status: 'on-track', days: diff }
  if (diff >= -3) return { status: 'slightly-behind', days: Math.abs(diff) }
  return { status: 'behind', days: Math.abs(diff) }
}

export function getTodayReading() {
  const today = getTodayString()
  return readingPlan.find(d => d.date === today) || null
}
