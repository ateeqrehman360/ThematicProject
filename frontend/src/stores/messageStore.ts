import { defineStore } from 'pinia'
import { ref } from 'vue'
import { messageService } from '@/services/messageService'
import type { Message, Conversation } from '@/types/message'

export const useMessageStore = defineStore('message', () => {
  const conversations = ref<Conversation[]>([])
  const currentChat = ref<Message[]>([])
  const currentChatUserId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchConversations(userId: string) {
    loading.value = true
    error.value = null
    try {
      conversations.value = await messageService.getConversations(userId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch conversations'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMessages(userId: string, otherUserId: string) {
    loading.value = true
    error.value = null
    try {
      currentChat.value = await messageService.getMessages(userId, otherUserId)
      currentChatUserId.value = otherUserId
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch messages'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function sendMessage(senderId: string, receiverId: string, content: string) {
    error.value = null
    try {
      const now = new Date().toISOString()
      const optimisticMessage: Message = {
        id: Math.random().toString(),
        sender_id: senderId,
        sender_name: 'You',
        sender_avatar: '',
        receiver_id: receiverId,
        content,
        created_at: now,
        isRead: false
      }
      
      currentChat.value.push(optimisticMessage)
      await messageService.sendMessage(senderId, receiverId, content)
    } catch (err: any) {
      error.value = err.message || 'Failed to send message'
      throw err
    }
  }

  function clearCurrentChat() {
    currentChat.value = []
    currentChatUserId.value = null
  }

  return {
    conversations,
    currentChat,
    currentChatUserId,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    clearCurrentChat
  }
})
