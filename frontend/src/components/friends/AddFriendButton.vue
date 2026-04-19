<template>
  <div class="flex gap-2">
    <button
      @click="handleAction"
      :disabled="loading"
      :class="[
        'px-4 py-2 rounded-lg font-semibold transition-colors',
        status === 'friends'
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : status === 'pending_sent'
          ? 'bg-yellow-100 text-yellow-700 cursor-default'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      ]"
    >
      <span v-if="loading">Loading...</span>
      <span v-else-if="status === 'friends'">Remove Friend</span>
      <span v-else-if="status === 'pending_sent'">Request Pending</span>
      <span v-else>Add Friend</span>
    </button>

    <!-- Confirmation Modal for Removing Friend -->
    <Teleport v-if="showRemoveConfirm" to="body">
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
          <h3 class="text-lg font-bold text-gray-900 mb-2">Remove Friend?</h3>
          <p class="text-gray-600 mb-6">This will remove the friendship between you and this user.</p>
          
          <div class="flex gap-2">
            <button
              @click="confirmRemove"
              :disabled="loading"
              class="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              <span v-if="loading">Removing...</span>
              <span v-else>Remove</span>
            </button>
            <button
              @click="showRemoveConfirm = false"
              class="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
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
const showRemoveConfirm = ref(false)

const status = computed(() => friendStore.status[props.userId] || 'none')

// Watch for status changes
watch(status, (newStatus, oldStatus) => {
  console.log(`Status changed for ${props.userId}: ${oldStatus} -> ${newStatus}`)
})

// Watch for userId changes to reload friend status
watch(() => props.userId, async () => {
  console.log('userId changed, refreshing friend status for:', props.userId)
  let userProfile = userStore.profile
  if (userProfile) {
    loading.value = true
    try {
      await friendStore.checkFriendStatus(userProfile.id, props.userId)
      console.log('Status refreshed for', props.userId, ':', friendStore.status[props.userId])
    } finally {
      loading.value = false
    }
  }
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

const handleAction = async () => {
  console.log('handleAction called - userProfile:', !!userStore.profile, 'status:', status.value)
  let userProfile = userStore.profile
  
  if (!userProfile) {
    console.log('Profile not loaded in handleAction, loading now...')
    loading.value = true
    try {
      userProfile = await useCurrentUser()
    } catch (err) {
      console.error('Failed to load profile in handleAction:', err)
      loading.value = false
      return
    }
    loading.value = false
  }
  
  if (!userProfile) {
    console.warn('Cannot perform action: no user profile')
    return
  }

  // If friends, show confirm dialog
  if (status.value === 'friends') {
    showRemoveConfirm.value = true
    return
  }

  // If none or other status, add friend
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
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log('Final status after request:', friendStore.status[props.userId])
  } catch (err) {
    console.error('Error sending friend request:', err)
  } finally {
    loading.value = false
  }
}

const confirmRemove = async () => {
  let userProfile = userStore.profile
  
  if (!userProfile) {
    console.warn('Cannot remove friend: no user profile')
    showRemoveConfirm.value = false
    return
  }

  loading.value = true
  try {
    console.log('Removing friend:', props.userId)
    await friendStore.removeFriend(userProfile.id, props.userId)
    console.log('Friend removed, new status:', friendStore.status[props.userId])
    showRemoveConfirm.value = false
  } catch (err) {
    console.error('Error removing friend:', err)
  } finally {
    loading.value = false
  }
}
</script>
