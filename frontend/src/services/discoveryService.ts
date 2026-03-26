import { supabase } from './supabaseClient'
import type { DiscoveryUser, Store, Event } from '@/types/report'

export const discoveryService = {
  async searchPlayers(params: {
    interest?: string
    location?: string
    name?: string
    limit?: number
  }): Promise<DiscoveryUser[]> {
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

    const limit = params.limit || 20
    query = query.limit(limit)

    const { data, error } = await query

    if (error) throw error

    return data.map(user => ({
      userId: user.user_id,
      fullName: user.full_name,
      username: user.username || '',
      avatarUrl: user.profile_picture_url || '',
      location: user.location || '',
      tcgInterests: user.tcg_interests || [],
      bio: user.bio || ''
    }))
  },

  async fetchStores(location?: string, limit: number = 20): Promise<Store[]> {
    let query = supabase.from('stores').select('*')

    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    query = query.limit(limit)

    const { data, error } = await query

    if (error) throw error

    return data.map(store => ({
      storeId: store.store_id,
      name: store.name,
      location: store.location,
      description: store.description,
      imageUrl: store.image_url
    }))
  },

  async fetchEvents(location?: string, tcgType?: string, limit: number = 20): Promise<Event[]> {
    let query = supabase.from('events').select('*')

    if (location) {
      query = query.ilike('location', `%${location}%`)
    }
    if (tcgType) {
      query = query.ilike('tcg_type', `%${tcgType}%`)
    }

    query = query.order('event_date', { ascending: true }).limit(limit)

    const { data, error } = await query

    if (error) throw error

    return data.map(event => ({
      eventId: event.event_id,
      name: event.name,
      date: event.event_date,
      location: event.location,
      description: event.description,
      tcgType: event.tcg_type
    }))
  }
}
