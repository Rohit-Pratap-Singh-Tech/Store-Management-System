import React, { useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

// Premium blue/gray theme
const THEME = {
  primary: '#3B5BA5',
  secondary: '#6C8BC7',
  accent: '#4F46E5',
  bgLight: '#F6F8FB',
  bgDark: '#E3EAF6',
  white: '#FFFFFF',
  border: '#D1D9E6',
  shadow: 'rgba(60, 90, 150, 0.10)',
  icon: '#3B5BA5',
  muted: '#7B8CA7',
}

const VALID_ROLES = ["Admin", "Manager", "Cashier", "Inventory Manager"]

const Login = () => {
  const selectedRole = localStorage.getItem("selectedRole") || ""
  const [userData, setData] = useState({ username:'', password:'' })
  const [error, setError] = useState("")
  const location = useLocation()

  const handleEdit = (e) => {
    setData({
      ...userData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
  
    const trimmedData = {
      username: userData.username.trim(),
      password: userData.password.trim(),
    }
  
    if (trimmedData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
  
    try {
      const res = await axios.post('http://127.0.0.1:8000/users/login/', trimmedData)
  
      if (!VALID_ROLES.includes(res.data.role)) {
        setError("Invalid role received from server")
        return
      }
  
      const selectedRole = localStorage.getItem("selectedRole")
      if (selectedRole && res.data.role !== selectedRole) {
        setError(`Please enter ${selectedRole} credentials`)
        return
      }
  
      localStorage.setItem("authToken", res.data.access)
      localStorage.setItem("refreshToken", res.data.refresh)
      localStorage.setItem("userRole", res.data.role)
  
      if (res.data.role === "Admin") window.location.href = "/admin"
      else if (res.data.role === "Manager") window.location.href = "/manager-dashboard"
      else window.location.href = "/"
  
      setData({ username:'', password:'' })
    } catch (err) {
      console.error(err)
      setError("Invalid username or password")
    }
  }
  

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(120deg, ${THEME.bgLight} 0%, ${THEME.white} 60%, ${THEME.bgDark} 100%)`,
        minHeight: '100vh',
      }}
    >
      {/* Background gradients */}
      <div
        className="absolute top-0 left-0 w-full h-32 sm:h-64 pointer-events-none -z-10"
        style={{ background: `radial-gradient(circle at 20% 0%, ${THEME.secondary}22 0%, transparent 70%)` }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-1/2 h-32 sm:h-64 pointer-events-none -z-10"
        style={{ background: `radial-gradient(circle at 80% 100%, ${THEME.primary}18 0%, transparent 80%)` }}
      ></div>
      <div
        className="absolute top-1/2 left-0 w-1/3 h-16 sm:h-32 pointer-events-none -z-10"
        style={{ background: `radial-gradient(circle at 0% 50%, ${THEME.bgDark}33 0%, transparent 80%)` }}
      ></div>

      {/* Login card */}
      <div
        className="w-full max-w-sm sm:max-w-md shadow-2xl rounded-2xl p-6 sm:p-8 border backdrop-blur-md"
        style={{
          background: `linear-gradient(120deg, ${THEME.white} 80%, ${THEME.bgLight} 100%)`,
          borderColor: THEME.border,
          boxShadow: `0 8px 32px 0 ${THEME.shadow}`,
        }}
      >
        <div className="flex flex-col items-center mb-6">
          <img
            alt="Store Management System Logo"
            src="/logo.svg"
            className="h-16 sm:h-20 w-auto mb-3"
            style={{ filter: `drop-shadow(0 4px 16px ${THEME.accent}33)` }}
          />
          <h3
            className="text-base sm:text-lg font-bold tracking-tight text-center mb-2"
            style={{ color: THEME.primary, letterSpacing: '0.01em' }}
          >
            {selectedRole ? `Sign in as ${selectedRole}` : "Sign in to your account"}
          </h3>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label htmlFor="username" className="block text-xs font-semibold mb-1" style={{ color: THEME.primary }}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              value={userData.username}
              onChange={handleEdit}
              placeholder="Enter your username"
              className="block w-full rounded-lg px-3 py-2 text-sm sm:text-base placeholder-gray-400 transition"
              style={{
                border: `1.5px solid ${THEME.border}`,
                background: THEME.white,
                color: THEME.primary,
                boxShadow: `0 1px 4px 0 ${THEME.shadow}`,
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold mb-1" style={{ color: THEME.primary }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={userData.password}
              onChange={handleEdit}
              placeholder="Enter your password"
              className="block w-full rounded-lg px-3 py-2 text-sm sm:text-base placeholder-gray-400 transition"
              style={{
                border: `1.5px solid ${THEME.border}`,
                background: THEME.white,
                color: THEME.primary,
                boxShadow: `0 1px 4px 0 ${THEME.shadow}`,
                outline: 'none'
              }}
            />
            <div className="flex justify-end mt-1">
              <a href="#" className="text-xs font-semibold transition" style={{ color: THEME.primary }}>
                Forgot password?
              </a>
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-600">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg px-3 py-2 text-sm sm:text-base font-semibold text-white shadow-lg transition"
              style={{
                background: `linear-gradient(90deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
                boxShadow: `0 2px 8px 0 ${THEME.shadow}`,
                border: 'none'
              }}
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-3 text-center text-xs font-medium" style={{ color: THEME.secondary }}>
          Store Management System
        </p>
      </div>

      {/* Decorative SVGs */}
      <svg
        className="absolute top-6 sm:top-10 left-6 sm:left-10 w-8 h-8 sm:w-12 sm:h-12 opacity-20 pointer-events-none -z-10"
        fill="none"
        viewBox="0 0 48 48"
      >
        <rect x="8" y="8" width="32" height="32" rx="8" fill={THEME.secondary} />
        <path d="M16 24h16M24 16v16" stroke={THEME.primary} strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <svg
        className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-12 h-12 sm:w-16 sm:h-16 opacity-10 pointer-events-none -z-10"
        fill="none"
        viewBox="0 0 64 64"
      >
        <circle cx="32" cy="32" r="28" fill={THEME.primary} />
        <path d="M20 32h24" stroke={THEME.white} strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

export default Login
