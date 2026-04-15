import { supabase } from './supabaseClient'
import type { User } from '@/types/user'

export interface SearchUsersParams {
  interest?: string
  city?: string
  area?: string
  username?: string
  limit?: number
}

export const userService = {
  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .limit(1)
    
    if (error || !data || data.length === 0) return null
    return this.mapDbUserToUser(data[0])
  },

  async updateUser(userId: string, userData: Partial<User>) {
    const updateData: Record<string, any> = {}
    
    if (userData.bio !== undefined) updateData.bio = userData.bio
    if (userData.city !== undefined) updateData.city = userData.city
    if (userData.area !== undefined) updateData.area = userData.area
    if (userData.username !== undefined) updateData.username = userData.username
    if (userData.tcg_interests !== undefined) updateData.tcg_interests = userData.tcg_interests
    if (userData.is_private !== undefined) updateData.is_private = userData.is_private

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .limit(1)
    
    if (error || !data || data.length === 0) throw error || new Error('Update failed')
    return this.mapDbUserToUser(data[0])
  },

  async searchUsers(params: SearchUsersParams): Promise<User[]> {
    let query = supabase.from('profiles').select('*')

    if (params.username) {
      query = query.ilike('username', `%${params.username}%`)
    }
    if (params.city) {
      query = query.ilike('city', `%${params.city}%`)
    }
    if (params.area) {
      query = query.ilike('area', `%${params.area}%`)
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
      id: dbUser.id,
      username: dbUser.username || '',
      bio: dbUser.bio || '',
      city: dbUser.city || null,
      area: dbUser.area || null,
      date_of_birth: dbUser.date_of_birth || '',
      is_private: dbUser.is_private || false,
      tcg_interests: dbUser.tcg_interests || [],
      created_at: dbUser.created_at || ''
    }
  }
}
