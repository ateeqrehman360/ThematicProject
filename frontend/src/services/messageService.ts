import { supabase } from './supabaseClient'
import type { Message, Conversation } from '@/types/message'

const MESSAGE_LIMIT_FOR_NON_FRIENDS = 5

export const messageService = {
  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('direct_messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(msg => ({
      id: msg.id,
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      content: msg.content,
      created_at: msg.created_at
    }))
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    // Get all unique users I have messaged
    const { data: messages, error } = await supabase
      .from('direct_messages')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)

    if (error) throw error

    // Extract unique user IDs
    const userIds = new Set<string>()
    messages.forEach(msg => {
      if (msg.sender_id !== userId) userIds.add(msg.sender_id)
      if (msg.receiver_id !== userId) userIds.add(msg.receiver_id)
    })

    if (userIds.size === 0) return []

    // Get profile info for those users
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', Array.from(userIds))

    if (profileError) throw profileError

    return profiles.map(profile => ({
      user_id: profile.id,
      username: profile.username
    }))
  },

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const { error } = await supabase
      .from('direct_messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content
      })

    if (error) throw error
  },

  async getMessageCountWithUser(userId: string, otherUserId: string): Promise<number> {
    const { data, error } = await supabase
      .from('direct_messages')
      .select('id')
      .eq('sender_id', userId)
      .eq('receiver_id', otherUserId)

    if (error) throw error
    return data.length
  },

  async checkMessageLimit(userId: string, otherUserId: string, areFriends: boolean): Promise<{ canMessage: boolean; count: number; limit: number }> {
    if (areFriends) {
      return { canMessage: true, count: 0, limit: -1 }
    }

    const count = await this.getMessageCountWithUser(userId, otherUserId)
    const limit = MESSAGE_LIMIT_FOR_NON_FRIENDS
    const canMessage = count < limit

    return { canMessage, count, limit }
  }
}
