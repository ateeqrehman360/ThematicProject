<template>
  <div class="min-h-screen bg-gray-50">
    <nav v-if="!isAuthPage" class="bg-white shadow-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="flex items-center gap-2">
            <span class="text-2xl font-bold text-indigo-600">Kinship</span>
          </router-link>
          
          <div class="hidden md:flex items-center gap-6">
            <router-link v-if="authStore.isAuthenticated" to="/feed" class="text-gray-700 hover:text-indigo-600 transition-colors">Feed</router-link>
            <router-link v-if="authStore.isAuthenticated" to="/discovery" class="text-gray-700 hover:text-indigo-600 transition-colors">Discovery</router-link>
            <router-link v-if="authStore.isAuthenticated" to="/messages" class="text-gray-700 hover:text-indigo-600 transition-colors">Messages</router-link>
            <router-link v-if="authStore.isAuthenticated" to="/friends" class="text-gray-700 hover:text-indigo-600 transition-colors">Friends</router-link>
            <router-link v-if="authStore.isAuthenticated && currentUserId" :to="'/profile/' + currentUserId" class="text-gray-700 hover:text-indigo-600 transition-colors">Profile</router-link>
            
            <button v-if="authStore.isAuthenticated" @click="handleLogout" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Logout</button>
            <router-link v-else to="/login" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Login</router-link>
          </div>

          <button class="md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t">
        <router-link v-if="authStore.isAuthenticated" to="/feed" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">Feed</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/discovery" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">Discovery</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/messages" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">Messages</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/friends" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">Friends</router-link>
        <router-link v-if="authStore.isAuthenticated && currentUserId" :to="'/profile/' + currentUserId" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">Profile</router-link>
        <button v-if="authStore.isAuthenticated" @click="handleLogout" class="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50">Logout</button>
        <router-link v-else to="/login" class="block px-4 py-2 text-indigo-600 hover:bg-gray-50">Login</router-link>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useRoute } from 'vue-router'
import router from '@/router'
import { authService } from '@/services/authService'
import { supabase } from '@/services/supabaseClient'

const authStore = useAuthStore()
const userStore = useUserStore()
const route = useRoute()
const mobileMenuOpen = ref(false)
const currentUserId = ref<string | null>(null)

const isAuthPage = computed(() => {
  return ['LoginView', 'SignupView'].includes(route.name as string) || 
         route.path === '/login' || 
         route.path === '/signup'
})

onMounted(async () => {
  try {
    console.log('App mounted - initializing auth...')
    // Get the current user from Supabase auth
    const { data } = await supabase.auth.getUser()
    const userId = data.user?.id
    currentUserId.value = userId ?? null
    console.log('Current user ID from auth:', userId)

    // Initialize auth store
    await authStore.initAuth()
    console.log('Auth store initialized, session:', !!authStore.session)
    
    // Load user profile if authenticated - use userId directly
    if (userId) {
      console.log('Loading user profile for:', userId)
      try {
        const profile = await userStore.fetchUser(userId)
        console.log('User profile loaded successfully in App.vue:', profile)
      } catch (err) {
        console.error('Failed to load user profile in App.vue:', err)
      }
    } else {
      console.log('No user ID found, skipping profile load')
    }
  } catch (err) {
    console.error('App init error:', err)
  }

  // Subscribe to auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, 'has session:', !!session)
    currentUserId.value = session?.user?.id ?? null
    
    // Load profile when user logs in
    if (event === 'SIGNED_IN' && session?.user?.id) {
      console.log('User signed in, loading profile:', session.user.id)
      try {
        await userStore.fetchUser(session.user.id)
        console.log('Profile loaded after sign in')
      } catch (err) {
        console.error('Failed to load profile after sign in:', err)
      }
    }
    
    // Clear profile when user logs out
    if (event === 'SIGNED_OUT') {
      console.log('User signed out, clearing profile')
      userStore.setProfile(null as any)
    }
  })
})

onUnmounted(() => {
  // Cleanup auth listener if needed
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (err) {
    console.error('Logout error:', err)
  }
}
</script>