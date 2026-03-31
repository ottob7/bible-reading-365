import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAllUsersProgress } from '../../hooks/useAllUsersProgress'
import { calculateStreak, getProgressPercentage, getDaysOnTrack } from '../../utils/progressHelpers'
import { Users, Search, ArrowUpDown, ClipboardList } from 'lucide-react'

export default function AdminDashboardPage() {
  const { users, loading } = useAllUsersProgress()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const enrichedUsers = useMemo(() => {
    return users.map(u => {
      const streak = calculateStreak(u.completedDates)
      const percentage = getProgressPercentage(u.daysCompleted)
      const trackStatus = getDaysOnTrack(u.completedDates)
      return { ...u, streak, percentage, trackStatus }
    })
  }, [users])

  const filtered = useMemo(() => {
    let result = enrichedUsers
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(u =>
        u.display_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      )
    }
    result.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'name') cmp = (a.display_name || '').localeCompare(b.display_name || '')
      else if (sortBy === 'progress') cmp = a.daysCompleted - b.daysCompleted
      else if (sortBy === 'streak') cmp = a.streak.current - b.streak.current
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [enrichedUsers, search, sortBy, sortDir])

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Admin Dashboard</h1>
          <p className="text-navy-500 text-sm mt-1">{users.length} participants</p>
        </div>
        <Link
          to="/admin/quizzes"
          className="flex items-center gap-2 px-4 py-2 bg-gold-400 text-navy-900 rounded-lg font-medium hover:bg-gold-300 transition-colors"
        >
          <ClipboardList className="h-4 w-4" />
          Manage Quizzes
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-300" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search participants..."
          className="w-full pl-10 pr-4 py-2.5 border border-navy-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none bg-white"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-navy-100 text-center">
          <div className="text-2xl font-bold text-navy-800">{users.length}</div>
          <div className="text-xs text-navy-500">Total Readers</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-700">
            {enrichedUsers.filter(u => u.trackStatus.status === 'on-track').length}
          </div>
          <div className="text-xs text-green-600">On Track</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 text-center">
          <div className="text-2xl font-bold text-yellow-700">
            {enrichedUsers.filter(u => u.trackStatus.status === 'slightly-behind').length}
          </div>
          <div className="text-xs text-yellow-600">Slightly Behind</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
          <div className="text-2xl font-bold text-red-700">
            {enrichedUsers.filter(u => u.trackStatus.status === 'behind').length}
          </div>
          <div className="text-xs text-red-600">Behind</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-navy-50 border-b border-navy-100">
                <th className="text-left px-4 py-3">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-xs font-medium text-navy-500 uppercase tracking-wide">
                    Name <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3">
                  <button onClick={() => toggleSort('progress')} className="flex items-center gap-1 text-xs font-medium text-navy-500 uppercase tracking-wide">
                    Progress <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">
                  <button onClick={() => toggleSort('streak')} className="flex items-center gap-1 text-xs font-medium text-navy-500 uppercase tracking-wide">
                    Streak <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 hidden md:table-cell">
                  <span className="text-xs font-medium text-navy-500 uppercase tracking-wide">Status</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-navy-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy-800 text-gold-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {u.display_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-navy-800 text-sm">{u.display_name}</div>
                        <div className="text-xs text-navy-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-navy-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-400 rounded-full transition-all"
                          style={{ width: `${u.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-navy-600 font-medium">{u.percentage}%</span>
                    </div>
                    <div className="text-xs text-navy-400 mt-0.5">{u.daysCompleted}/313 days</div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm font-medium text-navy-700">{u.streak.current} days</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.trackStatus.status === 'on-track'
                        ? 'bg-green-100 text-green-700'
                        : u.trackStatus.status === 'slightly-behind'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}>
                      {u.trackStatus.status === 'on-track'
                        ? 'On Track'
                        : `${u.trackStatus.days} days behind`
                      }
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-navy-400 text-sm">
            No participants found.
          </div>
        )}
      </div>
    </div>
  )
}
