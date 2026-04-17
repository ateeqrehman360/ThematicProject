import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { supabase } from '@/services/supabaseClient'

/**
 * Hook to get the current user profile, loading it if necessary
 */
export const useCurrentUser = async () => {
  const userStore = useUserStore()

  // If profile already loaded, return it
  if (userStore.profile) {
    console.log('Profile already loaded in useCurrentUser')
    return userStore.profile
  }

  // Otherwise, get the auth user and load their profile
  console.log('Attempting to load profile in useCurrentUser...')
  
  // Add a timeout to prevent infinite hangs
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Profile loading timeout after 10 seconds')), 10000)
  )
  
  try {
    const { data: authData } = await Promise.race([
      supabase.auth.getUser(),
      timeoutPromise
    ]) as any
    const userId = authData?.user?.id

    if (!userId) {
      console.error('No authenticated user found')
      throw new Error('No authenticated user found')
    }

    console.log('Loading profile for user:', userId)
    const profile = await Promise.race([
      userStore.fetchUser(userId),
      timeoutPromise
    ])
    console.log('Profile loaded successfully in useCurrentUser:', profile)
    return profile
  } catch (err) {
    console.error('Failed to load profile in useCurrentUser:', err)
    throw err
  }
}

/**
 * Hook to get computed profile reference
 */
export const useProfile = () => {
  const userStore = useUserStore()
  return computed(() => userStore.profile)
}
