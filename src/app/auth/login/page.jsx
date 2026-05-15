"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { Activity } from "lucide-react"
import api from "@/lib/api"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get("role") || "patient"
  
  const [role, setRole] = useState(initialRole)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminAccessCode, setAdminAccessCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDemoLogin = async (selectedRole) => {
    setLoading(true)
    setError("")
    try {
      const demoCredentials = {
        patient: { email: 'patient@example.com', password: 'password123', role: 'patient' },
        doctor: { email: 'doctor@example.com', password: 'password123', role: 'doctor' },
        admin: { email: 'admin@example.com', password: 'password123', adminAccessCode: 'super', role: 'admin' }
      }

      const credentials = demoCredentials[selectedRole]
      console.log('Demo Login - Selected Role:', selectedRole)
      
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.success) {
        const { token, role: userRole } = response.data
        
        localStorage.setItem('token', token)
        localStorage.setItem('role', userRole)
        localStorage.setItem('user', JSON.stringify(response.data))
        
        router.push(`/${userRole}/dashboard`)
      }
    } catch (err) {
      console.error("Demo login failed:", err)
      setError("Demo accounts are currently unavailable. Please register a new account.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const payload = { email, password, role }
      console.log('Login Payload being sent:', payload)
      
      if (role === "admin") {
        payload.adminAccessCode = adminAccessCode
      }

      const response = await api.post('/auth/login', payload)
      console.log('Login Response received:', response.data)
      
      if (response.data.success) {
        const { token, role: userRole, verificationStatus } = response.data
        
        localStorage.setItem('token', token)
        localStorage.setItem('role', userRole)
        localStorage.setItem('user', JSON.stringify(response.data))

        // Redirect based on role returned from backend
        if (userRole === "doctor" && verificationStatus !== "approved") {
           router.push('/auth/register?role=doctor&status=' + verificationStatus)
        } else {
           router.push(`/${userRole}/dashboard`)
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">MediAI</span>
          </Link>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
              <button 
                onClick={() => { setRole("patient"); setError(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === "patient" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                Patient
              </button>
              <button 
                onClick={() => { setRole("doctor"); setError(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === "doctor" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                Doctor
              </button>
              <button 
                onClick={() => { setRole("admin"); setError(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === "admin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                Admin
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-teal-600 hover:underline">Forgot password?</Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              {role === "admin" && (
                <div className="space-y-2">
                  <Label htmlFor="accessCode">Admin Access Code</Label>
                  <Input 
                    id="accessCode" 
                    type="password" 
                    value={adminAccessCode}
                    onChange={(e) => setAdminAccessCode(e.target.value)}
                    required 
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="rounded border-slate-300 text-teal-600 focus:ring-teal-600" />
                <label htmlFor="remember" className="text-sm font-medium leading-none text-slate-700">
                  Remember me
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or use demo accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleDemoLogin('patient')} className="text-xs">
                Demo Patient
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDemoLogin('doctor')} className="text-xs">
                Demo Doctor
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDemoLogin('admin')} className="text-xs">
                Demo Admin
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 p-4">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href={`/auth/register?role=${role}`} className="text-teal-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
