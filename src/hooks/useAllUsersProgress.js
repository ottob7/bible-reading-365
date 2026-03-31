import { useState, useEffect } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const LOCAL_PROGRESS_KEY = 'iogc365_progress'

export function useAllUsersProgress() {
  const { isAdmin, user, profile } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false)
      return
    }

    if (!supabaseConfigured) {
      // Demo mode: show current demo user only
      const stored = localStorage.getItem(LOCAL_PROGRESS_KEY)
      const dates = stored ? JSON.parse(stored) : []
      setUsers([{
        ...profile,
        completedDates: dates,
        daysCompleted: dates.length,
      }])
      setLoading(false)
      return
    }

    async function fetchAll() {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('display_name')

      const { data: progress } = await supabase
        .from('reading_progress')
        .select('user_id, reading_date')

      if (profiles && progress) {
        const progressByUser = {}
        for (const p of progress) {
          if (!progressByUser[p.user_id]) progressByUser[p.user_id] = []
          progressByUser[p.user_id].push(p.reading_date)
        }

        const enriched = profiles.map(profile => ({
          ...profile,
          completedDates: progressByUser[profile.id] || [],
          daysCompleted: (progressByUser[profile.id] || []).length
        }))

        setUsers(enriched)
      }
      setLoading(false)
    }

    fetchAll()
  }, [isAdmin])

  return { users, loading }
}
