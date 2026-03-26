import { supabase } from "../lib/supabaseClient.js"

/**
 * Like a post
 * @param {string} userId - UUID of the user liking the post
 * @param {string} postId - UUID of the post being liked
 */
export async function likePost(userId, postId) {
  const { data, error } = await supabase
    .from("post_likes")
    .insert([{ user_id: userId, post_id: postId }])
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}

/**
 * Unlike a post
 * @param {string} userId - UUID of the user removing the like
 * @param {string} postId - UUID of the post being unliked
 */
export async function unlikePost(userId, postId) {
  const { data, error } = await supabase
    .from("post_likes")
    .delete()
    .match({ user_id: userId, post_id: postId })
  if (error) return { success: false, data: null, error: error.message }
  return { success: true, data, error: null }
}