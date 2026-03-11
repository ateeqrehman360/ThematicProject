import { supabase } from "../lib/supabaseClient.js"

/**
 * Block a user
 * @param {string} blockerId - UUID of the user performing the block
 * @param {string} blockedId - UUID of the user being blocked
 */
export async function blockUser(blockerId, blockedId) {
  const { data, error } = await supabase
    .from("blocks")
    .insert([{ blocker_id: blockerId, blocked_id: blockedId }])
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Unblock a user
 * @param {string} blockerId - UUID of the user removing the block
 * @param {string} blockedId - UUID of the user being unblocked
 */
export async function unblockUser(blockerId, blockedId) {
  const { data, error } = await supabase
    .from("blocks")
    .delete()
    .match({ blocker_id: blockerId, blocked_id: blockedId })
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Get all blocked users for a user
 * @param {string} userId - UUID of the user
 */
export async function getBlockedUsers(userId) {
  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("blocker_id", userId)
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}