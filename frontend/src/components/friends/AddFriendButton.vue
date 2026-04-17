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
    <span v-else-if="status === 'pending_sent'">Request Pending</span>
    <span v-else>Add Friend</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useFriendStore } from '@/stores/friendStore'
import { useUserStore } from '@/stores/userStore'
import { useCurrentUser } from '@/composables/useCurrentUser'

interface Props {
  userId: string
}

const props = defineProps<Props>()

const friendStore = useFriendStore()
const userStore = useUserStore()
const loading = ref(false)

const status = computed(() => friendStore.status[props.userId] || 'none')

// Watch for status changes
watch(status, (newStatus, oldStatus) => {
  console.log(`Status changed for ${props.userId}: ${oldStatus} -> ${newStatus}`)
})

onMounted(async () => {
  console.log('AddFriendButton mounted for userId:', props.userId)
  
  // Ensure user profile is loaded
  let userProfile = userStore.profile
  if (!userProfile) {
    console.log('Profile not loaded in AddFriendButton, loading now...')
    loading.value = true
    try {
      userProfile = await useCurrentUser()
      console.log('Profile loaded in AddFriendButton:', userProfile)
    } catch (err) {
      console.error('Failed to load profile in AddFriendButton:', err)
      loading.value = false
      return
    }
    loading.value = false
  }
  
  if (userProfile) {
    loading.value = true
    try {
      await friendStore.checkFriendStatus(userProfile.id, props.userId)
      console.log('Initial status for', props.userId, ':', friendStore.status[props.userId])
    } finally {
      loading.value = false
    }
  }
})

const handleAddFriend = async () => {
  console.log('handleAddFriend called - userProfile:', !!userStore.profile, 'status:', status.value)
  let userProfile = userStore.profile
  
  if (!userProfile) {
    console.log('Profile not loaded in handleAddFriend, loading now...')
    loading.value = true
    try {
      userProfile = await useCurrentUser()
    } catch (err) {
      console.error('Failed to load profile in handleAddFriend:', err)
      loading.value = false
      return
    }
    loading.value = false
  }
  
  if (!userProfile) {
    console.warn('Cannot add friend: no user profile')
    return
  }
  if (status.value !== 'none') {
    console.warn('Cannot add friend: status is not none, current status:', status.value)
    return
  }
  loading.value = true
  try {
    console.log('Sending friend request to:', props.userId)
    await friendStore.sendRequest(userProfile.id, props.userId)
    console.log('Friend request sent, new status:', friendStore.status[props.userId])
    
    // Verify status was updated
    const verifiedStatus = await friendStore.checkFriendStatus(userProfile.id, props.userId)
    console.log('Verified status:', verifiedStatus)
  } catch (error) {
    console.error('Error sending friend request:', error)
  } finally {
    loading.value = false
  }
}
</script>
