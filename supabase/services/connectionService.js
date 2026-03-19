import { supabase } from "../lib/supabaseClient.js"

/**
 * Send a friend request
 * @param {string} senderId - UUID of the user sending the request
 * @param {string} receiverId - UUID of the user receiving the request
 */
export async function sendFriendRequest(senderId, receiverId) {
  const { data: blockExists } = await supabase
    .from("blocks")
    .select("blocker_id")
    .or(`and(blocker_id.eq.${senderId},blocked_id.eq.${receiverId}),and(blocker_id.eq.${receiverId},blocked_id.eq.${senderId})`)
    .limit(1)
  if (blockExists && blockExists.length > 0)
    return { success: false, data: null, error: "Cannot send request: a block exists between these users." }
  const { data, error } = await supabase
    .from("friend_requests")
    .insert([{ sender_id: senderId, receiver_id: receiverId, status: "pending" }])
  if (error) {
    if (error.code === "23505") return { success: false, data: null, error: "Friend request already sent." }
    return { success: false, data: null, error: error.message }
  }
  return { success: true, data, error: null }
}

/**
 * Accept a friend request and create a friendship
 * @param {string} requestId - UUID of the friend request
 * @param {string} senderId - UUID of the original sender
 * @param {string} receiverId - UUID of the user accepting
 */
export async function acceptFriendRequest(requestId, senderId, receiverId) {
  const { error: updateError } = await supabase
    .from("friend_requests")
    .update({ status: "accepted" })
    .eq("id", requestId)
  if (updateError) return { success: false, data: null, error: updateError.message }
  const [user_a, user_b] = [senderId, receiverId].sort()
  const { data, error } = await supabase
    .from("friendships")
    .insert([{ user_a, user_b }])
  if (error) {
    if (error.code === "23505") return { success: true, data: null, error: null }
    return { success: false, data: null, error: error.message }
  }
  return { success: true, data, error: null }
}

/**
 * Reject a friend request
 * @param {string} requestId - UUID of the friend request
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
 * Remove a friendship
 * @param {string} userAId - UUID of one user
 * @param {string} userBId - UUID of the other user
 */
export async function removeFriendship(userAId, userBId) {
  const [user_a, user_b] = [userAId, userBId].sort()
  const { data, error } = await supabase
    .from("friendships")
    .delete()
    .match({ user_a, user_b })
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Block a user and remove any existing friendship or pending requests
 * @param {string} blockerId - UUID of the user performing the block
 * @param {string} blockedId - UUID of the user being blocked
 */
export async function blockAndUnfriend(blockerId, blockedId) {
  const [user_a, user_b] = [blockerId, blockedId].sort()
  await supabase.from("friendships").delete().match({ user_a, user_b })
  await supabase
    .from("friend_requests")
    .delete()
    .or(`and(sender_id.eq.${blockerId},receiver_id.eq.${blockedId}),and(sender_id.eq.${blockedId},receiver_id.eq.${blockerId})`)
  const { data, error } = await supabase
    .from("blocks")
    .insert([{ blocker_id: blockerId, blocked_id: blockedId }])
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Get all confirmed friends for a user
 * @param {string} userId - UUID of the user
 */
export async function getFriends(userId) {
  const { data, error } = await supabase
    .from("friendships")
    .select("user_a, user_b, created_at")
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}
