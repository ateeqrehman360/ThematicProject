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

  const handleCreatePost = async (content: string, imageUrl?: string) => {
    if (!userStore.profile) return
    await feedStore.createPost(userStore.profile.userId, { content, imageUrl })
    showCreatePostModal.value = false
  }

  const handleLikePost = async (postId: number) => {
    if (!userStore.profile) return
    const post = feedStore.posts.find(p => p.postId === postId)
    if (post?.isLiked) {
      await feedStore.unlikePost(postId, userStore.profile.userId)
    } else {
      await feedStore.likePost(postId, userStore.profile.userId)
    }
  }

  const handleDeletePost = async (postId: number) => {
    if (!userStore.profile) return
    await feedStore.deletePost(postId, userStore.profile.userId)
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
