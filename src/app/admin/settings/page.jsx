"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Settings, Bell, Shield, Globe, Mail, Smartphone, Activity, Save, ToggleLeft, ToggleRight } from "lucide-react"
import { toast } from "react-hot-toast"

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-teal-600' : 'bg-slate-200'}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
)

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)

  // Platform Settings
  const [platformName, setPlatformName] = useState("MediAI Ecosystem")
  const [supportEmail, setSupportEmail] = useState("support@mediai.com")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationOpen, setRegistrationOpen] = useState(true)

  // Notification Settings
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [smsNotifs, setSmsNotifs] = useState(false)
  const [emergencyAlerts, setEmergencyAlerts] = useState(true)
  const [appointmentReminders, setAppointmentReminders] = useState(true)

  // Security Settings
  const [requireEmailVerification, setRequireEmailVerification] = useState(true)
  const [autoSuspendInactive, setAutoSuspendInactive] = useState(false)
  const [twoFactorAdmin, setTwoFactorAdmin] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("60")

  // AI Settings
  const [aiDiagnostics, setAiDiagnostics] = useState(true)
  const [aiRiskScoring, setAiRiskScoring] = useState(true)
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState("75")

  const handleSave = () => {
    toast.success("Settings saved successfully!")
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Settings</h1>
          <p className="text-slate-500">Configure platform-wide settings and behaviour.</p>
        </div>
        <Button onClick={handleSave} className="gap-2 bg-teal-600 hover:bg-teal-700">
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Platform Settings */}
      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-teal-600" />
            Platform Settings
          </CardTitle>
          <CardDescription>General platform identity and access controls.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Platform Name</label>
              <input
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Support Email</label>
              <input
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
              <div>
                <p className="text-sm font-medium text-slate-900">Maintenance Mode</p>
                <p className="text-xs text-slate-500">Temporarily disable the platform for all users except admins.</p>
              </div>
              <Toggle enabled={maintenanceMode} onChange={setMaintenanceMode} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
              <div>
                <p className="text-sm font-medium text-slate-900">Open Registration</p>
                <p className="text-xs text-slate-500">Allow new patients and doctors to register on the platform.</p>
              </div>
              <Toggle enabled={registrationOpen} onChange={setRegistrationOpen} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-teal-600" />
            Notification Settings
          </CardTitle>
          <CardDescription>Control how alerts and reminders are delivered platform-wide.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                <p className="text-xs text-slate-500">Send appointment updates and reports via email.</p>
              </div>
            </div>
            <Toggle enabled={emailNotifs} onChange={setEmailNotifs} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">SMS Notifications</p>
                <p className="text-xs text-slate-500">Send SMS alerts for critical events (requires SMS gateway).</p>
              </div>
            </div>
            <Toggle enabled={smsNotifs} onChange={setSmsNotifs} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-red-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Emergency SOS Alerts</p>
                <p className="text-xs text-slate-500">Immediately notify admins and nearby doctors of SOS triggers.</p>
              </div>
            </div>
            <Toggle enabled={emergencyAlerts} onChange={setEmergencyAlerts} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Appointment Reminders</p>
                <p className="text-xs text-slate-500">Send 24h reminders to patients before their appointments.</p>
              </div>
            </div>
            <Toggle enabled={appointmentReminders} onChange={setAppointmentReminders} />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-teal-600" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage authentication rules and account protection policies.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
              <div>
                <p className="text-sm font-medium text-slate-900">Require Email Verification</p>
                <p className="text-xs text-slate-500">New accounts must verify their email before accessing the platform.</p>
              </div>
              <Toggle enabled={requireEmailVerification} onChange={setRequireEmailVerification} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
              <div>
                <p className="text-sm font-medium text-slate-900">Auto-Suspend Inactive Accounts</p>
                <p className="text-xs text-slate-500">Automatically suspend accounts with no activity for 90+ days.</p>
              </div>
              <Toggle enabled={autoSuspendInactive} onChange={setAutoSuspendInactive} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
              <div>
                <p className="text-sm font-medium text-slate-900">Two-Factor Auth for Admins</p>
                <p className="text-xs text-slate-500">Require 2FA for all admin logins (requires TOTP setup).</p>
              </div>
              <Toggle enabled={twoFactorAdmin} onChange={setTwoFactorAdmin} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Session Timeout (minutes)</label>
            <input
              type="number"
              value={sessionTimeout}
              onChange={e => setSessionTimeout(e.target.value)}
              className="h-10 w-48 rounded-md border border-slate-200 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <p className="text-xs text-slate-400">Users will be logged out after this period of inactivity.</p>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-teal-600" />
            AI Engine Settings
          </CardTitle>
          <CardDescription>Control AI diagnostic features and confidence thresholds.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
              <div>
                <p className="text-sm font-medium text-slate-900">AI Symptom Diagnostics</p>
                <p className="text-xs text-slate-500">Enable AI-powered symptom checking for patients.</p>
              </div>
              <Toggle enabled={aiDiagnostics} onChange={setAiDiagnostics} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
              <div>
                <p className="text-sm font-medium text-slate-900">AI Emergency Risk Scoring</p>
                <p className="text-xs text-slate-500">Use AI to auto-classify SOS cases as Low / Medium / High / Critical.</p>
              </div>
              <Toggle enabled={aiRiskScoring} onChange={setAiRiskScoring} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">AI Confidence Threshold (%)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="99"
                value={aiConfidenceThreshold}
                onChange={e => setAiConfidenceThreshold(e.target.value)}
                className="flex-1 accent-teal-600"
              />
              <span className="text-sm font-bold text-teal-600 w-10">{aiConfidenceThreshold}%</span>
            </div>
            <p className="text-xs text-slate-400">AI will only surface diagnoses above this confidence level.</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Footer */}
      <div className="flex justify-end pb-6">
        <Button onClick={handleSave} className="gap-2 bg-teal-600 hover:bg-teal-700 px-8">
          <Save className="h-4 w-4" />
          {saved ? "✓ Saved!" : "Save All Changes"}
        </Button>
      </div>
    </div>
  )
}
