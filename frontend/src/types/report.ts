export type ReportReason = 'harassment' | 'inappropriate_content' | 'spam' | 'fraud' | 'other'

export const REPORT_REASONS: ReportReason[] = [
  'harassment',
  'inappropriate_content',
  'spam',
  'fraud',
  'other'
]

export interface Report {
  id: string
  reported_user_id: string
  reason: string
  created_at?: string
}

export interface DiscoveryUser {
  id: string
  username: string
  bio: string
  city: string | null
  area: string | null
  tcg_interests: string[]
}

export interface Event {
  eventId: string
  name: string
  description: string
  date: string
  location: string
  tcgType: string
}

export interface Store {
  storeId: string
  name: string
  description: string
  location: string
  imageUrl?: string
}
