import { useFeedStore } from '@/stores/feedStore'
import { useUserStore } from '@/stores/userStore'
import { useCurrentUser } from './useCurrentUser'
import { ref, computed } from 'vue'

export const useFeed = () => {
  const feedStore = useFeedStore()
  const userStore = useUserStore()
  const showCreatePostModal = ref(false)
  const profileLoading = ref(false)

  const posts = computed(() => feedStore.posts)
  const loading = computed(() => feedStore.loading)
  const error = computed(() => feedStore.error)
  const hasMore = computed(() => feedStore.hasMore)

  const loadFeed = async () => {
    // Ensure profile is loaded before loading feed
    if (!userStore.profile) {
      console.log('Profile not loaded in loadFeed, loading now...')
      try {
        await useCurrentUser()
      } catch (err) {
        console.error('Failed to load profile in loadFeed:', err)
      }
    }
    await feedStore.fetchFeed()
  }

  const loadMoreFeed = async () => {
    if (feedStore.hasMore && !feedStore.loading) {
      await feedStore.fetchFeed()
    }
  }

  const handleCreatePost = async (content: string, _imageUrl?: string) => {
    console.log('handleCreatePost called - userProfile exists:', !!userStore.profile)
    let profile = userStore.profile
    
    if (!profile) {
      console.log('Profile not loaded, loading now...')
      try {
        profile = await useCurrentUser()
      } catch (err) {
        console.error('Failed to load profile for creating post:', err)
        return
      }
    }
    
    if (!profile) {
      console.warn('Could not load profile for creating post')
      return
    }
    
    await feedStore.createPost(profile.id, { content })
    showCreatePostModal.value = false
  }

  const handleLikePost = async (postId: string) => {
    console.log('handleLikePost called - userProfile exists:', !!userStore.profile)
    let profile = userStore.profile
    
    if (!profile) {
      console.log('Profile not loaded in handleLikePost, loading now...')
      profileLoading.value = true
      try {
        profile = await useCurrentUser()
        console.log('Profile loaded in handleLikePost:', profile)
      } catch (err) {
        console.error('Failed to load profile in handleLikePost:', err)
        return
      } finally {
        profileLoading.value = false
      }
    }
    
    if (!profile) {
      console.warn('No user profile available for liking post after attempting to load')
      return
    }
    
    const post = feedStore.posts.find(p => p.id === postId)
    console.log('Post found:', !!post, 'isLiked:', post?.isLiked)
    if (post?.isLiked) {
      await feedStore.unlikePost(postId, profile.id)
    } else {
      await feedStore.likePost(postId, profile.id)
    }
  }

  const handleDeletePost = async (postId: string) => {
    console.log('handleDeletePost called - userProfile exists:', !!userStore.profile)
    let profile = userStore.profile
    
    if (!profile) {
      console.log('Profile not loaded in handleDeletePost, loading now...')
      try {
        profile = await useCurrentUser()
      } catch (err) {
        console.error('Failed to load profile in handleDeletePost:', err)
        return
      }
    }
    
    if (!profile) {
      console.warn('No user profile available for deleting post')
      return
    }
    
    await feedStore.deletePost(postId, profile.id)
  }

  return {
    posts,
    loading,
    error,
    hasMore,
    showCreatePostModal,
    profileLoading,
    loadFeed,
    loadMoreFeed,
    handleCreatePost,
    handleLikePost,
    handleDeletePost
  }
}
