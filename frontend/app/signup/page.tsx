"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { 
  Loader2, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Stethoscope,
  Info
} from "lucide-react"

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  customId?: string
  general?: string
  consentGiven?: string
}

interface PasswordStrength {
  score: number
  feedback: string[]
  hasMinLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    customId: "",
    consentGiven: false,
    consentPurpose: "care",
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Password strength calculation
  const passwordStrength = useMemo((): PasswordStrength => {
    const { password } = formData
    const checks = {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    const score = Object.values(checks).filter(Boolean).length
    const feedback: string[] = []
    
    if (!checks.hasMinLength) feedback.push("At least 8 characters")
    if (!checks.hasUppercase) feedback.push("One uppercase letter")
    if (!checks.hasLowercase) feedback.push("One lowercase letter")
    if (!checks.hasNumber) feedback.push("One number")
    if (!checks.hasSpecialChar) feedback.push("One special character")
    
    return { score, feedback, ...checks }
  }, [formData.password])

  // Form validation
  const validateField = useCallback((field: string, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required"
        if (value.trim().length < 2) return "Name must be at least 2 characters"
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Name can only contain letters and spaces"
        return undefined
        
      case "email":
        if (!value) return "Email is required"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email"
        return undefined
        
      case "password":
        if (!value) return "Password is required"
        if (passwordStrength.score < 3) return "Password is too weak"
        return undefined
        
      case "confirmPassword":
        if (!value) return "Please confirm your password"
        if (value !== formData.password) return "Passwords do not match"
        return undefined
        
      case "customId":
        if (value && (!/^\d+$/.test(value) || value.length > 6)) {
          return "ID must be numbers only (max 6 digits)"
        }
        return undefined
      case "consentGiven":
        if (!value) return "Consent is required to create an account"
        return undefined
        
      default:
        return undefined
    }
  }, [formData.password, passwordStrength.score])

  // Update form data and validate
  const updateField = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
    
    // Special case: validate confirm password when password changes
    if (field === "password" && touched.confirmPassword) {
      const confirmError = validateField("confirmPassword", formData.confirmPassword)
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }))
    }
  }, [touched, validateField, formData.confirmPassword])

  // Handle field blur
  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field as keyof typeof formData] as string)
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [formData, validateField])

  // Generate final ID
  const finalId = useMemo(() => {
    const prefix = "D"
    const idNumber = formData.customId.trim() || Math.floor(Math.random() * 900) + 100
    return `${prefix}${idNumber.toString().padStart(3, "0")}`
  }, [formData.customId])

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validate all fields
    const newErrors: FormErrors = {}
    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field, value as string)
      if (error) newErrors[field as keyof FormErrors] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
      setIsSubmitting(false)
      return
    }

    try {
      const success = await signup({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: "doctor",
        doctorId: finalId,
        customId: formData.customId,
      })

      if (!success) {
        setErrors({ general: "Account creation failed. Please try again." })
        return
      }

      router.push("/dashboard")
    } catch (error) {
      setErrors({ 
        general: error instanceof Error ? error.message : "An unexpected error occurred" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPasswordStrengthColor = (score: number) => {
    if (score < 2) return "#ef4444"
    if (score < 4) return "#f59e0b"
    return "#10b981"
  }

  const getPasswordStrengthText = (score: number) => {
    if (score < 2) return "Weak"
    if (score < 4) return "Medium"
    return "Strong"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95">
          {/* Header */}
          <div className="text-center px-8 pt-8 pb-6 bg-gradient-to-br from-cyan-50 to-teal-50">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Doctor Registration
            </h1>
            <p className="text-gray-600">
              Join our healthcare platform as a medical professional 👨‍⚕️
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Error Alert */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 text-sm font-medium">Error</p>
                  <p className="text-red-700 text-sm">{errors.general}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.consentGiven}
                    onChange={(e) => updateField("consentGiven", e.target.checked as any)}
                    onBlur={() => handleBlur("consentGiven")}
                    className="mr-2"
                  />
                  I consent to processing my data for care delivery
                </label>
                {errors.consentGiven && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.consentGiven as any}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="purpose">
                  Purpose of Use
                </label>
                <select
                  id="purpose"
                  value={formData.consentPurpose}
                  onChange={(e) => updateField("consentPurpose", e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-cyan-500"
                >
                  <option value="care">Care Delivery</option>
                  <option value="research">De-identified Research</option>
                  <option value="ops">Operations</option>
                </select>
              </div>
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="name">
                  <User className="w-4 h-4 text-gray-500" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="Dr. John Smith"
                    className={`
                      w-full h-12 px-4 pr-10 rounded-xl border-2 transition-all duration-200 font-medium
                      ${errors.name && touched.name 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : !errors.name && touched.name && formData.name 
                        ? "border-green-300 focus:border-green-500 bg-green-50" 
                        : "border-gray-200 focus:border-cyan-500 bg-white"
                      }
                      focus:outline-none focus:ring-4 focus:ring-opacity-20
                      ${errors.name && touched.name ? "focus:ring-red-500" : "focus:ring-cyan-500"}
                    `}
                    required
                  />
                  {!errors.name && touched.name && formData.name && (
                    <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                  )}
                  {errors.name && touched.name && (
                    <XCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />
                  )}
                </div>
                {errors.name && touched.name && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="email">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="dr.smith@hospital.com"
                    className={`
                      w-full h-12 px-4 pr-10 rounded-xl border-2 transition-all duration-200 font-medium
                      ${errors.email && touched.email 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : !errors.email && touched.email && formData.email 
                        ? "border-green-300 focus:border-green-500 bg-green-50" 
                        : "border-gray-200 focus:border-cyan-500 bg-white"
                      }
                      focus:outline-none focus:ring-4 focus:ring-opacity-20
                      ${errors.email && touched.email ? "focus:ring-red-500" : "focus:ring-cyan-500"}
                    `}
                    required
                  />
                  {!errors.email && touched.email && formData.email && (
                    <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                  )}
                  {errors.email && touched.email && (
                    <XCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />
                  )}
                </div>
                {errors.email && touched.email && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="password">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Password
                  <div className="group relative">
                    <Info className="w-3 h-3 text-gray-400 cursor-help" />
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-64 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      Password must contain at least 8 characters with uppercase, lowercase, number, and special character
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="Create a strong password"
                    className={`
                      w-full h-12 px-4 pr-12 rounded-xl border-2 transition-all duration-200 font-medium
                      ${errors.password && touched.password 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : passwordStrength.score >= 3 && touched.password && formData.password 
                        ? "border-green-300 focus:border-green-500 bg-green-50" 
                        : "border-gray-200 focus:border-cyan-500 bg-white"
                      }
                      focus:outline-none focus:ring-4 focus:ring-opacity-20
                      ${errors.password && touched.password ? "focus:ring-red-500" : "focus:ring-cyan-500"}
                    `}
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: getPasswordStrengthColor(passwordStrength.score) }}>
                        {getPasswordStrengthText(passwordStrength.score)}
                      </span>
                      <span className="text-xs text-gray-500">{passwordStrength.score}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: getPasswordStrengthColor(passwordStrength.score)
                        }}
                      />
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {errors.password && touched.password && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="confirmPassword">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    placeholder="Confirm your password"
                    className={`
                      w-full h-12 px-4 pr-12 rounded-xl border-2 transition-all duration-200 font-medium
                      ${errors.confirmPassword && touched.confirmPassword 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : !errors.confirmPassword && touched.confirmPassword && formData.confirmPassword 
                        ? "border-green-300 focus:border-green-500 bg-green-50" 
                        : "border-gray-200 focus:border-cyan-500 bg-white"
                      }
                      focus:outline-none focus:ring-4 focus:ring-opacity-20
                      ${errors.confirmPassword && touched.confirmPassword ? "focus:ring-red-500" : "focus:ring-cyan-500"}
                    `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`
                  w-full h-14 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2
                  ${isSubmitting || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 shadow-lg shadow-cyan-200 hover:shadow-xl hover:shadow-cyan-300"
                  }
                  transform hover:scale-[1.02] active:scale-[0.98]
                `}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-5 h-5" />
                    Register as Doctor
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center pb-8 px-8">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                className="font-semibold text-cyan-600 hover:text-cyan-700 transition-colors" 
                href="/login"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}