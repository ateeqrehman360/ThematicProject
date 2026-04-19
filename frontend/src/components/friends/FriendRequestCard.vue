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
        :disabled="acceptLoading || rejectLoading"
        :class="[
          'px-4 py-2 rounded-lg transition-colors text-sm font-medium',
          acceptLoading || rejectLoading ? 'bg-gray-400 text-white cursor-wait' : 'bg-indigo-600 text-white hover:bg-indigo-700'
        ]"
      >
        <span v-if="acceptLoading" class="inline-block animate-spin mr-1">⟳</span>
        <span v-else>Accept</span>
      </button>
      <button
        @click="reject"
        :disabled="acceptLoading || rejectLoading"
        :class="[
          'px-4 py-2 rounded-lg transition-colors text-sm font-medium',
          acceptLoading || rejectLoading ? 'bg-gray-200 text-gray-500 cursor-wait' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
        ]"
      >
        <span v-if="rejectLoading" class="inline-block animate-spin mr-1">⟳</span>
        <span v-else>Reject</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

const acceptLoading = ref(false)
const rejectLoading = ref(false)

const accept = async () => {
  console.log('FriendRequestCard accept clicked for:', props.request.id)
  if (acceptLoading.value) return // Prevent double-clicks
  acceptLoading.value = true
  try {
    await emit('accept', props.request.id)
    // Note: Parent (FriendsView) handles the actual accept logic
    // Loading state will stay until card is removed from the list
    console.log('FriendRequestCard accept emit completed')
  } catch (err) {
    console.error('Error in FriendRequestCard accept:', err)
    // Clear loading on error so user can retry
    acceptLoading.value = false
  }
}

const reject = async () => {
  console.log('FriendRequestCard reject clicked for:', props.request.id)
  if (rejectLoading.value) return // Prevent double-clicks
  rejectLoading.value = true
  try {
    await emit('reject', props.request.id)
    // Note: Parent (FriendsView) handles the actual reject logic
    // Loading state will stay until card is removed from the list
    console.log('FriendRequestCard reject emit completed')
  } catch (err) {
    console.error('Error in FriendRequestCard reject:', err)
    // Clear loading on error so user can retry
    rejectLoading.value = false
  }
}
</script>
