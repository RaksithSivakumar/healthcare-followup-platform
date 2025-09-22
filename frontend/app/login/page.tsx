"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { 
  Loader2, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Stethoscope,
  User,
  Shield,
  Heart
} from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    // Auto-detect role from ID prefix
    const role = id.toUpperCase().startsWith('P') ? "patient" :
                  id.toUpperCase().startsWith('D') ? "doctor" :
                  "patient" // default fallback
        
    const ok = await login(id, password, role)
    if (!ok) {
      setError("Invalid credentials. Please check your ID and password.")
      setIsSubmitting(false)
      return
    }
    router.push("/dashboard")
  }

  const getIdIcon = () => {
    if (id.toUpperCase().startsWith('D')) {
      return <Stethoscope className="w-4 h-4 text-cyan-500" />
    } else if (id.toUpperCase().startsWith('P')) {
      return <User className="w-4 h-4 text-indigo-500" />
    }
    return <Shield className="w-4 h-4 text-gray-400" />
  }

  const getIdBorderColor = () => {
    if (id.toUpperCase().startsWith('D')) return "focus:border-cyan-500 focus:ring-cyan-500"
    if (id.toUpperCase().startsWith('P')) return "focus:border-indigo-500 focus:ring-indigo-500"
    return "focus:border-gray-500 focus:ring-gray-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95">
          {/* Header */}
          <div className="text-center px-8 pt-8 pb-6 bg-gradient-to-br from-indigo-50 to-cyan-50">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-1">
              Recuver
            </h1>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your healthcare dashboard
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 text-sm font-medium">Sign In Failed</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              {/* ID Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="id">
                  {getIdIcon()}
                  {id.toUpperCase().startsWith('D') ? 'Doctor ID' : 
                   id.toUpperCase().startsWith('P') ? 'Patient ID' : 
                   'Your ID'}
                </label>
                <div className="relative">
                  <input
                    id="id"
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value.toUpperCase())}
                    placeholder="e.g., D001 for Doctor, P001 for Patient"
                    className={`
                      w-full h-12 px-4 pr-10 text-black rounded-xl border-2 transition-all duration-200 font-medium uppercase tracking-wider
                      ${getIdBorderColor()}
                      border-gray-200 bg-white
                      focus:outline-none focus:ring-4 focus:ring-opacity-20
                      placeholder:normal-case placeholder:tracking-normal
                    `}
                    required
                  />
                  <div className="absolute right-3 top-3.5">
                    {getIdIcon()}
                  </div>
                </div>
                {id && (
                  <p className={`
                    text-xs px-3 py-1 rounded-full font-medium inline-block
                    ${id.toUpperCase().startsWith('D') ? 'bg-cyan-100 text-cyan-700' :
                      id.toUpperCase().startsWith('P') ? 'bg-indigo-100 text-indigo-700' :
                      'bg-gray-100 text-gray-600'}
                  `}>
                    {id.toUpperCase().startsWith('D') ? '👨‍⚕️ Doctor Account' :
                     id.toUpperCase().startsWith('P') ? '🏥 Patient Account' :
                     'Enter your ID'}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="password">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="
                      w-full h-12 px-4 pr-12 text-black rounded-xl border-2 transition-all duration-200 font-medium
                      border-gray-200 focus:border-gray-500 bg-white
                      focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-20
                    "
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`
                  w-full h-14 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2
                  ${isSubmitting || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : id.toUpperCase().startsWith('D')
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-200 hover:shadow-xl hover:shadow-cyan-300"
                    : id.toUpperCase().startsWith('P')
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
                    : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-lg shadow-gray-200 hover:shadow-xl hover:shadow-gray-300"
                  }
                  transform hover:scale-[1.02] active:scale-[0.98]
                `}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Sign In to Recuver
                  </>
                )}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link 
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors" 
                  href="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center pb-4 px-8">
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-2xl p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">New to Recuver?</span>
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Join our healthcare platform as a medical professional
              </p>
              <Link 
                className="inline-flex items-center gap-2 font-semibold text-cyan-600 hover:text-cyan-700 transition-colors text-sm" 
                href="/signup"
              >
                <Stethoscope className="w-4 h-4" />
                Register as Doctor
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}