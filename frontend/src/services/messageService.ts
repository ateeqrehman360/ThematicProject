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
      sender_name: msg.sender_name || '',
      sender_avatar: msg.sender_avatar || '',
      receiver_id: msg.receiver_id,
      content: msg.content,
      created_at: msg.created_at,
      isRead: msg.is_read
    }))
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .rpc('get_conversations', { p_user_id: userId })

    if (error) throw error

    return data.map((conv: any) => ({
      id: conv.other_user_id,
      username: conv.other_user_name,
      user_avatar: conv.other_user_avatar,
      lastMessage: conv.last_message,
      lastMessageTime: conv.last_message_time,
      unreadCount: conv.unread_count || 0,
      isBlocked: conv.is_blocked || false
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
