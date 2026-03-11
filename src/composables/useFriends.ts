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
    await friendStore.fetchFriends(userStore.profile.userId)
  }

  const loadRequests = async () => {
    if (!userStore.profile) return
    await friendStore.fetchRequests(userStore.profile.userId)
  }

  const handleAddFriend = async (friendId: number) => {
    if (!userStore.profile) return
    await friendStore.sendRequest(userStore.profile.userId, friendId)
  }

  const handleAcceptRequest = async (senderId: number) => {
    if (!userStore.profile) return
    await friendStore.acceptRequest(userStore.profile.userId, senderId)
  }

  const handleRejectRequest = async (senderId: number) => {
    if (!userStore.profile) return
    await friendStore.rejectRequest(userStore.profile.userId, senderId)
  }

  const handleBlockUser = async (userId: number) => {
    if (!userStore.profile) return
    await friendStore.blockUser(userStore.profile.userId, userId)
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
