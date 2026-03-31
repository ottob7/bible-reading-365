import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

// Demo mode user when Supabase is not configured
const DEMO_STORAGE_KEY = 'iogc365_demo_user'

function getDemoUser() {
  const stored = localStorage.getItem(DEMO_STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // --- Supabase mode ---
  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  useEffect(() => {
    if (!supabaseConfigured) {
      // Demo mode: restore from localStorage
      const demo = getDemoUser()
      if (demo) {
        setUser(demo)
        setProfile(demo)
      }
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email, password, displayName) {
    if (!supabaseConfigured) {
      // Demo mode
      const demoUser = {
        id: 'demo-' + Date.now(),
        email,
        display_name: displayName,
        role: 'admin', // Make demo user an admin so they can test everything
      }
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser))
      setUser(demoUser)
      setProfile(demoUser)
      return demoUser
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName }
      }
    })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    if (!supabaseConfigured) {
      // Demo mode: check if user exists in localStorage
      const demo = getDemoUser()
      if (demo && demo.email === email) {
        setUser(demo)
        setProfile(demo)
        return demo
      }
      // Auto-create for demo
      const demoUser = {
        id: 'demo-' + Date.now(),
        email,
        display_name: email.split('@')[0],
        role: 'admin',
      }
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser))
      setUser(demoUser)
      setProfile(demoUser)
      return demoUser
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    if (!supabaseConfigured) {
      localStorage.removeItem(DEMO_STORAGE_KEY)
      setUser(null)
      setProfile(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signUp, signIn, signOut, supabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
