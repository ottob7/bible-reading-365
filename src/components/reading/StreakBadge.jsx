import { Flame, Trophy } from 'lucide-react'

export default function StreakBadge({ current, longest }) {
  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-xl">
        <Flame className="h-5 w-5" />
        <div>
          <div className="text-lg font-bold leading-tight">{current}</div>
          <div className="text-xs text-orange-500">Current Streak</div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-gold-50 text-gold-700 px-4 py-2 rounded-xl">
        <Trophy className="h-5 w-5" />
        <div>
          <div className="text-lg font-bold leading-tight">{longest}</div>
          <div className="text-xs text-gold-500">Best Streak</div>
        </div>
      </div>
    </div>
  )
}
