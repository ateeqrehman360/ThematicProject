import { supabase } from "../lib/supabaseClient.js"

/**
 * Report a user (admin only)
 * @param {string} reporterId - UUID of the user reporting
 * @param {string} reportedUserId - UUID of the user being reported
 * @param {string} reason - Reason for the report
 */
export async function reportUser(reporterId, reportedUserId, reason) {
  const { data, error } = await supabase
    .from("reports")
    .insert([{ reporter_id: reporterId, reported_user_id: reportedUserId, reason }])
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Get all reports (admin only)
 */
export async function getAllReports() {
  const { data, error } = await supabase.from("reports").select("*")
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}