import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Admin client bypasses RLS – ONLY use server-side (API routes, server actions)
export const adminClient = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
)
