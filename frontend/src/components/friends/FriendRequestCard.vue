<template>
  <div class="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow">
    <router-link :to="`/profile/${request.id}`" class="flex items-center gap-3 flex-1 hover:opacity-75">
      <div class="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
        {{ request.username.charAt(0).toUpperCase() }}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 truncate">{{ request.username }}</h3>
        <p class="text-sm text-gray-500 truncate">{{ request.city }}{{ request.area ? `, ${request.area}` : '' }}</p>
      </div>
    </router-link>

    <div class="flex gap-2 flex-shrink-0">
      <button
        @click="accept"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
      >
        Accept
      </button>
      <button
        @click="reject"
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
      >
        Reject
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FriendRequest } from '@/types/friendship'

interface Props {
  request: FriendRequest
}

interface Emits {
  (e: 'accept', userId: string): void
  (e: 'reject', userId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const accept = () => emit('accept', props.request.id)
const reject = () => emit('reject', props.request.id)
</script>
