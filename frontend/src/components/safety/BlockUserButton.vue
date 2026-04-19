<template>
  <button
    @click="handleBlockAction"
    :disabled="blocking"
    :class="[
      'px-4 py-2 rounded-lg transition-colors text-sm font-medium',
      isBlocked
        ? 'bg-gray-400 text-white hover:bg-gray-500'
        : 'bg-red-600 text-white hover:bg-red-700'
    ]"
  >
    <span v-if="blocking">{{ isBlocked ? 'Unblocking...' : 'Blocking...' }}</span>
    <span v-else>{{ isBlocked ? 'Unblock User' : 'Block User' }}</span>
  </button>

  <!-- Confirmation Modal -->
  <Teleport v-if="showConfirm" to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ confirmTitle }}</h3>
        <p class="text-gray-600 mb-6">{{ confirmMessage }}</p>
        
        <div class="flex gap-2">
          <button
            @click="confirmAction"
            :disabled="blocking"
            :class="[
              'flex-1 py-2 px-4 text-white rounded-lg disabled:bg-gray-400 transition-colors font-medium',
              isBlocked ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
            ]"
          >
            <span v-if="blocking">{{ isBlocked ? 'Unblocking...' : 'Blocking...' }}</span>
            <span v-else>{{ isBlocked ? 'Unblock' : 'Block' }}</span>
          </button>
          <button
            @click="showConfirm = false"
            class="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFriendStore } from '@/stores/friendStore'
import { useUserStore } from '@/stores/userStore'
import { useCurrentUser } from '@/composables/useCurrentUser'

interface Props {
  userId: string
}

const props = defineProps<Props>()

const friendStore = useFriendStore()
const userStore = useUserStore()
const showConfirm = ref(false)
const blocking = ref(false)

const isBlocked = computed(() => friendStore.status[props.userId] === 'blocked')

const confirmTitle = computed(() => 
  isBlocked.value ? 'Unblock User?' : 'Block User?'
)

const confirmMessage = computed(() => 
  isBlocked.value 
    ? 'This user will be able to message you and see your profile again.' 
    : 'Once blocked, this user will not be able to message you or see your profile.'
)

onMounted(async () => {
  console.log('BlockUserButton mounted for userId:', props.userId)
  
  // Ensure user profile is loaded
  let userProfile = userStore.profile
  if (!userProfile) {
    console.log('Profile not loaded in BlockUserButton, loading now...')
    try {
      userProfile = await useCurrentUser()
      console.log('Profile loaded in BlockUserButton:', userProfile)
    } catch (err) {
      console.error('Failed to load profile in BlockUserButton:', err)
      return
    }
  }
  
  // Check initial block status
  if (userProfile) {
    try {
      await friendStore.checkFriendStatus(userProfile.id, props.userId)
      console.log('Initial status for', props.userId, ':', friendStore.status[props.userId])
    } catch (err) {
      console.error('Failed to check initial status:', err)
    }
  }
})

const handleBlockAction = () => {
  showConfirm.value = true
}

const confirmAction = async () => {
  if (!userStore.profile) return
  
  blocking.value = true
  try {
    if (isBlocked.value) {
      console.log('Unblocking user:', props.userId)
      await friendStore.unblockUser(userStore.profile.id, props.userId)
      console.log('User unblocked successfully')
    } else {
      console.log('Blocking user:', props.userId)
      await friendStore.blockUser(userStore.profile.id, props.userId)
      console.log('User blocked successfully')
    }
    showConfirm.value = false
  } catch (err) {
    console.error('Error updating block status:', err)
  } finally {
    blocking.value = false
  }
}
</script>
