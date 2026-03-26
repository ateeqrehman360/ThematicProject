import { supabase } from './supabaseClient'
import type { Message, Conversation } from '@/types/message'

const MESSAGE_LIMIT_FOR_NON_FRIENDS = 5

export const messageService = {
  async getMessages(userId: number, otherUserId: number): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(msg => ({
      messageId: msg.message_id,
      senderId: msg.sender_id,
      senderName: msg.sender_name || '',
      senderAvatar: msg.sender_avatar || '',
      receiverId: msg.receiver_id,
      content: msg.content,
      imageUrl: msg.image_url,
      timestamp: msg.created_at,
      isRead: msg.is_read
    }))
  },

  async getConversations(userId: number): Promise<Conversation[]> {
    const { data, error } = await supabase
      .rpc('get_conversations', { p_user_id: userId })

    if (error) throw error

    return data.map((conv: any) => ({
      userId: conv.other_user_id,
      userName: conv.other_user_name,
      userAvatar: conv.other_user_avatar,
      lastMessage: conv.last_message,
      lastMessageTime: conv.last_message_time,
      unreadCount: conv.unread_count || 0,
      isBlocked: conv.is_blocked || false
    }))
  },

  async sendMessage(senderId: number, receiverId: number, content: string, imageUrl?: string) {
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        image_url: imageUrl,
        is_read: false
      })

    if (error) throw error
  },

  async markAsRead(messageId: number) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('message_id', messageId)

    if (error) throw error
  },

  async getMessageCountWithUser(userId: number, otherUserId: number): Promise<number> {
    const { data, error } = await supabase
      .from('messages')
      .select('message_id')
      .eq('sender_id', userId)
      .eq('receiver_id', otherUserId)

    if (error) throw error
    return data.length
  },

  async checkMessageLimit(userId: number, otherUserId: number, areFriends: boolean): Promise<{ canMessage: boolean; count: number; limit: number }> {
    if (areFriends) {
      return { canMessage: true, count: 0, limit: -1 }
    }

    const count = await this.getMessageCountWithUser(userId, otherUserId)
    const limit = MESSAGE_LIMIT_FOR_NON_FRIENDS
    const canMessage = count < limit

    return { canMessage, count, limit }
  }
}
