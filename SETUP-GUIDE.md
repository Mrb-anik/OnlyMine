# 🛰️ LEAD MATRIX - Master Setup Guide

**The complete operating system for your automated revenue agency.**

---

## 1. INFRASTRUCTURE SETUP

### Supabase (Database & Auth)
1.  Create a project at [supabase.com](https://supabase.com).
2.  Open **SQL Editor** and run the contents of `supabase-schema.sql`.
3.  **IMPORTANT**: Enable Realtime for `leads`, `appointments`, and `automation_logs` in the Supabase Dashboard (Database -> Replication).
4.  Save your **Project URL** and **Anon Key**.

### N8N (Automation Engine)
1.  Import all 4 workflows from the `.json` files.
2.  Connect your Supabase credentials using the `service_role` key.
3.  Set up your Twilio credentials in n8n.
4.  Activate the workflows.

---

## 2. PORTAL DEPLOYMENT

### A. The Master Agency Admin (`agency-admin-portal.jsx`)
**Goal**: Your command center for monitoring all clients.
1.  Deploy to Vercel/Netlify as a React app.
2.  Add your Supabase URL and Anon Key.
3.  This portal allows you to switch between "Global Portfolio" and individual "Client Pipelines."

### B. The Client Portal (`client-portal.jsx`)
**Goal**: The dashboard you give to your clients.
1.  Deploy a separate instance or route.
2.  Clients see their "Realized Revenue" and "Active Pipeline" in real-time.

### C. The Landing Page (`landing-page.html`)
**Goal**: Your high-converting sales engine.
1.  Deploy to Netlify Drop or Vercel.
2.  Update the contact links to point to your audit form or phone.

---

## 3. CLIENT ONBOARDING WORKFLOW

When you sign a new high-ticket client ($2.5k-$10k/mo):

1.  **Create Client Record**:
    - Add them to the `clients` table in Supabase.
    - Assign them a `user_id` for portal access.
2.  **Logic Provisioning**:
    - Assign them a Twilio number.
    - Set up their Cal.com event.
    - Update their `client_id` in your N8N webhook filters (or create a dedicated instance).
3.  **Command Center Launch**:
    - Give them their unique login to the Client Portal.
    - They now see their live "Revenue Engine" working.

---

## 4. THE MASTER DASHBOARDS (Agency Edge)

As an agency owner, you use the **Master Admin Portal** to:
- **Monitor Global ROAS**: See how much revenue you are managing in total.
- **Detect Bottlenecks**: Proactively fix client issues (e.g., if a client's response time drops).
- **Verify ROI**: Prove your value every month with realized revenue data, not "vanity metrics."

---

*Questions? Check the detailed walkthrough in README.md*
