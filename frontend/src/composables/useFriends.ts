import { computed, ref } from 'vue'
import { useFriendStore } from '@/stores/friendStore'
import { useUserStore } from '@/stores/userStore'

export const useFriends = () => {
  const friendStore = useFriendStore()
  const userStore = useUserStore()
  const activeTab = ref<'friends' | 'requests'>('friends')

  const friends = computed(() => friendStore.friends)
  const requests = computed(() => friendStore.requests)
  const loading = computed(() => friendStore.loading)

  const loadFriends = async () => {
    if (!userStore.profile) return
    await friendStore.fetchFriends(userStore.profile.id)
  }

  const loadRequests = async () => {
    if (!userStore.profile) return
    await friendStore.fetchRequests(userStore.profile.id)
  }

  const handleAddFriend = async (friendId: string) => {
    if (!userStore.profile) return
    await friendStore.sendRequest(userStore.profile.id, friendId)
  }

  const handleAcceptRequest = async (senderId: string) => {
    if (!userStore.profile) return
    await friendStore.acceptRequest(userStore.profile.id, senderId)
  }

  const handleRejectRequest = async (senderId: string) => {
    if (!userStore.profile) return
    await friendStore.rejectRequest(userStore.profile.id, senderId)
  }

  const handleBlockUser = async (userId: string) => {
    if (!userStore.profile) return
    await friendStore.blockUser(userStore.profile.id, userId)
  }

  return {
    activeTab,
    friends,
    requests,
    loading,
    loadFriends,
    loadRequests,
    handleAddFriend,
    handleAcceptRequest,
    handleRejectRequest,
    handleBlockUser
  }
}
