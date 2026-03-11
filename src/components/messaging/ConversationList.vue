<template>
  <div class="divide-y">
    <button
      v-for="conversation in conversations"
      :key="conversation.userId"
      @click="emit('select', conversation.userId)"
      class="w-full text-left p-4 hover:bg-gray-50 transition-colors"
    >
      <div class="flex items-center gap-3">
        <img :src="conversation.userAvatar" :alt="conversation.userName" class="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-semibold text-gray-900 truncate">{{ conversation.userName }}</h3>
            <span v-if="conversation.unreadCount > 0" class="inline-block w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
              {{ conversation.unreadCount }}
            </span>
          </div>
          <p class="text-sm text-gray-600 truncate">{{ conversation.lastMessage }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ formatTime(conversation.lastMessageTime) }}</p>
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
  (e: 'select', userId: number): void
}

defineProps<Props>()
defineEmits<Emits>()

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000)

  if (diffHours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString()
}
</script>
