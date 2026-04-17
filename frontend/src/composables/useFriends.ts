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
    console.log('handleAcceptRequest called - senderId:', senderId)
    try {
      await friendStore.acceptRequest(userStore.profile.id, senderId)
      console.log('Friend request accepted successfully')
    } catch (err) {
      console.error('Error accepting request:', err)
      throw err
    }
  }

  const handleRejectRequest = async (senderId: string) => {
    if (!userStore.profile) return
    console.log('handleRejectRequest called - senderId:', senderId)
    try {
      await friendStore.rejectRequest(userStore.profile.id, senderId)
      console.log('Friend request rejected successfully')
    } catch (err) {
      console.error('Error rejecting request:', err)
      throw err
    }
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
