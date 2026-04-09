import { supabase } from './supabaseClient'
import type { DiscoveryUser } from '@/types/report'

export const discoveryService = {
  async searchPlayers(params: {
    interest?: string
    city?: string
    area?: string
    username?: string
    limit?: number
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

    return data.map(user => ({
      id: user.id,
      username: user.username || '',
      bio: user.bio || '',
      city: user.city || null,
      area: user.area || null,
      tcg_interests: user.tcg_interests || []
    }))
  }
}
