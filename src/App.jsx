import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import CalendarPage from './pages/CalendarPage'
import PrintablePlanPage from './pages/PrintablePlanPage'
import QuizListPage from './pages/QuizListPage'
import QuizTakePage from './pages/QuizTakePage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminQuizPage from './pages/admin/AdminQuizPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/plan/print" element={<PrintablePlanPage />} />

            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute><CalendarPage /></ProtectedRoute>
            } />
            <Route path="/quizzes" element={
              <ProtectedRoute><QuizListPage /></ProtectedRoute>
            } />
            <Route path="/quizzes/:id" element={
              <ProtectedRoute><QuizTakePage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>
            } />
            <Route path="/admin/quizzes" element={
              <ProtectedRoute adminOnly><AdminQuizPage /></ProtectedRoute>
            } />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  )
}
