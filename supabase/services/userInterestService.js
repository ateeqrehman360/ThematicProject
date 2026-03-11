import { supabase } from "../lib/supabaseClient.js"

/**
 * Add an interest for a user
 * @param {string} userId - UUID of the user
 * @param {string} interest - Interest to add
 */
export async function addInterest(userId, interest) {
  const { data, error } = await supabase
    .from("user_interests")
    .insert([{ user_id: userId, interest }])
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Remove an interest for a user
 * @param {string} userId - UUID of the user
 * @param {string} interest - Interest to remove
 */
export async function removeInterest(userId, interest) {
  const { data, error } = await supabase
    .from("user_interests")
    .delete()
    .match({ user_id: userId, interest })
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Get all interests for a user
 * @param {string} userId - UUID of the user
 */
export async function getInterests(userId) {
  const { data, error } = await supabase
    .from("user_interests")
    .select("interest")
    .eq("user_id", userId)
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}