export interface User {
  id: string
  username: string
  bio: string
  city: string | null
  area: string | null
  date_of_birth: string
  is_private: boolean
  tcg_interests: string[]
  created_at: string
}

export interface UserProfile extends User {
  friendCount: number
  postCount: number
}
