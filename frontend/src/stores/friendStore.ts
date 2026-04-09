import { defineStore } from 'pinia'
import { ref } from 'vue'
import { friendService } from '@/services/friendService'
import type { Friend, FriendRequest, FriendStatus } from '@/types/friendship'

export const useFriendStore = defineStore('friend', () => {
  const friends = ref<Friend[]>([])
  const requests = ref<FriendRequest[]>([])
  const status = ref<Record<string, FriendStatus>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchFriends(userId: string) {
    loading.value = true
    error.value = null
    try {
      friends.value = await friendService.getFriends(userId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch friends'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRequests(userId: string) {
    loading.value = true
    error.value = null
    try {
      requests.value = await friendService.getFriendRequests(userId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch requests'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function sendRequest(userId: string, friendId: string) {
    error.value = null
    try {
      await friendService.addFriend(userId, friendId)
      status.value[friendId] = 'pending'
    } catch (err: any) {
      error.value = err.message || 'Failed to send request'
      throw err
    }
  }

  async function acceptRequest(userId: string, senderId: string) {
    error.value = null
    try {
      await friendService.acceptFriendRequest(senderId, userId)
      requests.value = requests.value.filter(r => r.id !== senderId)
      status.value[senderId] = 'friends'
    } catch (err: any) {
      error.value = err.message || 'Failed to accept request'
      throw err
    }
  }

  async function rejectRequest(userId: string, senderId: string) {
    error.value = null
    try {
      await friendService.rejectFriendRequest(senderId, userId)
      requests.value = requests.value.filter(r => r.id !== senderId)
      delete status.value[senderId]
    } catch (err: any) {
      error.value = err.message || 'Failed to reject request'
      throw err
    }
  }

  async function checkFriendStatus(userId: string, targetUserId: string) {
    try {
      const friendStatus = await friendService.getFriendStatus(userId, targetUserId)
      status.value[targetUserId] = friendStatus
      return friendStatus
    } catch (err: any) {
      error.value = err.message || 'Failed to check status'
      throw err
    }
  }

  async function blockUser(userId: string, blockedUserId: string) {
    error.value = null
    try {
      await friendService.blockUser(userId, blockedUserId)
      status.value[blockedUserId] = 'blocked'
      friends.value = friends.value.filter(f => f.id !== blockedUserId)
    } catch (err: any) {
      error.value = err.message || 'Failed to block user'
      throw err
    }
  }

  async function unblockUser(userId: string, blockedUserId: string) {
    error.value = null
    try {
      await friendService.unblockUser(userId, blockedUserId)
      delete status.value[blockedUserId]
    } catch (err: any) {
      error.value = err.message || 'Failed to unblock user'
      throw err
    }
  }

  return {
    friends,
    requests,
    status,
    loading,
    error,
    fetchFriends,
    fetchRequests,
    sendRequest,
    acceptRequest,
    rejectRequest,
    checkFriendStatus,
    blockUser,
    unblockUser
  }
})
