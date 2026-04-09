export type FriendStatus = 'none' | 'pending' | 'pending_sent' | 'pending_received' | 'friends' | 'blocked'

export interface FriendRequest {
  id: string
  username: string
  bio: string
  city: string | null
  area: string | null
  tcg_interests: string[]
}

export interface Friend extends FriendRequest {
  created_at: string
}
