import { supabase } from "../lib/supabaseClient.js"

/**
 * Send a direct message
 * @param {number} senderId - User sending the message
 * @param {number} receiverId - User receiving the message
 * @param {string} message - Message text
 */
export async function sendMessage(senderId, receiverId, message) {
  const { data, error } = await supabase
    .from("messages") // Messages table
    .insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        content: message
      }
    ])

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