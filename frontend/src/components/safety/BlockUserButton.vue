<template>
  <button
    @click="showConfirm = true"
    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
  >
    Block User
  </button>

  <Teleport v-if="showConfirm" to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Block User?</h3>
        <p class="text-gray-600 mb-6">Once blocked, this user will not be able to message you or see your profile.</p>
        
        <div class="flex gap-2">
          <button
            @click="confirmBlock"
            :disabled="blocking"
            class="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            <span v-if="blocking">Blocking...</span>
            <span v-else>Block</span>
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
import { ref } from 'vue'
import { useFriendStore } from '@/stores/friendStore'
import { useUserStore } from '@/stores/userStore'

interface Props {
  userId: string
}

const props = defineProps<Props>()

const friendStore = useFriendStore()
const userStore = useUserStore()
const showConfirm = ref(false)
const blocking = ref(false)

const confirmBlock = async () => {
  if (!userStore.profile) return
  blocking.value = true
  try {
    await friendStore.blockUser(userStore.profile.id, props.userId)
    showConfirm.value = false
  } finally {
    blocking.value = false
  }
}
</script>
