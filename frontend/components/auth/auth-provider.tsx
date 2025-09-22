"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "patient" | "doctor"
  avatar?: string
  specialization?: string // For doctors
  licenseNumber?: string // For doctors
  patientId?: string
  doctorId?: string
}

interface SignupInput {
  name: string
  email: string
  password: string
  role: "patient" | "doctor"
  patientId?: string
  doctorId?: string
  customId?: string
}

interface AuthContextType {
  user: User | null
  login: (id: string, password: string, role?: "patient" | "doctor") => Promise<boolean>
  signup: (data: SignupInput) => Promise<boolean>
  logout: () => void
  switchRole: (role: "patient" | "doctor") => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Session check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (id: string, password: string, role?: "patient" | "doctor"): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id, password })
      })

      const data = await response.json()
      
      if (data.success && data.user) {
        setUser(data.user)
        return true
      } else {
        console.error('Login failed:', data.error)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupInput): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })

      const result = await response.json()
      
      if (result.success && result.user) {
        setUser(result.user)
        return true
      } else {
        console.error('Signup failed:', result.error)
        return false
      }
    } catch (error) {
      console.error('Signup error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const switchRole = (role: "patient" | "doctor") => {
    // For demo purposes, create a mock user with the selected role
    // In a real app, you might want to handle role switching differently
    const mockUsers = {
      patient: {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "patient" as const,
        avatar: "/patient-avatar.png",
        patientId: "P001",
      },
      doctor: {
        id: "2",
        name: "Dr. Sarah Wilson",
        email: "dr.wilson@hospital.com",
        role: "doctor" as const,
        avatar: "/doctor-avatar.png",
        specialization: "Cardiology",
        licenseNumber: "MD-12345",
        doctorId: "D001",
      }
    }
    
    setUser(mockUsers[role])
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, switchRole, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
