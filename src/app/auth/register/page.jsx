"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Activity, Upload, CheckCircle2, Clock, XCircle, AlertCircle, Image as ImageIcon, FileText } from "lucide-react"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "patient"
  
  const [step, setStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  // For demo purposes, we can toggle this to see different states
  const [verificationStatus, setVerificationStatus] = useState("Pending") // Pending, Approved, Rejected

  const isPatient = role === "patient"
  const isDoctor = role === "doctor"

  const handleRegister = (e) => {
    e.preventDefault()
    if (isDoctor) {
      setIsSubmitted(true)
    } else {
      router.push(`/${role}/dashboard`)
    }
  }

  if (role === "admin") {
    // Admins can't register here
    if (typeof window !== 'undefined') {
      router.push("/auth/login?role=admin")
    }
    return null;
  }

  // Render Success State for Doctor
  if (isSubmitted && isDoctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full">
          <Card className="text-center shadow-md border-slate-200">
            <CardContent className="p-8 flex flex-col items-center">
              {verificationStatus === "Pending" && (
                <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
              )}
              {verificationStatus === "Approved" && (
                <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
              )}
              {verificationStatus === "Rejected" && (
                <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
              )}

              <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Request Submitted</h2>
              
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm font-medium text-slate-500">Status:</span>
                <Badge variant={
                  verificationStatus === "Pending" ? "warning" : 
                  verificationStatus === "Approved" ? "success" : "destructive"
                }>
                  {verificationStatus === "Pending" && "Pending Admin Approval"}
                  {verificationStatus === "Approved" && "Approved"}
                  {verificationStatus === "Rejected" && "Rejected"}
                </Badge>
              </div>

              {verificationStatus === "Pending" && (
                <p className="text-slate-600 text-sm mb-8">
                  Your profile is under admin review.
                </p>
              )}

              {verificationStatus === "Rejected" && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm text-left w-full mb-8">
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    <AlertCircle className="h-4 w-4" /> Rejection Reason
                  </div>
                  <p>The Medical License proof uploaded is blurry and unreadable. Please upload a clearer copy.</p>
                </div>
              )}

              <div className="w-full flex flex-col gap-3">
                {verificationStatus === "Rejected" ? (
                  <Button onClick={() => setIsSubmitted(false)} className="w-full">Update Details</Button>
                ) : (
                  <Button onClick={() => router.push("/")} variant="outline" className="w-full">Return to Home</Button>
                )}
                {verificationStatus === "Approved" && (
                  <Button onClick={() => router.push("/doctor/dashboard")} className="w-full">Go to Dashboard</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">MediAI</span>
          </Link>
        </div>

        <Card className="w-full shadow-sm">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Registering as a <span className="font-semibold text-teal-600 capitalize">{role}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Basic Details - Both Roles */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <Button type="button" className="w-full" onClick={() => setStep(2)}>Continue</Button>
                </div>
              )}

              {/* Patient Specific Details */}
              {isPatient && step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sex">Sex</Label>
                      <select id="sex" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <select id="bloodGroup" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies (if any)</Label>
                    <Input id="allergies" placeholder="e.g. Peanuts, Penicillin" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Input id="medications" placeholder="e.g. Metformin 500mg" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="history">Previous Disease History</Label>
                    <Input id="history" placeholder="e.g. Asthma, Hypertension" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyHistory">Family Disease History</Label>
                    <Input id="familyHistory" placeholder="e.g. Diabetes in mother" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input id="emergency" placeholder="Name and Phone Number" required />
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>Back</Button>
                    <Button type="submit" className="w-full">Create Account</Button>
                  </div>
                </div>
              )}

              {/* Doctor Specific Details */}
              {isDoctor && step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  {/* Professional Details Section */}
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-2">
                      <h3 className="text-lg font-semibold text-slate-900">Professional Details</h3>
                      <p className="text-xs text-slate-500">Provide your medical qualifications.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization <span className="text-red-500">*</span></Label>
                        <select id="specialization" required className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                          <option value="">Select Speciality</option>
                          <option value="cardiology">Cardiology</option>
                          <option value="dermatology">Dermatology</option>
                          <option value="general">General Practice</option>
                          <option value="neurology">Neurology</option>
                          <option value="pediatrics">Pediatrics</option>
                          <option value="psychiatry">Psychiatry</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience <span className="text-red-500">*</span></Label>
                        <Input id="experience" type="number" min="0" required placeholder="e.g. 10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license">Medical License Number <span className="text-red-500">*</span></Label>
                      <Input id="license" required placeholder="Enter your registration/license number" />
                    </div>
                  </div>

                  {/* Clinic Details Section */}
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-2">
                      <h3 className="text-lg font-semibold text-slate-900">Clinic Details</h3>
                      <p className="text-xs text-slate-500">Where do you currently practice?</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clinic">Hospital / Clinic Name <span className="text-red-500">*</span></Label>
                      <Input id="clinic" required placeholder="e.g. City General Hospital" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clinicAddress">Clinic Address <span className="text-red-500">*</span></Label>
                      <Input id="clinicAddress" required placeholder="Full address including city and zip code" />
                    </div>
                  </div>

                  {/* Document Uploads Section */}
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-2">
                      <h3 className="text-lg font-semibold text-slate-900">Verification Documents</h3>
                      <p className="text-xs text-slate-500">Securely upload documents for admin verification (PDF/JPG/PNG).</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Government ID */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Government ID <span className="text-red-500">*</span></Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-50 hover:border-teal-200 transition-colors group">
                          <div className="p-2 bg-slate-100 rounded-full mb-2 group-hover:bg-teal-100 transition-colors">
                            <Upload className="h-5 w-5 text-slate-500 group-hover:text-teal-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">Upload ID Proof</span>
                          <span className="text-xs text-slate-400 mt-1">Max file size: 5MB</span>
                        </div>
                      </div>

                      {/* Medical Degree */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Medical Degree <span className="text-red-500">*</span></Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-50 hover:border-teal-200 transition-colors group">
                          <div className="p-2 bg-slate-100 rounded-full mb-2 group-hover:bg-teal-100 transition-colors">
                            <FileText className="h-5 w-5 text-slate-500 group-hover:text-teal-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">Upload Certificate</span>
                          <span className="text-xs text-slate-400 mt-1">Max file size: 5MB</span>
                        </div>
                      </div>

                      {/* Medical License */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Medical License Proof <span className="text-red-500">*</span></Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-50 hover:border-teal-200 transition-colors group">
                          <div className="p-2 bg-slate-100 rounded-full mb-2 group-hover:bg-teal-100 transition-colors">
                            <FileText className="h-5 w-5 text-slate-500 group-hover:text-teal-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">Upload License</span>
                          <span className="text-xs text-slate-400 mt-1">Valid registration proof</span>
                        </div>
                      </div>

                      {/* Profile Photo */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Profile Photo <span className="text-slate-400 font-normal">(Optional)</span></Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-50 hover:border-teal-200 transition-colors group">
                          <div className="p-2 bg-slate-100 rounded-full mb-2 group-hover:bg-teal-100 transition-colors">
                            <ImageIcon className="h-5 w-5 text-slate-500 group-hover:text-teal-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">Upload Photo</span>
                          <span className="text-xs text-slate-400 mt-1">Clear headshot</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>
                      <strong>Important:</strong> Doctors must be verified by admin before accessing consultations. This process typically takes 1-2 business days.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>Back</Button>
                    <Button type="submit" className="w-full">Submit Verification Request</Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 p-4">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href={`/auth/login?role=${role}`} className="text-teal-600 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  )
}

