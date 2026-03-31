import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { BookOpen, LayoutDashboard, Calendar, ClipboardList, User, Shield, Menu, X, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = user ? [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/quizzes', label: 'Quizzes', icon: ClipboardList },
    { to: '/profile', label: 'Profile', icon: User },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: Shield }] : [])
  ] : []

  return (
    <nav className="bg-navy-800 text-white shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 font-bold text-lg">
            <BookOpen className="h-6 w-6 text-gold-400" />
            <span className="hidden sm:inline">IOGC Bible Reading <span className="text-gold-400">365</span></span>
            <span className="sm:hidden">IOGC <span className="text-gold-400">365</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(to)
                    ? 'bg-navy-600 text-gold-400'
                    : 'text-navy-200 hover:bg-navy-700 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-navy-200 hover:bg-navy-700 hover:text-white transition-colors ml-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            )}
            {!user && (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm text-navy-200 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="px-4 py-2 text-sm bg-gold-400 text-navy-900 rounded-lg font-medium hover:bg-gold-300 transition-colors">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-navy-200 hover:bg-navy-700"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-navy-700 px-4 pb-4">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm ${
                isActive(to)
                  ? 'bg-navy-600 text-gold-400'
                  : 'text-navy-200 hover:bg-navy-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { handleSignOut(); setMobileOpen(false) }}
              className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-navy-200 hover:bg-navy-700 w-full"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-3 text-sm text-navy-200 hover:bg-navy-700 rounded-lg">
                Sign In
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="px-3 py-3 text-sm bg-gold-400 text-navy-900 rounded-lg font-medium text-center">
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
