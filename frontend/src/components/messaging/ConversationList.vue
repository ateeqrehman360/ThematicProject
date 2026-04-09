<template>
  <div class="divide-y">
    <button
      v-for="conversation in conversations"
      :key="conversation.user_id"
      @click="emit('select', conversation.user_id)"
      class="w-full text-left p-4 hover:bg-gray-50 transition-colors"
    >
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold flex-shrink-0">
          {{ conversation.username.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 truncate">{{ conversation.username }}</h3>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Conversation } from '@/types/message'

interface Props {
  conversations: Conversation[]
}

interface Emits {
  (e: 'select', userId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000)

  if (diffHours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString()
}
</script>
