import { useFeedStore } from '@/stores/feedStore'
import { useUserStore } from '@/stores/userStore'
import { ref, computed } from 'vue'

export const useFeed = () => {
  const feedStore = useFeedStore()
  const userStore = useUserStore()
  const showCreatePostModal = ref(false)

  const posts = computed(() => feedStore.posts)
  const loading = computed(() => feedStore.loading)
  const error = computed(() => feedStore.error)
  const hasMore = computed(() => feedStore.hasMore)

  const loadFeed = async () => {
    await feedStore.fetchFeed()
  }

  const loadMoreFeed = async () => {
    if (feedStore.hasMore && !feedStore.loading) {
      await feedStore.fetchFeed()
    }
  }

  const handleCreatePost = async (content: string, _imageUrl?: string) => {
    if (!userStore.profile) return
    await feedStore.createPost(userStore.profile.id, { content })
    showCreatePostModal.value = false
  }

  const handleLikePost = async (postId: string) => {
    if (!userStore.profile) return
    const post = feedStore.posts.find(p => p.id === postId)
    if (post?.isLiked) {
      await feedStore.unlikePost(postId, userStore.profile.id)
    } else {
      await feedStore.likePost(postId, userStore.profile.id)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!userStore.profile) return
    await feedStore.deletePost(postId, userStore.profile.id)
  }

  return {
    posts,
    loading,
    error,
    hasMore,
    showCreatePostModal,
    loadFeed,
    loadMoreFeed,
    handleCreatePost,
    handleLikePost,
    handleDeletePost
  }
}
