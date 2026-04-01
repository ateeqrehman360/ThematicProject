import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profileService } from '@/services/profileService'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const profile = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUser(userId: string) {
    console.log('userStore.fetchUser called with:', userId)
    loading.value = true
    error.value = null
    try {
      const { data, error: serviceError } = await profileService.getProfile(userId)
      if (serviceError) throw new Error(serviceError)
      profile.value = data
      console.log('userStore.profile loaded:', data)
      return data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data: Partial<User>) {
    if (!profile.value) throw new Error('No profile loaded')
    
    loading.value = true
    error.value = null
    try {
      const { data: updated, error: serviceError } = await profileService.updateProfile(profile.value.id, data)
      if (serviceError) throw new Error(serviceError)
      profile.value = updated
      return updated
    } catch (err: any) {
      error.value = err.message || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadAvatar(file: File) {
    if (!profile.value) throw new Error('No profile loaded')
    
   /* loading.value = true
    error.value = null
    try {
      const url = await userService.uploadUserPhoto(profile.value.userId, file)
      profile.value.avatarUrl = url
      await userService.updateUser(profile.value.userId, { avatarUrl: url })
      return url
    } catch (err: any) {
      error.value = err.message || 'Failed to upload avatar'
      throw err
    } finally {
      loading.value = false
    }*/
  }

  function setProfile(user: User) {
    profile.value = user
  }

  return {
    profile,
    loading,
    error,
    fetchUser,
    updateProfile,
    uploadAvatar,
    setProfile
  }
})
