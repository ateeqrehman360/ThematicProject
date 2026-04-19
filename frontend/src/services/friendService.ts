import { supabase } from './supabaseClient'
import type { Friend, FriendRequest, FriendStatus } from '@/types/friendship'

type BlockRecord = {
  blocker_id: string
  blocked_id: string
}

type BlockRelationship = {
  isBlocked: boolean
  blockedByCurrentUser: boolean
  blockedByTargetUser: boolean
}

export const friendService = {
  async getBlockRelationships(userId: string, targetUserId: string): Promise<BlockRelationship> {
    const { data, error } = await supabase
      .from('blocks')
      .select('blocker_id, blocked_id')
      .or(
        `and(blocker_id.eq.${userId},blocked_id.eq.${targetUserId}),` +
        `and(blocker_id.eq.${targetUserId},blocked_id.eq.${userId})`
      )

    if (error) throw error

    const records = (data || []) as BlockRecord[]

    const blockedByCurrentUser = records.some(
      block => block.blocker_id === userId && block.blocked_id === targetUserId
    )
    const blockedByTargetUser = records.some(
      block => block.blocker_id === targetUserId && block.blocked_id === userId
    )

    return {
      isBlocked: blockedByCurrentUser || blockedByTargetUser,
      blockedByCurrentUser,
      blockedByTargetUser
    }
  },

  async getBlockedUserIds(userId: string): Promise<Set<string>> {
    const { data, error } = await supabase
      .from('blocks')
      .select('blocked_id, blocker_id')
      .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`)

    if (error) throw error

    const blockedIds = new Set<string>()

    ;((data || []) as BlockRecord[]).forEach(block => {
      if (block.blocker_id === userId) {
        blockedIds.add(block.blocked_id)
      } else if (block.blocked_id === userId) {
        blockedIds.add(block.blocker_id)
      }
    })

    return blockedIds
  },

  async getFriends(userId: string): Promise<Friend[]> {
    console.log('friendService.getFriends called for userId:', userId)
    const { data, error } = await supabase
      .from('friendships')
      .select('user1_id, user2_id, created_at')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)

    console.log('Friendships query result:', data, 'error:', error)

    if (error) throw error

    const friendIds = data.map(friendship => 
      friendship.user1_id === userId ? friendship.user2_id : friendship.user1_id
    )

    console.log('Friend IDs extracted:', friendIds)

    if (friendIds.length === 0) {
      console.log('No friend IDs found, returning empty array')
      return []
    }

    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', friendIds)

    console.log('Profiles query result:', users, 'error:', usersError)

    if (usersError) throw usersError

    const blockedIds = await this.getBlockedUserIds(userId)

    console.log('Blocked IDs:', Array.from(blockedIds))

    // Create a map of user IDs to friendship creation dates
    const friendshipDates: Record<string, string> = {}
    data.forEach(friendship => {
      const friendId = friendship.user1_id === userId ? friendship.user2_id : friendship.user1_id
      friendshipDates[friendId] = friendship.created_at
    })

    const result = users
      .filter(user => !blockedIds.has(user.id))
      .map(user => ({
        id: user.id,
        username: user.username || '',
        bio: user.bio || '',
        city: user.city || null,
        area: user.area || null,
        tcg_interests: user.tcg_interests || [],
        created_at: friendshipDates[user.id] || new Date().toISOString()
      }))
    
    console.log('Final friends list:', result)
    return result
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

    const blockedIds = await this.getBlockedUserIds(userId)

    return data
      .filter(req => !blockedIds.has(req.sender_id))
      .map(req => {
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
    console.log('acceptFriendRequest - senderId:', senderId, 'userId:', userId)
    // Update friend_request status
    const { error: updateError } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('sender_id', senderId)
      .eq('receiver_id', userId)

    if (updateError) {
      console.error('Error updating friend_request:', updateError)
      throw updateError
    }
    console.log('Friend request status updated to accepted')

    // Create friendship record
    console.log('Creating friendship record with user1_id:', senderId, 'user2_id:', userId)
    const { data: friendshipData, error: friendshipError } = await supabase
      .from('friendships')
      .insert({
        user1_id: senderId,
        user2_id: userId
      })
      .select()

    console.log('Friendship insert response - data:', friendshipData, 'error:', friendshipError)

    if (friendshipError) {
      console.error('Error creating friendship:', friendshipError)
      throw friendshipError
    }
    console.log('Friendship created successfully between', senderId, 'and', userId)
  },

  async rejectFriendRequest(senderId: string, userId: string) {
    const { error } = await supabase
      .from('friend_requests')
      .delete()
      .eq('sender_id', senderId)
      .eq('receiver_id', userId)

    if (error) throw error
  },

  async removeFriend(userId: string, friendId: string) {
    console.log('removeFriend - userId:', userId, 'friendId:', friendId)
    
    // Delete friendship record
    const { error: friendshipError } = await supabase
      .from('friendships')
      .delete()
      .or(
        `and(user1_id.eq.${userId},user2_id.eq.${friendId}),` +
        `and(user1_id.eq.${friendId},user2_id.eq.${userId})`
      )

    if (friendshipError) {
      console.error('Error removing friendship:', friendshipError)
      throw friendshipError
    }
    console.log('Friendship removed successfully between', userId, 'and', friendId)

    // Also delete any associated friend_request records to allow re-adding
    const { error: requestError } = await supabase
      .from('friend_requests')
      .delete()
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${friendId}),` +
        `and(sender_id.eq.${friendId},receiver_id.eq.${userId})`
      )

    if (requestError) {
      console.error('Error removing friend requests:', requestError)
      // Don't throw here - friendship is already removed, this is just cleanup
    } else {
      console.log('Friend requests cleaned up between', userId, 'and', friendId)
    }
  },

  async getFriendStatus(userId: string, targetUserId: string): Promise<FriendStatus> {
    console.log('getFriendStatus - userId:', userId, 'targetUserId:', targetUserId)

    // A block should override any existing friendship or request state.
    const blockRelationship = await this.getBlockRelationships(userId, targetUserId)

    console.log('Block query result:', blockRelationship)

    if (blockRelationship.isBlocked) {
      console.log('Found block, returning blocked')
      return 'blocked'
    }

    // Check if friends
    const { data: friendship, error: friendshipError } = await supabase
      .from('friendships')
      .select('id')
      .or(
        `and(user1_id.eq.${userId},user2_id.eq.${targetUserId}),` +
        `and(user1_id.eq.${targetUserId},user2_id.eq.${userId})`
      )
      .limit(1)

    console.log('Friendship query result:', friendship, 'error:', friendshipError)

    if (friendship && friendship.length > 0) {
      console.log('Found friendship, returning friends')
      return 'friends'
    }

    // Check friend request status
    const { data: request, error: requestError } = await supabase
      .from('friend_requests')
      .select('status, sender_id')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${targetUserId}),` +
        `and(sender_id.eq.${targetUserId},receiver_id.eq.${userId})`
      )
      .limit(1)

    console.log('Friend request query result:', request, 'error:', requestError)

    if (request && request.length > 0) {
      const req = request[0]
      console.log('Found request with status:', req.status)
      if (req?.status === 'pending') {
        const result = req.sender_id === userId ? 'pending_sent' : 'pending_received'
        console.log('Request is pending, returning:', result)
        return result
      } else if (req?.status === 'accepted') {
        console.log('Request is accepted but no friendship found, treating as friends')
        return 'friends'
      }
    }

    console.log('No relationship found, returning none')
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
    const blockRelationship = await this.getBlockRelationships(userId, targetUserId)
    return blockRelationship.isBlocked
  },

  async getBlockedUsers(userId: string): Promise<Friend[]> {
    console.log('friendService.getBlockedUsers called for userId:', userId)
    
    // Get all blocks where this user is the blocker
    const { data: blocks, error: blocksError } = await supabase
      .from('blocks')
      .select('blocked_id')
      .eq('blocker_id', userId)

    console.log('Blocks query result:', blocks, 'error:', blocksError)

    if (blocksError) throw blocksError

    const blockedIds = blocks.map(block => block.blocked_id)

    if (blockedIds.length === 0) {
      console.log('No blocked users found, returning empty array')
      return []
    }

    // Fetch the blocked users' profiles
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', blockedIds)

    console.log('Blocked users profiles query result:', users, 'error:', usersError)

    if (usersError) throw usersError

    const result = (users || []).map(user => ({
      id: user.id,
      username: user.username || '',
      bio: user.bio || '',
      city: user.city || null,
      area: user.area || null,
      tcg_interests: user.tcg_interests || [],
      created_at: new Date().toISOString()
    }))
    
    console.log('Final blocked users list:', result)
    return result
  }
}

