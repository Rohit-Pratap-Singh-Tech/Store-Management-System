// src/utils/auth.js

export const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('selectedRole')
    window.location.href = '/'
  }
  