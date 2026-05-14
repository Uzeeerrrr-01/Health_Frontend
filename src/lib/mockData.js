// Centralized mock data for MediAI Ecosystem

export const MOCK_USER = {
  patient: {
    id: "p1",
    name: "John Doe",
    email: "john@example.com",
    role: "patient",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    age: 34,
    bloodGroup: "O+",
    allergies: ["Penicillin", "Peanuts"],
    height: "175 cm",
    weight: "72 kg",
  },
  doctor: {
    id: "d1",
    name: "Dr. Sarah Smith",
    email: "sarah@mediai.com",
    role: "doctor",
    specialization: "Cardiologist",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    verified: true,
    rating: 4.9,
    patients: 1240,
  },
  admin: {
    id: "a1",
    name: "Admin User",
    email: "admin@mediai.com",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
  }
};

export const MOCK_APPOINTMENTS = [
  {
    id: "apt1",
    patientName: "John Doe",
    doctorName: "Dr. Sarah Smith",
    specialization: "Cardiology",
    date: "2026-05-15",
    time: "10:00 AM",
    type: "Online Consultation",
    status: "Upcoming",
    patientId: "p1",
    doctorId: "d1"
  },
  {
    id: "apt2",
    patientName: "John Doe",
    doctorName: "Dr. Michael Chen",
    specialization: "General Practice",
    date: "2026-05-10",
    time: "02:30 PM",
    type: "Offline Visit",
    status: "Completed",
    patientId: "p1",
    doctorId: "d2"
  }
];

export const MOCK_REMINDERS = [
  { id: 1, medicine: "Aspirin 75mg", time: "08:00 AM", status: "taken", type: "After Food" },
  { id: 2, medicine: "Metoprolol 50mg", time: "01:00 PM", status: "pending", type: "Before Food" },
  { id: 3, medicine: "Atorvastatin 20mg", time: "09:00 PM", status: "pending", type: "After Food" },
];

export const MOCK_REPORTS = [
  { id: "rep1", title: "Complete Blood Count", date: "2026-05-12", doctor: "Dr. Michael Chen", status: "Approved" },
  { id: "rep2", title: "ECG Analysis", date: "2026-05-14", doctor: "AI Draft", status: "Under Doctor Review" },
];

export const MOCK_DOCTORS = [
  { id: "d1", name: "Dr. Sarah Smith", specialty: "Cardiologist", experience: "15 Years", rating: 4.9, distance: "2.5 km", available: true },
  { id: "d2", name: "Dr. Michael Chen", specialty: "General Practice", experience: "8 Years", rating: 4.7, distance: "1.2 km", available: true },
  { id: "d3", name: "Dr. Emily Davis", specialty: "Dermatologist", experience: "12 Years", rating: 4.8, distance: "5.0 km", available: false },
];

export const MOCK_PATIENT_QUEUE = [
  { id: "q1", patientName: "Alice Brown", symptomSummary: "Severe chest pain, shortness of breath", risk: "High", waitTime: "5 mins" },
  { id: "q2", patientName: "Bob Wilson", symptomSummary: "Mild fever, cough for 3 days", risk: "Low", waitTime: "15 mins" },
  { id: "q3", patientName: "Charlie Davis", symptomSummary: "Persistent headache, blurred vision", risk: "Medium", waitTime: "10 mins" },
];

export const MOCK_DOCTOR_APPROVALS = [
  { id: "da1", name: "Dr. James Wilson", specialty: "Neurology", submittedDate: "2026-05-13", status: "Pending" },
  { id: "da2", name: "Dr. Lisa Wong", specialty: "Pediatrics", submittedDate: "2026-05-12", status: "Pending" },
];

export const MOCK_TRANSACTIONS = [
  { id: "tx1", date: "2026-05-14", amount: "$150.00", user: "John Doe", type: "Consultation Fee", status: "Success" },
  { id: "tx2", date: "2026-05-13", amount: "$75.00", user: "Alice Brown", type: "Consultation Fee", status: "Success" },
  { id: "tx3", date: "2026-05-13", amount: "$200.00", user: "Bob Wilson", type: "Lab Test", status: "Refunded" },
];

export const MOCK_EMERGENCY_ALERTS = [
  { id: "em1", patientName: "Unknown (SOS)", location: "123 Main St, NY", time: "2 mins ago", status: "Dispatching Ambulance" },
];
