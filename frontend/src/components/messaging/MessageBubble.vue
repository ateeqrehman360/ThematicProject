<template>
  <div :class="['flex', isOwn ? 'justify-end' : 'justify-start']">
    <div
      :class="[
        'max-w-xs px-4 py-2 rounded-lg',
        isOwn
          ? 'bg-indigo-600 text-white rounded-br-none'
          : 'bg-gray-200 text-gray-900 rounded-bl-none'
      ]"
    >
      <p class="text-sm break-words">{{ message.content }}</p>
      <p :class="['text-xs mt-1', isOwn ? 'text-indigo-200' : 'text-gray-600']">
        {{ formatTime(message.timestamp || message.created_at) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'

interface Props {
  message: Message
  isOwn: boolean
}

defineProps<Props>()

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
