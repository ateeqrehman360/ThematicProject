export interface Message {
  id: string
  sender_id: string
  senderId?: string
  sender_name: string
  sender_avatar: string
  receiver_id: string
  content: string
  created_at: string
  timestamp?: string
  messageId?: string
  isRead?: boolean
}

export interface Conversation {
  id: string
  username: string
  user_avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isBlocked?: boolean
}
