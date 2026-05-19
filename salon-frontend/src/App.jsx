import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BookingPage from './pages/BookingPage'
import AppointmentsCalendar from './pages/AppointmentsCalendar'
import NotFound from './pages/NotFound'
import SalonSettings from './pages/SalonSettings' 
import StylistDashboard from './pages/stylist/StylistDashboard'
import StylistSchedule from './pages/stylist/StylistSchedule'
import AdminBookings from './pages/AdminBookings' 

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  
  if (!user) return <Navigate to="/login" replace />
  
  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase())) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children ? children : <Outlet />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      <Route
        path="/"
        element={<ProtectedRoute><Layout /></ProtectedRoute>}
      >
        <Route 
          path="dashboard" 
          element={user?.role === 'Stylist' ? <StylistDashboard /> : <Dashboard />} 
        />

        <Route element={<ProtectedRoute allowedRoles={['Customer']} />}>
          <Route path="book" element={<BookingPage />} />
          <Route path="appointments" element={<AppointmentsCalendar />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Stylist']} />}>
          <Route path="my-schedule" element={<StylistSchedule />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="settings" element={<SalonSettings />} />
          <Route path="admin-bookings" element={<AdminBookings />} />
        </Route> 
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}