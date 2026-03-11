<template>
  <button
    @click="handleAddFriend"
    :disabled="loading"
    :class="[
      'px-4 py-2 rounded-lg font-semibold transition-colors',
      status === 'friends'
        ? 'bg-green-100 text-green-700 hover:bg-green-200'
        : status === 'pending_sent'
        ? 'bg-yellow-100 text-yellow-700 cursor-default'
        : 'bg-indigo-600 text-white hover:bg-indigo-700'
    ]"
  >
    <span v-if="loading">Loading...</span>
    <span v-else-if="status === 'friends'">✓ Friends</span>
    <span v-else-if="status === 'pending_sent'">Pending</span>
    <span v-else>Add Friend</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFriendStore } from '@/stores/friendStore'
import { useUserStore } from '@/stores/userStore'

interface Props {
  userId: number
}

defineProps<Props>()

const friendStore = useFriendStore()
const userStore = useUserStore()
const loading = ref(false)

const status = computed(() => friendStore.status[props.userId] || 'none')

onMounted(async () => {
  if (userStore.profile) {
    loading.value = true
    try {
      await friendStore.checkFriendStatus(userStore.profile.userId, props.userId)
    } finally {
      loading.value = false
    }
  }
})

const handleAddFriend = async () => {
  if (!userStore.profile || status.value !== 'none') return
  loading.value = true
  try {
    await friendStore.sendRequest(userStore.profile.userId, props.userId)
  } finally {
    loading.value = false
  }
}
</script>
