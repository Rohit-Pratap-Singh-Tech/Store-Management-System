import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/Landingpage.jsx'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Login can take ?role=Admin or ?role=Cashier */}
        <Route path="/login" element={<Login />} />

        {/* Only Admins can access signup */}
        <Route
          path="/signup"
          element={
            <ProtectedRoute requiredRole="Admin">
              <Signup />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* fallback for unauthorized users */}
        <Route path="/unauthorized" element={<h1>🚫 Access Denied</h1>} />
      </Routes>
    </Router>
  )
}

export default App
