import React, { useState } from 'react'
import axios from 'axios'

const Signup = () => {
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    role: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (!userData.role) {
      setError("Please select a role.")
      return
    }
    setLoading(true)
    try {
      await axios.post("http://localhost:3000/users/", userData)
      setSuccess("Account created successfully! 🎉")
      setUserData({
        name: '',
        username: '',
        role: '',
        password: '',
        confirmPassword: ''
      })
    } catch (err) {
      setError("Error creating user. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div
      className="min-h-[85vh] w-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-2 py-4 overflow-hidden"
      style={{ fontSize: '1.08rem' }}
    >
      <div className="w-full max-w-md bg-white/90 shadow-2xl rounded-2xl p-6 border border-indigo-100 backdrop-blur-md">
        <div className="flex flex-col items-center">
          <img
            alt="Store Management System Logo"
            src="/logo.svg"
            className="h-16 w-auto mb-3 drop-shadow-lg"
          />
          <h3 className="text-base font-semibold text-indigo-600 tracking-tight text-center mb-2">
            Create Staff Account
          </h3>
          <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full mb-4 shadow-sm">
            Admin Only
          </span>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit} autoComplete="off">
          <div>
                         <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
               Full Name
             </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="block w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="block w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-xs font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              value={userData.role}
              onChange={handleChange}
              className="block w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
              <option value="inventorymanager">Inventory Manager</option>
            </select>
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="block w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={userData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="block w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm text-center animate-fade-in">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm text-center animate-fade-in">
              {success}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-500 px-3 py-2 text-base font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-semibold text-indigo-600 hover:text-purple-600 transition"
          >
            Sign in here
          </a>
        </p>
        <p className="mt-3 text-center text-xs text-gray-400 font-medium">
          Store Management System
        </p>
      </div>
      <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-br from-indigo-400/30 to-purple-300/10 pointer-events-none -z-10 rounded-b-2xl blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tr from-purple-200/40 to-indigo-300/10 pointer-events-none -z-10 rounded-tl-2xl blur-2xl"></div>
    </div>
  )
}

export default Signup