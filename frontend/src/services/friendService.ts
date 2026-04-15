import { supabase } from './supabaseClient'
import type { Friend, FriendRequest, FriendStatus } from '@/types/friendship'

export const friendService = {
  async getFriends(userId: string): Promise<Friend[]> {
    const { data, error } = await supabase
      .from('friendships')
      .select('user1_id, user2_id, created_at')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)

    if (error) throw error

    const friendIds = data.map(friendship => 
      friendship.user1_id === userId ? friendship.user2_id : friendship.user1_id
    )

    if (friendIds.length === 0) return []

    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', friendIds)

    if (usersError) throw usersError

    return users.map((user, idx) => ({
      id: user.id,
      username: user.username || '',
      bio: user.bio || '',
      city: user.city || null,
      area: user.area || null,
      tcg_interests: user.tcg_interests || [],
      created_at: data[idx]?.created_at || new Date().toISOString()
    }))
  },

  async addFriend(userId: string, friendId: string) {
    const { error } = await supabase
      .from('friend_requests')
      .insert({
        sender_id: userId,
        receiver_id: friendId,
        status: 'pending'
      })

    if (error) throw error
  },

  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    const { data, error } = await supabase
      .from('friend_requests')
      .select('sender_id, profiles!sender_id(id, username, bio, city, area, tcg_interests)')
      .eq('receiver_id', userId)
      .eq('status', 'pending')

    if (error) throw error

    return data.map(req => {
      const profile = Array.isArray(req.profiles) ? req.profiles[0] : req.profiles

      return {
        id: req.sender_id,
        username: profile?.username || '',
        bio: profile?.bio || '',
        city: profile?.city || null,
        area: profile?.area || null,
        tcg_interests: profile?.tcg_interests || []
      }
    })
  },

  async acceptFriendRequest(senderId: string, userId: string) {
    // Update friend_request status
    const { error: updateError } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('sender_id', senderId)
      .eq('receiver_id', userId)

    if (updateError) throw updateError

    // Create friendship record
    const { error: friendshipError } = await supabase
      .from('friendships')
      .insert({
        user1_id: senderId,
        user2_id: userId
      })

    if (friendshipError) throw friendshipError
  },

  async rejectFriendRequest(senderId: string, userId: string) {
    const { error } = await supabase
      .from('friend_requests')
      .delete()
      .eq('sender_id', senderId)
      .eq('receiver_id', userId)

    if (error) throw error
  },

  async getFriendStatus(userId: string, targetUserId: string): Promise<FriendStatus> {
    // Check if friends
    const { data: friendship } = await supabase
      .from('friendships')
      .select('id')
      .or(
        `and(user1_id.eq.${userId},user2_id.eq.${targetUserId}),` +
        `and(user1_id.eq.${targetUserId},user2_id.eq.${userId})`
      )
      .limit(1)

    if (friendship && friendship.length > 0) {
      return 'friends'
    }

    // Check if blocked
    const { data: blocked } = await supabase
      .from('blocks')
      .select('id')
      .or(
        `and(blocker_id.eq.${userId},blocked_id.eq.${targetUserId}),` +
        `and(blocker_id.eq.${targetUserId},blocked_id.eq.${userId})`
      )
      .limit(1)

    if (blocked && blocked.length > 0) {
      return 'blocked'
    }

    // Check friend request status
    const { data: request } = await supabase
      .from('friend_requests')
      .select('status, sender_id')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${targetUserId}),` +
        `and(sender_id.eq.${targetUserId},receiver_id.eq.${userId})`
      )
      .limit(1)

    if (request && request.length > 0 && request[0]?.status === 'pending') {
      return request[0].sender_id === userId ? 'pending_sent' : 'pending_received'
    }

    return 'none'
  },

  async blockUser(userId: string, blockedUserId: string) {
    const { error } = await supabase
      .from('blocks')
      .insert({
        blocker_id: userId,
        blocked_id: blockedUserId
      })

    if (error) throw error
  },

  async unblockUser(userId: string, blockedUserId: string) {
    const { error } = await supabase
      .from('blocks')
      .delete()
      .eq('blocker_id', userId)
      .eq('blocked_id', blockedUserId)

    if (error) throw error
  },

  async isBlocked(userId: string, targetUserId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('blocks')
      .select('id')
      .or(
        `and(blocker_id.eq.${userId},blocked_id.eq.${targetUserId}),` +
        `and(blocker_id.eq.${targetUserId},blocked_id.eq.${userId})`
      )
      .single()

    if (error && error.code === 'PGRST116') {
      return false
    }
    if (error) throw error

    return !!data
  }
}
