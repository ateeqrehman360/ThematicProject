export interface User {
  id: string
  username: string
  bio: string
<<<<<<< HEAD
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
=======
  city: string | null
  area: string | null
  date_of_birth: string
  is_private: boolean
  tcg_interests: string[]
  created_at: string
>>>>>>> 9cc979e (Fixed frontend build, matched with schema, and typescript errors)
}

export interface UserProfile extends User {
  friendCount: number
  postCount: number
}
