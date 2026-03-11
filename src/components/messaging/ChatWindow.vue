<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between p-4 border-b bg-white">
      <div class="flex items-center gap-3">
        <button @click="emit('close')" class="md:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="text-lg font-semibold text-gray-900">Chat</h2>
      </div>
      <router-link :to="`/profile/${userId}`" class="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
        View Profile
      </router-link>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="currentChat.length === 0" class="flex items-center justify-center h-full text-gray-500">
        <div class="text-center">
          <p class="text-lg">Start a conversation</p>
          <p class="text-sm text-gray-400">Send your first message to connect</p>
        </div>
      </div>

      <MessageBubble
        v-for="message in currentChat"
        :key="message.messageId"
        :message="message"
        :isOwn="message.senderId === userStore.profile?.userId"
      />
    </div>

    <div class="border-t bg-white p-4">
      <div v-if="isBlocked" class="text-center text-gray-500 mb-2">
        <p class="p-2 bg-red-50 text-red-600 rounded text-sm">You have blocked this user</p>
      </div>

      <div v-else-if="!canMessage" class="text-center text-gray-500 mb-2">
        <p class="p-2 bg-yellow-50 text-yellow-600 rounded text-sm">Message limit reached ({{ messageLimit.current }}/{{ messageLimit.limit }})</p>
      </div>

      <div class="flex gap-2">
        <input
          v-model="messageInput"
          type="text"
          :disabled="isBlocked || !canMessage"
          @keyup.enter="sendMessage(userId)"
          placeholder="Type a message..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
        />
        <button
          @click="sendMessage(userId)"
          :disabled="isBlocked || !canMessage || !messageInput.trim()"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useMessages } from '@/composables/useMessages'
import { useUserStore } from '@/stores/userStore'
import { useFriendStore } from '@/stores/friendStore'
import MessageBubble from './MessageBubble.vue'

interface Props {
  userId: number
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
defineEmits<Emits>()

const userStore = useUserStore()
const friendStore = useFriendStore()
const { currentChat, loading, messageInput, messageLimit, loadChat, sendMessage: send, canMessageUser } = useMessages()

const isBlocked = ref(false)
const canMessage = ref(true)

onMounted(async () => {
  await loadChat(props.userId)
  const areFriends = friendStore.status[props.userId] === 'friends'
  canMessage.value = await canMessageUser(props.userId)
})

const sendMessage = async (recipientId: number) => {
  await send(recipientId)
}
</script>
