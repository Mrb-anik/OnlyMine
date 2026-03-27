// Database types for Lead Matrix

export type LeadStatus = 'new' | 'contacted' | 'booked' | 'completed' | 'lost'
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
export type LeadSource = 'website' | 'phone' | 'referral' | 'google' | 'facebook' | 'other'

export interface Client {
  id: string
  business_name: string
  owner_name: string
  email: string
  phone: string
  industry: 'hvac' | 'plumbing' | 'electrical' | 'other'
  plan: 'speed-to-lead' | 'complete-tech' | 'growth-engine'
  cal_link?: string
  booking_message?: string
  dashboard_url?: string
  created_at: string
  active: boolean
}

export interface Lead {
  id: string
  client_id: string
  lead_name: string | null
  phone: string | null
  email: string | null
  source: LeadSource
  message: string | null
  status: LeadStatus
  response_time: number | null // seconds
  booked: boolean
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  client_id: string
  lead_id: string | null
  customer_name: string
  phone: string | null
  email: string | null
  service_type: string
  scheduled_date: string
  status: AppointmentStatus
  notes: string | null
  created_at: string
}

export interface AutomationLog {
  id: string
  client_id: string
  lead_id: string | null
  action_type: string
  details: Record<string, unknown>
  created_at: string
}

export interface DashboardStats {
  totalLeads: number
  avgResponseTime: number
  bookedAppointments: number
  conversionRate: number
}

export interface ROICalculation {
  monthlyRevenue: number
  avgJobValue: number
  leadsPerMonth: number
  conversionRate: number
  additionalRevenue: number
  annualGrowth: number
}
