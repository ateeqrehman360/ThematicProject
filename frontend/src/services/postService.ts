import { supabase } from './supabaseClient'
import type { Post, Comment, CreatePostPayload } from '@/types/post'

export const postService = {
  async getFeed(limit: number = 50, offset: number = 0): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(id, username)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Get like counts
    const postIds = data.map(p => p.id)
    const { data: likeCounts } = await supabase
      .from('post_likes')
      .select('post_id')
      .in('post_id', postIds)

    const likesMap = likeCounts?.reduce((acc: any, like: any) => {
      acc[like.post_id] = (acc[like.post_id] || 0) + 1
      return acc
    }, {}) || {}

    return data.map(post => ({
      id: post.id,
      user_id: post.user_id,
      author_name: post.profiles?.username || 'Unknown',
      author_avatar: '',
      content: post.content,
      image_url: undefined,
      created_at: post.created_at,
      likes: likesMap[post.id] || 0,
      commentCount: 0,
      isLiked: false
    }))
  },

  async createPost(userId: string, payload: CreatePostPayload) {
    const { error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content: payload.content
      })

    if (error) throw error
  },

  async deletePost(postId: string, userId: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId)

    if (error) throw error
  },

  async likePost(postId: string, userId: string) {
    const { error } = await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_id: userId
      })

    if (error) throw error
  },

  async unlikePost(postId: string, userId: string) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) throw error
  },

  async isPostLikedByUser(postId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      return false
    }
    if (error) throw error

    return !!data
  },

  async getComments(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*, profiles(id, username)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(comment => ({
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      author_name: comment.profiles?.username || 'Unknown',
      author_avatar: '',
      content: comment.content,
      created_at: comment.created_at
    }))
  },

  async addComment(postId: string, userId: string, content: string) {
    const { error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content
      })

    if (error) throw error
  },

  async deleteComment(commentId: string, userId: string) {
    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId)

    if (error) throw error
  }
}
