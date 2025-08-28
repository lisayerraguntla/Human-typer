import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

/**
 * Server-side Supabase client for use in API routes and server components
 */
export async function createClient() {
  const cookieStore = await cookies()

  // For server-side, we can use the service role key for admin operations
  // or the anon key for user-level operations
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
