# 🚀 COMPLETE SETUP GUIDE - LeadCapture Pro Stack

## TABLE OF CONTENTS
1. [Quick Start (60 Minutes)](#quick-start)
2. [Supabase Setup](#supabase-setup)
3. [N8N Setup](#n8n-setup)
4. [Twilio Setup](#twilio-setup)
5. [Cal.com Setup](#calcom-setup)
6. [Client Portal Deployment](#client-portal-deployment)
7. [Landing Page Deployment](#landing-page-deployment)
8. [Testing Everything](#testing-everything)
9. [Client Onboarding Process](#client-onboarding-process)
10. [Troubleshooting](#troubleshooting)

---

## QUICK START

**What you'll build in 60 minutes:**
- Landing page (live website)
- Client portal (dashboard)
- 4 automation workflows
- Complete lead capture system

**Tools needed (all FREE to start):**
- Supabase account
- N8N Cloud account
- Twilio account ($15 credit free)
- Cal.com account
- Vercel account (for deployment)

---

## SUPABASE SETUP

### Step 1: Create Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (easiest)
4. Create new organization: "LeadCapture Pro"

### Step 2: Create Database
1. Click "New Project"
2. Name: `leadcapture-production`
3. Database Password: **Save this securely!**
4. Region: Choose closest to you
5. Free plan is fine to start
6. Click "Create new project" (takes 2 minutes)

### Step 3: Set Up Database Schema
1. Once project is ready, click "SQL Editor" in left sidebar
2. Click "New query"
3. Copy and paste this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  industry TEXT,
  twilio_number TEXT,
  owner_phone TEXT,
  business_phone TEXT,
  dashboard_url TEXT,
  booking_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  lead_name TEXT,
  phone TEXT,
  email TEXT,
  source TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  response_time INTEGER,
  booked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id),
  customer_name TEXT,
  phone TEXT,
  email TEXT,
  service_type TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation logs table
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  action_type TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_leads_client_id ON leads(client_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_scheduled_date ON appointments(scheduled_date);
CREATE INDEX idx_automation_logs_client_id ON automation_logs(client_id);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - you can restrict later)
CREATE POLICY "Enable read access for all users" ON clients FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON clients FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON leads FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON leads FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON appointments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON appointments FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON automation_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON automation_logs FOR INSERT WITH CHECK (true);
```

4. Click "Run" (bottom right)
5. You should see "Success. No rows returned"

### Step 4: Get API Credentials
1. Click "Settings" (gear icon) in left sidebar
2. Click "API" under Project Settings
3. **SAVE THESE VALUES:**
   - `Project URL` (looks like: https://xxxxx.supabase.co)
   - `anon public` key (under "Project API keys")
   - `service_role` key (you'll need this for n8n)

---

## N8N SETUP

### Step 1: Create N8N Cloud Account
1. Go to https://n8n.cloud
2. Sign up (FREE for 5,000 executions/month)
3. Verify email
4. Create new instance (takes 2 minutes)

### Step 2: Add Supabase Credentials
1. In n8n, click your profile (top right)
2. Click "Credentials"
3. Click "Add Credential"
4. Search for "Supabase"
5. Fill in:
   - **Host**: Your Supabase Project URL (without https://)
   - **Service Role Secret**: Your service_role key from Supabase
6. Click "Save"
7. Name it: "Supabase account"

### Step 3: Add Twilio Credentials
*(You'll set up Twilio in next section, but add placeholder now)*

1. Click "Add Credential" again
2. Search for "Twilio"
3. You'll fill this in after Twilio setup
4. For now, just click "Cancel"

### Step 4: Import Workflows

**FOR EACH WORKFLOW FILE:**

1. Click "Workflows" in top menu
2. Click "Add workflow" → "Import from File"
3. Upload the JSON files:
   - `n8n-workflow-1-lead-capture.json`
   - `n8n-workflow-2-missed-call.json`
   - `n8n-workflow-3-appointment-booking.json`
   - `n8n-workflow-4-daily-report.json`

4. For each workflow:
   - Open it after import
   - Click on each node with a ⚠️ warning
   - Select your "Supabase account" credential
   - Click "Save" (top right)

---

## TWILIO SETUP

### Step 1: Create Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up (get $15 free credit)
3. Verify your email and phone

### Step 2: Buy Phone Number
1. In Twilio Console, click "Phone Numbers" → "Buy a number"
2. Select your country
3. Check "Voice" and "SMS" capabilities
4. Find a local number ($1/month)
5. Click "Buy"

### Step 3: Get API Credentials
1. Click "Account" → "API keys & tokens"
2. **SAVE THESE:**
   - Account SID
   - Auth Token
3. Also note your phone number (format: +1XXXXXXXXXX)

### Step 4: Configure Webhooks
1. Go to Phone Numbers → Manage → Active Numbers
2. Click your phone number
3. Scroll to "Voice & Fax"
   - When a call comes in: Select "Webhook"
   - URL: `YOUR_N8N_WEBHOOK_URL/missed-call`
   - HTTP POST
4. Scroll to "Messaging"
   - When a message comes in: Select "Webhook"
   - URL: `YOUR_N8N_WEBHOOK_URL/lead-capture`
   - HTTP POST
5. Click "Save"

**To get your n8n webhook URLs:**
1. Open n8n workflow
2. Click the "Webhook" node
3. Click "Test step"
4. Copy the "Production URL"

### Step 5: Add Twilio to N8N
1. Go back to n8n
2. Credentials → Add Credential → Twilio
3. Fill in:
   - Account SID
   - Auth Token
4. Save as "Twilio account"
5. Go update all workflows that have Twilio nodes

---

## CAL.COM SETUP

### Step 1: Create Account
1. Go to https://cal.com
2. Sign up (FREE forever)
3. Complete profile setup

### Step 2: Create Event Type
1. Click "Event Types"
2. Click "New Event Type"
3. Fill in:
   - **Name**: Service Appointment
   - **Duration**: 60 minutes (or whatever your client needs)
   - **Location**: Phone call or address
4. Set your availability
5. Click "Create"

### Step 3: Set Up Webhook
1. In Event Type settings, click "Advanced"
2. Scroll to "Webhooks"
3. Add webhook:
   - **Subscriber URL**: `YOUR_N8N_WEBHOOK_URL/appointment-booked`
   - **Trigger Events**: Check "Booking Created"
4. Save

### Step 4: Get Booking Link
1. Click on your event type
2. Copy the booking link (looks like: cal.com/yourname/service-appointment)
3. Save this - you'll give it to clients

---

## CLIENT PORTAL DEPLOYMENT

### Option A: Deploy to Vercel (Recommended)

1. **Prepare the Code:**
   - Create new folder: `leadcapture-portal`
   - Copy `client-portal.jsx` into it
   - Rename to `App.jsx`

2. **Create package.json:**
```json
{
  "name": "leadcapture-portal",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.4.0"
  }
}
```

3. **Create vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

4. **Create index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Client Portal - LeadCapture Pro</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

5. **Create src/main.jsx:**
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

6. **Deploy to Vercel:**
   - Push to GitHub
   - Go to https://vercel.com
   - Import project from GitHub
   - Add environment variables:
     - `VITE_SUPABASE_URL`: Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: Your anon key
   - Deploy!

### Option B: Use Retool (Faster, No Code)

1. Go to https://retool.com
2. Sign up (FREE for 5 users)
3. Create new app: "Client Dashboard"
4. Connect to Supabase:
   - Add Resource → PostgreSQL
   - Host: Your Supabase host
   - Database: postgres
   - Username: postgres
   - Password: Your DB password
   - SSL: Enable
5. Drag and drop components:
   - Table for leads
   - Stats cards for metrics
   - Calendar for appointments
6. Share link with clients

---

## LANDING PAGE DEPLOYMENT

### Deploy to Vercel (5 Minutes)

1. Create new folder: `leadcapture-landing`
2. Put `landing-page.html` in it
3. Rename to `index.html`
4. Create `vercel.json`:
```json
{
  "cleanUrls": true
}
```
5. Push to GitHub
6. Import to Vercel
7. Deploy!

**OR use Netlify Drop:**
1. Go to https://app.netlify.com/drop
2. Drag and drop your `landing-page.html`
3. Done! Instant deployment.

---

## TESTING EVERYTHING

### Test 1: Lead Capture
1. Open your n8n "Lead Capture" workflow
2. Click the Webhook node
3. Click "Test step"
4. Copy the test URL
5. Use Postman or curl to send test data:

```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "test-client-123",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "source": "website",
    "message": "Need HVAC repair"
  }'
```

6. Check:
   - ✅ Lead appears in Supabase
   - ✅ You get SMS notification
   - ✅ Response sent to customer

### Test 2: Missed Call
1. Call your Twilio number
2. Let it ring (don't answer)
3. Hang up after 4 rings
4. Check:
   - ✅ Lead created in Supabase
   - ✅ Text sent to caller
   - ✅ Owner notified

### Test 3: Appointment Booking
1. Open your Cal.com booking link
2. Book a test appointment
3. Check:
   - ✅ Appointment in Supabase
   - ✅ Confirmation text sent
   - ✅ Owner notified
   - ✅ Lead marked as "booked"

### Test 4: Client Portal
1. Open your deployed portal URL
2. Check:
   - ✅ Stats display correctly
   - ✅ Leads table shows test data
   - ✅ Appointments visible
   - ✅ Real-time updates work

---

## CLIENT ONBOARDING PROCESS

### When Client Signs:

**DAY 1: Information Gathering**
1. Send onboarding form (Google Form):
   - Company details
   - Phone number
   - Business hours
   - Service types
   - Branding (logo, colors)

**DAY 2-3: System Setup (2-3 hours)**
1. **Create client in Supabase:**
```sql
INSERT INTO clients (
  company_name,
  contact_name,
  phone,
  email,
  industry,
  owner_phone,
  business_phone
) VALUES (
  'ABC HVAC',
  'John Smith',
  '+1234567890',
  'john@abchvac.com',
  'HVAC',
  '+1234567890',
  '+1234567890'
);
```

2. **Buy Twilio number for client**
   - Twilio Console → Buy Number
   - Configure webhooks (same as before)
   - Save number to client record

3. **Create Cal.com calendar**
   - Duplicate your template event
   - Customize for client's services
   - Set their availability
   - Generate booking link

4. **Update client record with URLs:**
```sql
UPDATE clients 
SET 
  twilio_number = '+1XXXXXXXXXX',
  dashboard_url = 'https://portal.leadcapturepro.com/client/ABC',
  booking_url = 'https://cal.com/abc-hvac/service'
WHERE id = 'client-uuid';
```

**DAY 4: Training & Go-Live**
1. 30-minute training call
2. Walk through dashboard
3. Send test lead
4. Go live!

---

## TROUBLESHOOTING

### Leads Not Saving to Supabase
- Check Supabase credentials in n8n
- Verify table name is exactly "leads"
- Check n8n execution log for errors
- Ensure RLS policies allow inserts

### SMS Not Sending
- Verify Twilio credentials
- Check phone number format (+1XXXXXXXXXX)
- Ensure Twilio account has credit
- Check n8n execution log

### Webhook Not Triggering
- Verify webhook URL is correct
- Check it's using HTTPS
- Ensure n8n workflow is activated
- Test with curl/Postman first

### Portal Not Loading Data
- Check browser console for errors
- Verify Supabase credentials in code
- Check network tab for failed requests
- Ensure you have data in Supabase

---

## COST BREAKDOWN

### Per Client Monthly Cost:
- Twilio number: $1
- Twilio SMS (500 msgs): $4
- Twilio calls: ~$2
- **Total: $7-10/month per client**

### Your Infrastructure:
- Supabase: FREE (up to 500MB)
- N8N Cloud: FREE (5K executions)
- Vercel: FREE (hobby plan)
- Cal.com: FREE
- **Total: $0 for first 5 clients**

### When to Upgrade:
- **10+ clients:** N8N ($20/month for more executions)
- **20+ clients:** Supabase Pro ($25/month for more storage)
- **Custom domain:** $12/year

---

## NEXT STEPS

1. ✅ Set up all accounts (1 hour)
2. ✅ Import workflows (15 minutes)
3. ✅ Deploy landing page (15 minutes)
4. ✅ Deploy client portal (30 minutes)
5. ✅ Test everything (30 minutes)
6. 🚀 Start selling!

**Your total setup time: 2-3 hours**

**Ready to onboard Client #1!**

---

## SUPPORT

**Issues?**
- Supabase: https://supabase.com/docs
- N8N: https://docs.n8n.io
- Twilio: https://www.twilio.com/docs

**Need help?**
- Review this guide step-by-step
- Check execution logs in n8n
- Verify all credentials
- Test each component individually

---

**You now have a production-ready automation business. Go land that first client! 🚀**
