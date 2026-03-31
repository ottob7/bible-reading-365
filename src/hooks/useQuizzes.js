import { useState, useEffect, useCallback } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const LOCAL_QUIZZES_KEY = 'iogc365_quizzes'
const LOCAL_QUIZ_RESULTS_KEY = 'iogc365_quiz_results'

function getLocal(key) {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : []
}
function setLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function useQuizzes() {
  const { user, isAdmin } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [userResults, setUserResults] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchQuizzes() {
    if (!supabaseConfigured) {
      const local = getLocal(LOCAL_QUIZZES_KEY)
      setQuizzes(isAdmin ? local : local.filter(q => q.is_published))
      return
    }

    const query = supabase.from('quizzes').select('*').order('created_at', { ascending: false })
    if (!isAdmin) query.eq('is_published', true)
    const { data } = await query
    if (data) setQuizzes(data)
  }

  async function fetchUserResults() {
    if (!user) return

    if (!supabaseConfigured) {
      const local = getLocal(LOCAL_QUIZ_RESULTS_KEY)
      setUserResults(local.filter(r => r.user_id === user.id))
      return
    }

    const { data } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
    if (data) setUserResults(data)
  }

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    Promise.all([fetchQuizzes(), fetchUserResults()]).then(() => setLoading(false))
  }, [user, isAdmin])

  const createQuiz = useCallback(async (quiz) => {
    if (!supabaseConfigured) {
      const newQuiz = { ...quiz, id: 'quiz-' + Date.now(), created_by: user.id, created_at: new Date().toISOString(), is_published: false }
      const all = [newQuiz, ...getLocal(LOCAL_QUIZZES_KEY)]
      setLocal(LOCAL_QUIZZES_KEY, all)
      setQuizzes(all)
      return newQuiz
    }

    const { data, error } = await supabase
      .from('quizzes')
      .insert({ ...quiz, created_by: user.id })
      .select()
      .single()
    if (error) throw error
    setQuizzes(prev => [data, ...prev])
    return data
  }, [user])

  const updateQuiz = useCallback(async (id, updates) => {
    if (!supabaseConfigured) {
      const all = getLocal(LOCAL_QUIZZES_KEY).map(q => q.id === id ? { ...q, ...updates } : q)
      setLocal(LOCAL_QUIZZES_KEY, all)
      setQuizzes(all)
      return
    }

    const { error } = await supabase.from('quizzes').update(updates).eq('id', id)
    if (error) throw error
    setQuizzes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q))
  }, [])

  const deleteQuiz = useCallback(async (id) => {
    if (!supabaseConfigured) {
      const all = getLocal(LOCAL_QUIZZES_KEY).filter(q => q.id !== id)
      setLocal(LOCAL_QUIZZES_KEY, all)
      setQuizzes(all)
      return
    }

    const { error } = await supabase.from('quizzes').delete().eq('id', id)
    if (error) throw error
    setQuizzes(prev => prev.filter(q => q.id !== id))
  }, [])

  const submitQuizResult = useCallback(async (quizId, score, totalQuestions, answers) => {
    if (!supabaseConfigured) {
      const result = { id: 'result-' + Date.now(), quiz_id: quizId, user_id: user.id, score, total_questions: totalQuestions, answers, completed_at: new Date().toISOString() }
      const all = [...getLocal(LOCAL_QUIZ_RESULTS_KEY), result]
      setLocal(LOCAL_QUIZ_RESULTS_KEY, all)
      setUserResults(prev => [...prev, result])
      return result
    }

    const { data, error } = await supabase
      .from('quiz_results')
      .insert({ quiz_id: quizId, user_id: user.id, score, total_questions: totalQuestions, answers })
      .select()
      .single()
    if (error) throw error
    setUserResults(prev => [...prev, data])
    return data
  }, [user])

  return { quizzes, userResults, loading, createQuiz, updateQuiz, deleteQuiz, submitQuizResult, refetch: fetchQuizzes }
}
