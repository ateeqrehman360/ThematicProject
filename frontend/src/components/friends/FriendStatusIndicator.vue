<template>
  <div v-if="status === 'friends'" class="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
    Friends
  </div>

  <div v-else-if="status === 'pending_sent'" class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
    Pending
  </div>

  <div v-else-if="status === 'pending_received'" class="flex gap-2">
    <button @click="acceptFriend" class="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
      Accept
    </button>
    <button @click="rejectFriend" class="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors">
      Reject
    </button>
  </div>

  <button v-else @click="addFriend" class="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
    Add Friend
  </button>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useFriendStore } from '@/stores/friendStore'
import { useUserStore } from '@/stores/userStore'

interface Props {
  userId: string
}

const props = defineProps<Props>()

const friendStore = useFriendStore()
const userStore = useUserStore()

onMounted(async () => {
  if (userStore.profile) {
    await friendStore.checkFriendStatus(userStore.profile.id, props.userId)
  }
})

const status = computed(() => friendStore.status[props.userId] || 'none')

const addFriend = async () => {
  if (userStore.profile) {
    await friendStore.sendRequest(userStore.profile.id, props.userId)
  }
}

const acceptFriend = async () => {
  if (userStore.profile) {
    await friendStore.acceptRequest(userStore.profile.id, props.userId)
  }
}

const rejectFriend = async () => {
  if (userStore.profile) {
    await friendStore.rejectRequest(userStore.profile.id, props.userId)
  }
}
</script>
