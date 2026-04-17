import { supabase } from './supabaseClient'
import type { Post, Comment, CreatePostPayload } from '@/types/post'

export const postService = {
  async getFeed(limit: number = 50, offset: number = 0, userId?: string): Promise<Post[]> {
    console.log('Fetching feed with userId:', userId, 'limit:', limit, 'offset:', offset)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    if (!data || data.length === 0) {
      console.log('No posts returned from database')
      return []
    }

    // Get like counts
    const postIds = data.map(p => p.id)
    const { data: likeCounts } = await supabase
      .from('post_likes')
      .select('post_id, user_id')
      .in('post_id', postIds)

    const likesMap: Record<string, number> = {}
    const userLikesMap: Set<string> = new Set()

    likeCounts?.forEach((like: any) => {
      likesMap[like.post_id] = (likesMap[like.post_id] || 0) + 1
      if (userId && like.user_id === userId) {
        userLikesMap.add(like.post_id)
      }
    })

    const result = data.map(post => {
      const postObj: Post = {
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        created_at: post.created_at,
        likes: likesMap[post.id] || 0,
        isLiked: userLikesMap.has(post.id)
      }
      console.log('Post loaded:', { id: post.id, likes: postObj.likes, isLiked: postObj.isLiked })
      return postObj
    })
    
    console.log('Feed loaded with', result.length, 'posts')
    return result
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
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(comment => ({
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
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
