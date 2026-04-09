import { computed, ref } from 'vue'
import { useMessageStore } from '@/stores/messageStore'
import { useUserStore } from '@/stores/userStore'
import { useFriendStore } from '@/stores/friendStore'
import { messageService } from '@/services/messageService'

export const useMessages = () => {
  const messageStore = useMessageStore()
  const userStore = useUserStore()
  const friendStore = useFriendStore()
  const messageInput = ref('')
  const messageLimit = ref({ limit: 5, current: 0 })

  const conversations = computed(() => messageStore.conversations)
  const currentChat = computed(() => messageStore.currentChat)
  const loading = computed(() => messageStore.loading)
  const error = computed(() => messageStore.error)

  const loadConversations = async () => {
    if (!userStore.profile) return
    await messageStore.fetchConversations(userStore.profile.id)
  }

  const loadChat = async (otherUserId: string) => {
    if (!userStore.profile) return
    await messageStore.fetchMessages(userStore.profile.id, otherUserId)
  }

  const sendMessage = async (receiverId: string) => {
    if (!userStore.profile || !messageInput.value.trim()) return

    const areFriends = friendStore.status[receiverId] === 'friends'
    const limitCheck = await messageService.checkMessageLimit(
      userStore.profile.id,
      receiverId,
      areFriends
    )

    if (!limitCheck.canMessage) {
      return
    }

    await messageStore.sendMessage(
      userStore.profile.id,
      receiverId,
      messageInput.value
    )
    messageInput.value = ''
  }

  const canMessageUser = async (receiverId: string): Promise<boolean> => {
    if (!userStore.profile) return false

    const areFriends = friendStore.status[receiverId] === 'friends'
    const limitCheck = await messageService.checkMessageLimit(
      userStore.profile.id,
      receiverId,
      areFriends
    )

    messageLimit.value = { limit: limitCheck.limit, current: limitCheck.count }
    return limitCheck.canMessage
  }

  return {
    messageInput,
    messageLimit,
    conversations,
    currentChat,
    loading,
    error,
    loadConversations,
    loadChat,
    sendMessage,
    canMessageUser
  }
}
