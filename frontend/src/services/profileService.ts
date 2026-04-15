// Profile service for handling user data from the database
import { supabase } from './supabaseClient'

export const profileService = {
  // Simple function to fetch a single profile by user ID
  async getProfile(userId: string) {
    try {
      console.log('profileService.getProfile called with:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1)

      if (error) throw error
      
      // Return first result if exists, otherwise null
      return { data: data && data.length > 0 ? data[0] : null, error: null }
    } catch (err: any) {
      console.error('Error in profileService (getProfile):', err.message)
      return { data: null, error: err.message }
    }
  },

  // Example function for updating profile information
  async updateProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .limit(1)

      if (error) throw error
      
      // Return first result if exists
      return { data: data && data.length > 0 ? data[0] : null, error: null }
    } catch (err: any) {
      console.error('Error in profileService (updateProfile):', err.message)
      return { data: null, error: err.message }
    }
  }
}