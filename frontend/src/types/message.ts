export interface Message {
  messageId: number
  senderId: number
  senderName: string
  senderAvatar: string
  receiverId: number
  content: string
  imageUrl?: string
  timestamp: string
  isRead?: boolean
}

export interface Conversation {
  userId: number
  userName: string
  userAvatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isBlocked?: boolean
}
