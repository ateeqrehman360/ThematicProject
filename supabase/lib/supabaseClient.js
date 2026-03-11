// Set Supabase project URL and anon key from environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Now we can import 'supabase' in all service files to talk to our database
import { createClient } from "@supabase/supabase-js"