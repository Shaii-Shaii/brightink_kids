import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase env vars are missing. Copy .env.example to .env.local and fill in your project values.")
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-publishable-key",
)
