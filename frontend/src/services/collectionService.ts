// Service to handle user card collections
import { supabase } from './supabaseClient'

export const collectionService = {
  // Simple function to get a user's saved cards
  async getUserCollection(userId: string) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  // Add a new card to a collection
  async addCardToCollection(userId: string, cardData: any) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({ user_id: userId, ...cardData })

      if (error) throw error
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }
}