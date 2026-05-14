import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Phone, MapPin, AlertCircle, HeartPulse, ShieldAlert, Navigation } from "lucide-react"

export default function EmergencySOS() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
          <ShieldAlert className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Emergency SOS</h1>
        <p className="text-slate-500 mt-2">Immediate assistance and critical information.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Call Ambulance */}
        <Card className="border-red-200 bg-red-50/50 shadow-sm overflow-hidden group">
          <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Ambulance</h2>
            <p className="text-slate-600 mb-6">Call national emergency services immediately.</p>
            <a href="tel:112" className="w-full">
              <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white text-lg h-14 shadow-md">
                Call 112 Now
              </Button>
            </a>
            <p className="text-xs text-slate-500 mt-4 hidden sm:block">
              Calling features work best on mobile devices.
            </p>
          </CardContent>
        </Card>

        {/* Nearest Hospital */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
            <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Nearest Hospital</h2>
            <p className="text-slate-600 mb-6">Find emergency rooms near your current location.</p>
            <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white text-lg h-14 shadow-md gap-2">
              <Navigation className="h-5 w-5" /> Locate Hospitals
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-red-500" />
            Emergency Contacts
          </CardTitle>
          <CardDescription>People to notify in case of an emergency.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-slate-600">JD</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Jane Doe</p>
                <p className="text-sm text-slate-500">Spouse</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="h-4 w-4" /> Call
              </Button>
              <Button variant="danger" size="sm" className="gap-2">
                <AlertCircle className="h-4 w-4" /> Alert
              </Button>
            </div>
          </div>
          
          <Button variant="outline" className="w-full border-dashed">
            + Add Emergency Contact
          </Button>
        </CardContent>
      </Card>

      {/* Basic Medical Info */}
      <Card className="bg-slate-900 text-white border-transparent">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Medical ID</h3>
              <p className="text-slate-400 text-sm">Vital information for first responders.</p>
            </div>
            <div className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-sm font-semibold">
              O+ Blood Type
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Severe Allergies</p>
              <p className="font-medium text-red-400">Penicillin, Peanuts</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Current Medications</p>
              <p className="font-medium">Metformin (500mg)</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Medical Conditions</p>
              <p className="font-medium">Type 2 Diabetes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
