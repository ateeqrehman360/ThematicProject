import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postService } from '@/services/postService'
import type { Post, CreatePostPayload, Comment } from '@/types/post'

export const useFeedStore = defineStore('feed', () => {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref(true)
  const offset = ref(0)

  async function fetchFeed(limit: number = 50) {
    loading.value = true
    error.value = null
    try {
      const newPosts = await postService.getFeed(limit, offset.value)
      if (offset.value === 0) {
        posts.value = newPosts
      } else {
        posts.value.push(...newPosts)
      }
      
      if (newPosts.length < limit) {
        hasMore.value = false
      }
      
      offset.value += limit
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch feed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPost(userId: string, payload: CreatePostPayload) {
    loading.value = true
    error.value = null
    try {
      await postService.createPost(userId, payload)
      offset.value = 0
      hasMore.value = true
      await fetchFeed()
    } catch (err: any) {
      error.value = err.message || 'Failed to create post'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePost(postId: string, userId: string) {
    error.value = null
    try {
      await postService.deletePost(postId, userId)
      posts.value = posts.value.filter(p => p.id !== postId)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete post'
      throw err
    }
  }

  async function likePost(postId: string, userId: string) {
    error.value = null
    try {
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        await postService.likePost(postId, userId)
        post.likes += 1
        post.isLiked = true
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to like post'
      throw err
    }
  }

  async function unlikePost(postId: string, userId: string) {
    error.value = null
    try {
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        await postService.unlikePost(postId, userId)
        post.likes = Math.max(0, post.likes - 1)
        post.isLiked = false
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to unlike post'
      throw err
    }
  }

  async function addComment(postId: string, userId: string, content: string) {
    error.value = null
    try {
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        await postService.addComment(postId, userId, content)
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to add comment'
      throw err
    }
  }

  function resetFeed() {
    posts.value = []
    offset.value = 0
    hasMore.value = true
  }

  return {
    posts,
    loading,
    error,
    hasMore,
    fetchFeed,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    resetFeed
  }
})
