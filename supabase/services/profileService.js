// Import our shared Supabase client
import { supabase } from "../lib/supabaseClient.js"

/**
 * Get user profile by ID
 * @param {string} userId- The user ID to fetch
 * @returns {object} Standardised response
 */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")    // Table name
    .select("*")        // Get all columns
    .eq("user_id", userId) // Where user_id = given ID
    .single()           // Only one result

  // Return standard format
  if (error) {
    return {
      success: false,
      data: null,
      error: error.message
    }
  }

  return {
    success: true,
    data,
    error: null
  }
}