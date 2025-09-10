import { createContext, useState, useEffect, useCallback } from "react"
import { getToken, saveToken, clearToken } from "../api/Api"
import { toast } from "react-toastify"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify user from token on app load
  const verifyUser = useCallback(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    // ✅ No decoding, just store the token
    setUser({ token })
    setLoading(false)
  }, [])

  useEffect(() => {
    verifyUser()
  }, [verifyUser])

  // Login and set user from token
  const login = useCallback((token) => {
    if (!token) return
    saveToken(token)

    // ✅ Just save token in state
    setUser({ token })
    toast.success("Successfully logged in!")
  }, [])

  // Logout user
  const logout = useCallback((message = "Successfully logged out") => {
    clearToken()
    setUser(null)
    if (message) toast.success(message)
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
