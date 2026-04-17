import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postService } from '@/services/postService'
import { useUserStore } from '@/stores/userStore'
import type { Post, CreatePostPayload, Comment } from '@/types/post'

export const useFeedStore = defineStore('feed', () => {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref(true)
  const offset = ref(0)

  async function fetchFeed(limit: number = 50) {
    const userStore = useUserStore()
    const userId = userStore.profile?.id
    
    loading.value = true
    error.value = null
    try {
      const newPosts = await postService.getFeed(limit, offset.value, userId)
      
      // Normalize posts to ensure they have required properties
      const normalizedPosts = newPosts.map(post => ({
        ...post,
        likes: typeof post.likes === 'number' ? post.likes : 0,
        isLiked: typeof post.isLiked === 'boolean' ? post.isLiked : false
      }))
      
      if (offset.value === 0) {
        posts.value = normalizedPosts
      } else {
        posts.value.push(...normalizedPosts)
      }
      
      if (newPosts.length < limit) {
        hasMore.value = false
      }
      
      offset.value += limit
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch feed'
      console.error('Feed fetch error:', err)
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
      console.log('Liking post:', postId, 'by user:', userId)
      // Update optimistically
      const postIndex = posts.value.findIndex(p => p.id === postId)
      if (postIndex !== -1) {
        const post = posts.value[postIndex]
        // Ensure properties exist
        if (typeof post.likes !== 'number') post.likes = 0
        if (typeof post.isLiked !== 'boolean') post.isLiked = false
        
        post.likes += 1
        post.isLiked = true
        // Force reactivity by reassigning the array
        posts.value = [...posts.value]
        console.log('Post liked optimistically, new state:', post)
      }
      await postService.likePost(postId, userId)
      console.log('Backend confirmed like for post:', postId)
    } catch (err: any) {
      console.error('Like error:', err)
      // Revert on error
      const postIndex = posts.value.findIndex(p => p.id === postId)
      if (postIndex !== -1) {
        posts.value[postIndex].likes = Math.max(0, (posts.value[postIndex].likes || 0) - 1)
        posts.value[postIndex].isLiked = false
        posts.value = [...posts.value]
      }
      error.value = err.message || 'Failed to like post'
      throw err
    }
  }

  async function unlikePost(postId: string, userId: string) {
    error.value = null
    try {
      console.log('Unliking post:', postId, 'by user:', userId)
      // Update optimistically
      const postIndex = posts.value.findIndex(p => p.id === postId)
      if (postIndex !== -1) {
        const post = posts.value[postIndex]
        // Ensure properties exist
        if (typeof post.likes !== 'number') post.likes = 0
        if (typeof post.isLiked !== 'boolean') post.isLiked = false
        
        post.likes = Math.max(0, post.likes - 1)
        post.isLiked = false
        // Force reactivity by reassigning the array
        posts.value = [...posts.value]
        console.log('Post unliked optimistically, new state:', post)
      }
      await postService.unlikePost(postId, userId)
      console.log('Backend confirmed unlike for post:', postId)
    } catch (err: any) {
      console.error('Unlike error:', err)
      // Revert on error
      const postIndex = posts.value.findIndex(p => p.id === postId)
      if (postIndex !== -1) {
        posts.value[postIndex].likes = (posts.value[postIndex].likes || 0) + 1
        posts.value[postIndex].isLiked = true
        posts.value = [...posts.value]
      }
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
