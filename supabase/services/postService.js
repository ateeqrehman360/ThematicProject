import { supabase } from "../lib/supabaseClient.js"

/**
 * Create a new post
 * @param {string} userId - ID of the user creating the post
 * @param {string} content - Text content of the post
 */
export async function createPost(userId, content) {
  const { data, error } = await supabase
    .from("posts") // Table name
    .insert([
      {
        user_id: userId, // user who created post
        content: content // text content
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