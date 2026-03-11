export type FriendStatus = 'none' | 'pending_sent' | 'pending_received' | 'friends' | 'blocked'

export interface FriendRequest {
  userId: number
  fullName: string
  username: string
  avatarUrl: string
  location: string
}

export interface Friend extends FriendRequest {
  friendSince: string
}
