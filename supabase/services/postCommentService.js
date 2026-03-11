import { supabase } from "../lib/supabaseClient.js"

/**
 * Add a comment to a post
 * @param {string} userId - UUID of the user commenting
 * @param {string} postId - UUID of the post
 * @param {string} content - Text content of the comment
 */
export async function addComment(userId, postId, content) {
  const { data, error } = await supabase
    .from("post_comments")
    .insert([{ user_id: userId, post_id: postId, content }])
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Get all comments for a post
 * @param {string} postId - UUID of the post
 */
export async function getComments(postId) {
  const { data, error } = await supabase
    .from("post_comments")
    .select("*")
    .eq("post_id", postId)
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}