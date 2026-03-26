import { supabase } from './supabaseClient'
import type { Post, Comment, CreatePostPayload } from '@/types/post'

export const postService = {
  async getFeed(limit: number = 50, offset: number = 0): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*, users(user_id, full_name, profile_picture_url)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return data.map(post => ({
      postId: post.post_id,
      authorId: post.user_id,
      authorName: post.users?.full_name || 'Unknown',
      authorAvatar: post.users?.profile_picture_url || '',
      content: post.content,
      imageUrl: post.image_url,
      timestamp: post.created_at,
      likes: post.likes_count || 0,
      commentCount: post.comment_count || 0,
      isLiked: false
    }))
  },

  async createPost(userId: number, payload: CreatePostPayload) {
    const { error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content: payload.content,
        image_url: payload.imageUrl,
        likes_count: 0,
        comment_count: 0
      })

    if (error) throw error
  },

  async deletePost(postId: number, userId: number) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) throw error
  },

  async likePost(postId: number, userId: number) {
    const { error } = await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_id: userId
      })

    if (error) throw error

    await this.updatePostLikeCount(postId)
  },

  async unlikePost(postId: number, userId: number) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) throw error

    await this.updatePostLikeCount(postId)
  },

  async isPostLikedByUser(postId: number, userId: number): Promise<boolean> {
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

  async getComments(postId: number): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*, users(user_id, full_name, profile_picture_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(comment => ({
      commentId: comment.comment_id,
      postId: comment.post_id,
      authorId: comment.user_id,
      authorName: comment.users?.full_name || 'Unknown',
      authorAvatar: comment.users?.profile_picture_url || '',
      content: comment.content,
      timestamp: comment.created_at
    }))
  },

  async addComment(postId: number, userId: number, content: string) {
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content
      })

    if (error) throw error

    await this.updatePostCommentCount(postId)
  },

  async deleteComment(commentId: number, userId: number) {
    const { data: comment, error: selectError } = await supabase
      .from('comments')
      .select('post_id')
      .eq('comment_id', commentId)
      .single()

    if (selectError) throw selectError

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId)

    if (error) throw error

    await this.updatePostCommentCount(comment.post_id)
  },

  async updatePostLikeCount(postId: number) {
    const { count, error: countError } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)

    if (countError) throw countError

    await supabase
      .from('posts')
      .update({ likes_count: count })
      .eq('post_id', postId)
  },

  async updatePostCommentCount(postId: number) {
    const { count, error: countError } = await supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)

    if (countError) throw countError

    await supabase
      .from('posts')
      .update({ comment_count: count })
      .eq('post_id', postId)
  }
}
