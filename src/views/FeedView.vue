<template>
  <div class="max-w-3xl mx-auto py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Feed</h1>
      <button
        @click="showCreatePostModal = true"
        class="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center text-2xl"
        aria-label="Create new post"
      >
        +
      </button>
    </div>

    <div v-if="loading && posts.length === 0" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-6 shadow-md animate-pulse">
        <div class="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div class="h-24 bg-gray-300 rounded mb-4"></div>
      </div>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h-6m0 0H6" />
      </svg>
      <p class="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
    </div>

    <div v-else class="space-y-6">
      <PostCard
        v-for="post in posts"
        :key="post.postId"
        :post="post"
        @like="handleLikePost"
        @delete="handleDeletePost"
      />

      <div v-if="hasMore && !loading" class="flex justify-center pt-4">
        <button
          @click="loadMoreFeed"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Load More
        </button>
      </div>

      <div v-if="loading" class="text-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>

    <CreatePostModal
      v-if="showCreatePostModal"
      @close="showCreatePostModal = false"
      @create="handleCreatePost"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFeed } from '@/composables/useFeed'
import PostCard from '@/components/feed/PostCard.vue'
import CreatePostModal from '@/components/feed/CreatePostModal.vue'

const { posts, loading, hasMore, loadFeed, loadMoreFeed, handleCreatePost: handleCreate, handleLikePost, handleDeletePost } = useFeed()
const showCreatePostModal = ref(false)

onMounted(async () => {
  await loadFeed()
})

const handleCreatePost = async (content: string, imageUrl?: string) => {
  await handleCreate(content, imageUrl)
  showCreatePostModal.value = false
}
</script>
