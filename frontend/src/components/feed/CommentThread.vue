<template>
  <div class="space-y-4">
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 2" :key="i" class="h-12 bg-gray-300 rounded animate-pulse"></div>
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-4 text-gray-500">
      No comments yet. Be the first!
    </div>

    <div v-else class="space-y-3">
      <div v-for="comment in comments" :key="comment.commentId" class="flex gap-2">
        <img :src="comment.authorAvatar" :alt="comment.authorName" class="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        <div class="flex-1 bg-gray-100 rounded-lg p-2">
          <p class="font-semibold text-sm text-gray-900">{{ comment.authorName }}</p>
          <p class="text-sm text-gray-700">{{ comment.content }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ formatTime(comment.timestamp) }}</p>
        </div>
      </div>
    </div>

    <div class="flex gap-2 mt-4 pt-4 border-t">
      <input
        v-model="newComment"
        type="text"
        placeholder="Write a comment..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        @keyup.enter="handleAddComment"
      />
      <button
        @click="handleAddComment"
        :disabled="!newComment.trim() || addingComment"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors text-sm"
      >
        Post
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { postService } from '@/services/postService'
import { useUserStore } from '@/stores/userStore'
import type { Comment } from '@/types/post'

interface Props {
  postId: number
}

defineProps<Props>()

const userStore = useUserStore()
const comments = ref<Comment[]>([])
const newComment = ref('')
const loading = ref(false)
const addingComment = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    comments.value = await postService.getComments(props.postId)
  } catch (err) {
    console.error('Failed to load comments:', err)
  } finally {
    loading.value = false
  }
})

const handleAddComment = async () => {
  if (!newComment.value.trim() || !userStore.profile) return

  addingComment.value = true
  try {
    await postService.addComment(props.postId, userStore.profile.userId, newComment.value)
    comments.value = await postService.getComments(props.postId)
    newComment.value = ''
  } catch (err) {
    console.error('Failed to add comment:', err)
  } finally {
    addingComment.value = false
  }
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 60) return `${diffMins}m ago`
  return new Date(timestamp).toLocaleDateString()
}
</script>
