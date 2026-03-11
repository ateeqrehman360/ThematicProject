import { supabase } from './supabaseClient'
import type { User } from '@/types/user'

export interface SearchUsersParams {
  interest?: string
  location?: string
  name?: string
  limit?: number
}

export const userService = {
  async getUserById(userId: number): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return this.mapDbUserToUser(data)
  },

  async updateUser(userId: number, userData: Partial<User>) {
    const updateData: Record<string, any> = {}
    
    if (userData.fullName) updateData.full_name = userData.fullName
    if (userData.bio) updateData.bio = userData.bio
    if (userData.location) updateData.location = userData.location
    if (userData.username) updateData.username = userData.username
    if (userData.tcgInterests) updateData.tcg_interests = userData.tcgInterests
    if (userData.favouriteCards) updateData.favourite_cards = userData.favouriteCards
    if (userData.gender) updateData.gender = userData.gender
    if (userData.phoneNumber) updateData.phone_number = userData.phoneNumber
    if (userData.isPrivateProfile !== undefined) updateData.is_private_profile = userData.isPrivateProfile

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return this.mapDbUserToUser(data)
  },

  async uploadUserPhoto(userId: number, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `user-avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('user-photos')
      .upload(filePath, file)
    
    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('user-photos')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  },

  async searchUsers(params: SearchUsersParams): Promise<User[]> {
    let query = supabase.from('users').select('*')

    if (params.name) {
      query = query.ilike('full_name', `%${params.name}%`)
    }
    if (params.location) {
      query = query.ilike('location', `%${params.location}%`)
    }
    if (params.interest) {
      query = query.contains('tcg_interests', [params.interest])
    }

    const limit = params.limit || 50
    query = query.limit(limit)

    const { data, error } = await query
    if (error) throw error
    
    return data.map(user => this.mapDbUserToUser(user))
  },

  mapDbUserToUser(dbUser: any): User {
    return {
      userId: dbUser.user_id,
      fullName: dbUser.full_name,
      username: dbUser.username || '',
      bio: dbUser.bio || '',
      avatarUrl: dbUser.profile_picture_url || '',
      location: dbUser.location || '',
      tcgInterests: dbUser.tcg_interests || [],
      favouriteCards: dbUser.favourite_cards || [],
      gender: dbUser.gender,
      email: dbUser.email,
      phoneNumber: dbUser.phone_number,
      dateOfBirth: dbUser.dob,
      isPrivateProfile: dbUser.is_private_profile || false
    }
  }
}
