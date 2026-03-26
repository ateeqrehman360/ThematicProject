import { supabase } from "../lib/supabaseClient.js"

/**
 * Send a friend request
 * @param {string} senderId - UUID of the user sending the request
 * @param {string} receiverId - UUID of the user receiving the request
 */
export async function sendFriendRequest(senderId, receiverId) {
  const { data, error } = await supabase
    .from("friend_requests")
    .insert([{ sender_id: senderId, receiver_id: receiverId, status: "pending" }])
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Accept a friend request
 * @param {string} requestId - UUID of the friend request to accept
 */
export async function acceptFriendRequest(requestId) {
  const { data, error } = await supabase
    .from("friend_requests")
    .update({ status: "accepted" })
    .eq("id", requestId)
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Reject a friend request
 * @param {string} requestId - UUID of the friend request to reject
 */
export async function rejectFriendRequest(requestId) {
  const { data, error } = await supabase
    .from("friend_requests")
    .update({ status: "rejected" })
    .eq("id", requestId)
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Get all pending requests for a user
 * @param {string} userId - UUID of the user
 */
export async function getPendingRequests(userId) {
  const { data, error } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("receiver_id", userId)
    .eq("status", "pending")
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}