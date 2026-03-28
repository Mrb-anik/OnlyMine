# 📘 LEAD MATRIX: THE MASTER BLUEPRINT
**Version:** 1.0 (LAUNCH READY)  
**Domain:** leadmatrixllc.us | **Platform:** Next.js 16 + Supabase + n8n + Resend

---

## 🏁 INTRODUCTION
Welcome to your business. **Lead Matrix** is not just a dashboard; it is a high-speed "Capture-to-Booking" engine designed specifically for the Home Service industry (HVAC, Plumbing, Electrical).

**Your Core Value Proposition:** "We help contractors respond to leads in under 60 seconds and automate the 'chase' for 7 days until they book."

---

## 🛠 SECTION 1: THE PRODUCT (What You Sell)

You offer 3 Tiers of service to your clients. Everything is automated by the code I built for you.

### 🥉 Tier 1: Speed-to-Lead (Standard)
*   **Feature:** 60-second automated email response.
*   **Result:** Contractor never misses a lead again.

### 🥈 Tier 2: Complete Tech (Pro)
*   **Feature:** Automated Booking (Cal.com) + Multi-day Follow-up.
*   **Result:** High conversion rates. Leads are automatically nudged on Day 1, 3, and 7.

### 🥇 Tier 3: Growth Engine (Premium)
*   **Feature:** Full CRM Dashboard + Real-time Lead tracking.
*   **Result:** Complete visibility into ROI.

---

## 📊 SECTION 2: THE TECH STACK (How it Works)

1.  **Frontend (The Face):** Built using **Next.js 16 (App Router)**. It’s ultra-fast, SEO-optimized, and features a premium modern design.
2.  **Database (The Brain):** **Supabase**. It stores all your client data, leads, and appointments. It uses **Row Level Security (RLS)** so Client A can never see Client B’s data.
3.  **Automation (The Engine):** **n8n**. When a lead fills a form, n8n grabs it, saves it to Supabase, and talks to **Resend** to fire off the emails.
4.  **Booking:** **Cal.com**. We use their API to generate unique booking links and track when a job is scheduled.

---

## 🔐 SECTION 3: ADMIN & OPERATIONAL GUIDE

### 1. How to Onboard a New Client (10 Minutes)
*   **Step 1:** Go to your **Supabase Dashboard** → **Authentication** → **Invite User**. Enter the contractor's email.
*   **Step 2:** Go to **Table Editor → `clients`**. Insert a row for them.
*   **Step 3:** Ask the client for their **Cal.com booking link**. Paste it into their row in the `clients` table.
*   **Step 4:** They are live! Give them their login link: `leadmatrixllc.us/login`.

### 2. How to Monitor Performance
Go to your [**Client Portal**](https://leadmatrixllc.us/portal). As an admin, you can see all incoming audit leads and track how many contractors are signing up.

### 3. Running the "Chase" (Follow-ups)
The system is set to automatically follow up with leads who haven't booked yet. This runs via a **Vercel Cron Job** every day at 9:00 AM UTC. It checks the `email_sequences` table to ensure no one is emailed twice.

---

## 🚀 SECTION 4: GO-TO-MARKET STRATEGY

1.  **Step 1: The "Audit" Hook.** Drive traffic to your homepage. Use the **ROI Calculator** to show them how much money they are losing.
2.  **Step 2: The 60-Second Demo.** When they fill out the "Free Audit" form, they will experience your speed-to-lead automation themselves. This is your best sales tool.
3.  **Step 3: Close the Deal.** Use the data from the audit call to sell them on a monthly retainer ($1,000 - $3,000/mo).

---

## 🚑 SECTION 5: TROUBLESHOOTING

*   **Emails not sending?** Check your **Resend API Key** in Vercel and ensure your domain `leadmatrixllc.us` is verified in Resend.
*   **Portal showing no data?** Ensure you have run the [**`supabase-schema.sql`**](file:///c:/Users/Anik/OnlyMine/supabase-schema.sql) in your Supabase SQL editor.
*   **Automation failing?** Open your n8n instance and check the "Executions" tab to see where the error is.

---

## 📈 SUMMARY OF YOUR ASSETS
- [x] **Marketing Site:** Live at `leadmatrixllc.us`
- [x] **Client Dashboard:** `leadmatrixllc.us/portal`
- [x] **DB Schema:** Production-ready with 6 tables + RLS.
- [x] **Follow-up Engine:** Automated Day 1, 3, 7 emails.
- [x] **API:** Secured with `N8N_WEBHOOK_SECRET` and `CRON_SECRET`.

**This is your empire.** Go forth and automate! 🏆🏁✨
