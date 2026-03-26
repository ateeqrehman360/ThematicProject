export type ReportReason = 'harassment' | 'inappropriate_content' | 'spam' | 'fraud' | 'other'

export const REPORT_REASONS: ReportReason[] = [
  'harassment',
  'inappropriate_content',
  'spam',
  'fraud',
  'other'
]

export interface Report {
  reportedUserId?: number
  reportedPostId?: number
  reason: ReportReason
  description?: string
  reportedAt?: string
  status?: 'pending' | 'reviewed' | 'resolved'
}

export interface DiscoveryUser {
  userId: number
  fullName: string
  username: string
  avatarUrl: string
  location: string
  tcgInterests: string[]
  bio: string
}

export interface Store {
  storeId: number
  name: string
  location: string
  description: string
  imageUrl?: string
}

export interface Event {
  eventId: number
  name: string
  date: string
  location: string
  description: string
  tcgType: string
}
