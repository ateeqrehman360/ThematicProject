// Profile service for handling user data from the database
import { supabase } from './supabaseClient'

export const profileService = {
  // Simple function to fetch a single profile by user ID
  async getProfile(userId: string) {
    try {
      console.log('profileService.getProfile called with userId:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1)

      console.log('profileService.getProfile response - data:', data, 'error:', error)

      if (error) {
        console.error('profileService.getProfile supabase error:', error)
        throw error
      }
      
      const profile = data && data.length > 0 ? data[0] : null
      console.log('profileService.getProfile returning profile:', profile)
      return { data: profile, error: null }
    } catch (err: any) {
      console.error('Error in profileService (getProfile):', err.message, err)
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