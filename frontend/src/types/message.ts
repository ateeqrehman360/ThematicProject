export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export interface Conversation {
  user_id: string
  username: string
}
