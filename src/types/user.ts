export interface User {
  userId: number
  fullName: string
  username: string
  bio: string
  avatarUrl: string
  location: string
  tcgInterests: string[]
  favouriteCards: string[]
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
