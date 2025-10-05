import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(Cookies.get('token') || localStorage.getItem('mc_token') || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    
    if(token && !user){
      const stored = localStorage.getItem('mc_user')
      if(stored){
        try { setUser(JSON.parse(stored)) } catch {}
      }
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/api/v1/auth/login', { email, password })
      Cookies.set('token', data.token, { expires: 3 })
      setToken(data.token)
      localStorage.setItem('mc_token', data.token)
      const safeUser = { 
        id: data.user._id, 
        email: data.user.email, 
        accountType: data.user.accountType, 
        isApproved: data.user.isApproved,
        firstName: data.user.firstName,
        lastName: data.user.lastName
      }
      setUser(safeUser)
      localStorage.setItem('mc_user', JSON.stringify(safeUser))
      return { ok: true, user: safeUser }
    } catch (e) {
      return { ok: false, error: e?.response?.data?.error?.message || 'Login failed' }
    } finally { setLoading(false) }
  }

  const signup = async (payload) => {
    setLoading(true)
    try {
      const { data } = await api.post('/api/v1/auth/signup', payload)
      return { ok: true, data }
    } catch (e) {
      return { ok: false, error: e?.response?.data?.error?.message || 'Signup failed' }
    } finally { setLoading(false) }
  }

  const sendOtp = async (email) => {
    try {
      await api.post('/api/v1/auth/sendotp', { email })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e?.response?.data?.error?.message || 'OTP failed' }
    }
  }

  const logout = () => {
    console.log('Logging out...')
    Cookies.remove('token')
    setToken('')
    setUser(null)
    localStorage.removeItem('mc_user')
    localStorage.removeItem('mc_token')
    window.location.href = '/'
  }

  const value = useMemo(() => ({ user, token, loading, login, signup, sendOtp, logout, setUser }), [user, token, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
  return useContext(AuthContext)
}


