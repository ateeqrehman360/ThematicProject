import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type SignupPayload } from '@/services/authService'
import type { User } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const authInitialized = ref(false)

  const isAuthenticated = computed(() => !!session.value)

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const data = await authService.login({ email, password })
      session.value = data.session
      // User profile would be fetched via userStore
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signup(payload: SignupPayload) {
    loading.value = true
    error.value = null
    try {
      const data = await authService.signup(payload)
      session.value = data.session
    } catch (err: any) {
      error.value = err.message || 'Signup failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    error.value = null
    try {
      await authService.logout()
      session.value = null
      user.value = null
    } catch (err: any) {
      error.value = err.message || 'Logout failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function initAuth() {
    loading.value = true
    try {
      const sess = await authService.getSession()
      session.value = sess
      console.log('Auth initialized. Session:', !!sess)
    } catch (err: any) {
      error.value = err.message || 'Failed to init auth'
      console.error('Auth init error:', err)
    } finally {
      loading.value = false
      authInitialized.value = true
      console.log('authInitialized set to true')
    }
  }

  function setUser(userData: User) {
    user.value = userData
  }

  return {
    user,
    session,
    loading,
    error,
    authInitialized,
    isAuthenticated,
    login,
    signup,
    logout,
    initAuth,
    setUser
  }
})
