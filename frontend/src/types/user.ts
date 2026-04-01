export interface User {
  id: string
  username: string
  bio: string
  city?: string
  area?: string
  is_private?: boolean
  avatarUrl?: string
  fullName?: string
  location?: string
  tcgInterests?: string[]
  favouriteCards?: string[]
  gender?: string
  email?: string
  phoneNumber?: string
  dateOfBirth?: string
  isPrivateProfile?: boolean
}

export interface UserProfile extends User {
  friendCount: number
  postCount: number
  joinDate: string
}
