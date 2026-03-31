import { useState, useEffect, useCallback } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const LOCAL_PROGRESS_KEY = 'iogc365_progress'

function getLocalProgress() {
  const stored = localStorage.getItem(LOCAL_PROGRESS_KEY)
  return stored ? JSON.parse(stored) : []
}

function setLocalProgress(dates) {
  localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(dates))
}

export function useReadingProgress() {
  const { user } = useAuth()
  const [completedDates, setCompletedDates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setCompletedDates([])
      setLoading(false)
      return
    }

    if (!supabaseConfigured) {
      // Demo mode: use localStorage
      setCompletedDates(getLocalProgress())
      setLoading(false)
      return
    }

    async function fetchProgress() {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('reading_date')
        .eq('user_id', user.id)

      if (!error && data) {
        setCompletedDates(data.map(d => d.reading_date))
      }
      setLoading(false)
    }

    fetchProgress()

    // Real-time subscription
    const channel = supabase
      .channel('reading_progress_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reading_progress',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchProgress()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const toggleDay = useCallback(async (dateStr) => {
    if (!user) return

    const isCompleted = completedDates.includes(dateStr)

    if (!supabaseConfigured) {
      // Demo mode: localStorage
      const updated = isCompleted
        ? completedDates.filter(d => d !== dateStr)
        : [...completedDates, dateStr]
      setCompletedDates(updated)
      setLocalProgress(updated)
      return
    }

    if (isCompleted) {
      setCompletedDates(prev => prev.filter(d => d !== dateStr))

      const { error } = await supabase
        .from('reading_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('reading_date', dateStr)

      if (error) {
        setCompletedDates(prev => [...prev, dateStr])
      }
    } else {
      setCompletedDates(prev => [...prev, dateStr])

      const { error } = await supabase
        .from('reading_progress')
        .insert({ user_id: user.id, reading_date: dateStr })

      if (error) {
        setCompletedDates(prev => prev.filter(d => d !== dateStr))
      }
    }
  }, [user, completedDates])

  return { completedDates, loading, toggleDay }
}
