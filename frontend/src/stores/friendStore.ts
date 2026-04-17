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
      // Properly trigger Vue reactivity by reassigning the object
      status.value = { ...status.value, [friendId]: 'pending_sent' }
    } catch (err: any) {
      error.value = err.message || 'Failed to send request'
      throw err
    }
  }

  async function acceptRequest(userId: string, senderId: string) {
    error.value = null
    try {
      console.log('acceptRequest called - userId:', userId, 'senderId:', senderId)
      await friendService.acceptFriendRequest(senderId, userId)
      console.log('Friend request accepted, removing from requests')
      requests.value = requests.value.filter(r => r.id !== senderId)
      // Properly trigger Vue reactivity by reassigning the object
      status.value = { ...status.value, [senderId]: 'friends' }
      console.log('Updated status to friends for:', senderId)
      // Reload friends list to show newly accepted friend
      console.log('Reloading friends and requests lists...')
      // Run in parallel with timeout protection
      await Promise.all([
        Promise.race([fetchFriends(userId), new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch friends timeout')), 15000))]),
        Promise.race([fetchRequests(userId), new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch requests timeout')), 15000))])
      ]).catch(err => {
        console.error('Error reloading lists:', err)
        error.value = 'Partially reloaded: ' + err.message
      })
      console.log('Friends and requests lists reloaded')
    } catch (err: any) {
      console.error('acceptRequest error:', err)
      error.value = err.message || 'Failed to accept request'
      loading.value = false
      throw err
    }
  }

  async function rejectRequest(userId: string, senderId: string) {
    loading.value = true
    error.value = null
    try {
      console.log('rejectRequest called - userId:', userId, 'senderId:', senderId)
      await friendService.rejectFriendRequest(senderId, userId)
      console.log('Friend request rejected')
      requests.value = requests.value.filter(r => r.id !== senderId)
      // Properly trigger Vue reactivity by creating a new object without the key
      const newStatus = { ...status.value }
      delete newStatus[senderId]
      status.value = newStatus
      console.log('Rejected request removed from UI')
    } catch (err: any) {
      console.error('rejectRequest error:', err)
      error.value = err.message || 'Failed to reject request'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function checkFriendStatus(userId: string, targetUserId: string) {
    try {
      const friendStatus = await friendService.getFriendStatus(userId, targetUserId)
      // Properly trigger Vue reactivity by reassigning the object
      status.value = { ...status.value, [targetUserId]: friendStatus }
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
      // Properly trigger Vue reactivity by reassigning the object
      status.value = { ...status.value, [blockedUserId]: 'blocked' }
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
