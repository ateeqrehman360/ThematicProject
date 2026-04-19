import { supabase } from './supabaseClient'
import { friendService } from './friendService'
import type { DiscoveryUser } from '@/types/report'

export const discoveryService = {
  async searchPlayers(params: {
    interest?: string
    city?: string
    area?: string
    username?: string
    limit?: number
    userId?: string
  }): Promise<DiscoveryUser[]> {
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

    const limit = params.limit || 20
    query = query.limit(limit)

    const { data, error } = await query

    if (error) throw error

    let profiles = data.map(user => ({
      id: user.id,
      username: user.username || '',
      bio: user.bio || '',
      city: user.city || null,
      area: user.area || null,
      tcg_interests: user.tcg_interests || []
    }))

    // Filter out blocked users if userId is provided
    if (params.userId) {
      const blockedIds = await friendService.getBlockedUserIds(params.userId)
      profiles = profiles.filter(p => !blockedIds.has(p.id))
    }

    return profiles
  }
}
