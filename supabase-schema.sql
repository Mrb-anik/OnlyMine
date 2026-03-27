-- ============================================================
-- LEAD MATRIX – SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor (Project → SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. CLIENTS TABLE
-- One row per client (HVAC/plumbing/electrical contractor)
-- ============================================================
CREATE TABLE clients (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  owner_name    TEXT,
  email         TEXT NOT NULL,
  phone         TEXT,
  industry      TEXT CHECK (industry IN ('hvac','plumbing','electrical','other')) DEFAULT 'hvac',
  plan          TEXT CHECK (plan IN ('speed-to-lead','complete-tech','growth-engine')) DEFAULT 'speed-to-lead',
  cal_link      TEXT,         -- Cal.com booking URL for this client
  booking_message TEXT,       -- Custom auto-response message
  dashboard_url TEXT,         -- Their portal URL
  active        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. LEADS TABLE
-- Every inbound lead captured by n8n or website form
-- ============================================================
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id       UUID REFERENCES clients(id) ON DELETE CASCADE,
  lead_name       TEXT,
  phone           TEXT,
  email           TEXT,
  source          TEXT CHECK (source IN ('website','phone','referral','google','facebook','other')) DEFAULT 'other',
  message         TEXT,
  status          TEXT CHECK (status IN ('new','contacted','booked','completed','lost')) DEFAULT 'new',
  response_time   INTEGER,    -- seconds from lead to first response
  booked          BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. APPOINTMENTS TABLE
-- ============================================================
CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id       UUID REFERENCES clients(id) ON DELETE CASCADE,
  lead_id         UUID REFERENCES leads(id) ON DELETE SET NULL,
  customer_name   TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  service_type    TEXT NOT NULL,
  scheduled_date  TIMESTAMPTZ NOT NULL,
  status          TEXT CHECK (status IN ('scheduled','confirmed','completed','cancelled')) DEFAULT 'scheduled',
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. AUDIT LEADS TABLE
-- Prospects who fill out the free audit form on the homepage
-- ============================================================
CREATE TABLE audit_leads (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  business_name   TEXT,
  revenue_range   TEXT,
  status          TEXT CHECK (status IN ('pending','contacted','converted','lost')) DEFAULT 'pending',
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. AUTOMATION LOGS TABLE
-- Every n8n action logged here for debugging/reporting
-- ============================================================
CREATE TABLE automation_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id       UUID REFERENCES clients(id) ON DELETE CASCADE,
  lead_id         UUID REFERENCES leads(id) ON DELETE SET NULL,
  action_type     TEXT NOT NULL, -- 'lead_captured', 'auto_response_sent', 'appointment_booked', etc.
  details         JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_leads_client_id ON leads(client_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_scheduled_date ON appointments(scheduled_date);
CREATE INDEX idx_automation_logs_client_id ON automation_logs(client_id);
CREATE INDEX idx_automation_logs_created_at ON automation_logs(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER for leads
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE clients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_leads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Clients: users can only see their own client row
CREATE POLICY "clients_own" ON clients
  FOR ALL USING (auth.uid() = user_id);

-- Leads: clients see only their own leads
CREATE POLICY "leads_own" ON leads
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- Appointments: clients see only their own appointments
CREATE POLICY "appointments_own" ON appointments
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- Automation logs: clients see their own logs
CREATE POLICY "logs_own" ON automation_logs
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- audit_leads: no public access (service role only via adminClient)
-- (No SELECT policy = only service_role can read/write)

-- ============================================================
-- REALTIME (enable for live dashboard updates)
-- ============================================================
-- Run in Supabase Dashboard → Replication → Enable these tables:
-- leads, appointments
