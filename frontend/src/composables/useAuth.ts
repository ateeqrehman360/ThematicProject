import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { authService } from '@/services/authService'

export const useAuth = () => {
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const initialized = ref(false)

  onMounted(async () => {
    try {
      const session = await authService.getSession()
      if (session?.user?.id) {
        // Load user profile
        await userStore.fetchUser(session.user.id)
      }
      initialized.value = true
    } catch (err) {
      console.error('Auth init error:', err)
      initialized.value = true
    }
  })

  return {
    initialized,
    authStore,
    userStore
  }
}
