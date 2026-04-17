<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
    <router-link :to="`/profile/${post.user_id}`" class="block p-4 border-b border-gray-200 hover:bg-gray-50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold flex-shrink-0">
          {{ getUserInitial(post.user_id) }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-gray-500">{{ formatTime(post.created_at) }}</p>
        </div>
      </div>
    </router-link>

    <div class="p-4">
      <p class="text-gray-900 mb-3 break-words">{{ post.content }}</p>

      <div class="flex gap-4 text-gray-600">
        <button
          @click="handleLike"
          :class="[
            'flex items-center gap-2 hover:text-indigo-600 transition-colors',
            post.isLiked ? 'text-indigo-600' : ''
          ]"
        >
          <svg class="w-5 h-5" :fill="post.isLiked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {{ post.likes }}
        </button>

        <button
          v-if="isOwnPost"
          @click="handleDelete"
          class="flex items-center gap-2 hover:text-red-600 transition-colors ml-auto"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { Post } from '@/types/post'
import CommentThread from './CommentThread.vue'

interface Props {
  post: Post
}

interface Emits {
  (e: 'like', postId: string): void
  (e: 'delete', postId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const userStore = useUserStore()

const isOwnPost = computed(() => userStore.profile?.id === props.post.user_id)

onMounted(() => {
  // Ensure post has required properties
  if (props.post.likes === undefined) {
    console.warn('Post missing likes property:', props.post)
  }
  if (props.post.isLiked === undefined) {
    console.warn('Post missing isLiked property:', props.post)
  }
})

const getUserInitial = (userId: string) => {
  // Use first 2 chars of UUID as a deterministic initial
  return userId.substring(0, 1).toUpperCase()
}

const handleLike = () => {
  console.log('Like button clicked for post:', props.post.id, 'Current state:', { likes: props.post.likes, isLiked: props.post.isLiked })
  emit('like', props.post.id)
}

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this post?')) {
    emit('delete', props.post.id)
  }
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}
</script>
