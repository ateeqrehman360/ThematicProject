import { supabase } from './supabaseClient'
import type { Friend, FriendRequest, FriendStatus } from '@/types/friendship'

export const friendService = {
  async getFriends(userId: number): Promise<Friend[]> {
    const { data, error } = await supabase
      .from('friend_requests')
      .select('receiver_id, sender_id, created_at')
      .eq('status', 'accepted')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)

    if (error) throw error

    const friendIds = data.map(req => 
      req.sender_id === userId ? req.receiver_id : req.sender_id
    )

    if (friendIds.length === 0) return []

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .in('user_id', friendIds)

    if (usersError) throw usersError

    return users.map(user => ({
      userId: user.user_id,
      fullName: user.full_name,
      username: user.username || '',
      avatarUrl: user.profile_picture_url || '',
      location: user.location || '',
      friendSince: new Date(user.created_at).toISOString()
    }))
  },

  async addFriend(userId: number, friendId: number) {
    const { error } = await supabase
      .from('friend_requests')
      .insert({
        sender_id: userId,
        receiver_id: friendId,
        status: 'pending'
      })

    if (error) throw error
  },

  async getFriendRequests(userId: number): Promise<FriendRequest[]> {
    const { data, error } = await supabase
      .from('friend_requests')
      .select('sender_id, users(user_id, full_name, username, profile_picture_url, location)')
      .eq('receiver_id', userId)
      .eq('status', 'pending')

    if (error) throw error

    return data.map(req => ({
      userId: req.sender_id,
      fullName: req.users?.full_name || '',
      username: req.users?.username || '',
      avatarUrl: req.users?.profile_picture_url || '',
      location: req.users?.location || ''
    }))
  },

  async acceptFriendRequest(senderId: number, userId: number) {
    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('sender_id', senderId)
      .eq('receiver_id', userId)

    if (error) throw error
  },

  async rejectFriendRequest(senderId: number, userId: number) {
    const { error } = await supabase
      .from('friend_requests')
      .delete()
      .eq('sender_id', senderId)
      .eq('receiver_id', userId)

    if (error) throw error
  },

  async getFriendStatus(userId: number, targetUserId: number): Promise<FriendStatus> {
    const { data, error } = await supabase
      .from('friend_requests')
      .select('status')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${targetUserId}),` +
        `and(sender_id.eq.${targetUserId},receiver_id.eq.${userId})`
      )
      .single()

    if (error && error.code === 'PGRST116') {
      return 'none'
    }
    if (error) throw error

    if (data.status === 'accepted') {
      return 'friends'
    }

    const { data: incomingRequest } = await supabase
      .from('friend_requests')
      .select('status')
      .eq('sender_id', targetUserId)
      .eq('receiver_id', userId)
      .single()

    if (incomingRequest?.status === 'pending') {
      return 'pending_received'
    }

    return 'pending_sent'
  },

  async blockUser(userId: number, blockedUserId: number) {
    const { error } = await supabase
      .from('blocked_users')
      .insert({
        user_id: userId,
        blocked_user_id: blockedUserId
      })

    if (error) throw error
  },

  async unblockUser(userId: number, blockedUserId: number) {
    const { error } = await supabase
      .from('blocked_users')
      .delete()
      .eq('user_id', userId)
      .eq('blocked_user_id', blockedUserId)

    if (error) throw error
  },

  async isBlocked(userId: number, targetUserId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('blocked_users')
      .select('id')
      .or(
        `and(user_id.eq.${userId},blocked_user_id.eq.${targetUserId}),` +
        `and(user_id.eq.${targetUserId},blocked_user_id.eq.${userId})`
      )
      .single()

    if (error && error.code === 'PGRST116') {
      return false
    }
    if (error) throw error

    return !!data
  }
}
