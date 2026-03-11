<template>
  <div class="h-screen flex flex-col md:flex-row bg-white">
    <!-- Conversations List - Mobile hidden, MD visible -->
    <div class="hidden md:flex md:w-80 border-r border-gray-200 flex-col">
      <div class="p-4 border-b">
        <h2 class="text-2xl font-bold text-gray-900">Messages</h2>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div v-if="loading && conversations.length === 0" class="p-4">
          <div class="animate-pulse space-y-2">
            <div v-for="i in 5" :key="i" class="h-16 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div v-else-if="conversations.length === 0" class="p-4 text-center text-gray-500">
          No conversations yet
        </div>

        <ConversationList
          v-else
          :conversations="conversations"
          @select="selectConversation"
        />
      </div>
    </div>

    <!-- Chat Window -->
    <div class="flex-1 flex flex-col md:min-h-screen h-full">
      <div v-if="!selectedConversation" class="flex-1 flex items-center justify-center text-gray-500">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-lg">Select a conversation to start messaging</p>
        </div>
      </div>

      <ChatWindow
        v-else
        :userId="selectedConversation"
        @close="selectedConversation = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessages } from '@/composables/useMessages'
import ConversationList from '@/components/messaging/ConversationList.vue'
import ChatWindow from '@/components/messaging/ChatWindow.vue'

const {
  conversations,
  loading,
  loadConversations
} = useMessages()

const selectedConversation = ref<number | null>(null)

onMounted(async () => {
  await loadConversations()
})

const selectConversation = (userId: number) => {
  selectedConversation.value = userId
}
</script>
