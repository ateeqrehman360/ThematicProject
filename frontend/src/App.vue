<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-md sticky top-0 z-40">
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
            <router-link v-if="authStore.isAuthenticated" :to="`/profile/${userStore.profile?.userId}`" class="text-gray-700 hover:text-indigo-600 transition-colors">Profile</router-link>
            
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
        <router-link v-if="authStore.isAuthenticated" :to="`/profile/${userStore.profile?.userId}`" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">Profile</router-link>
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'
import { authService } from '@/services/authService'

const authStore = useAuthStore()
const userStore = useUserStore()
const mobileMenuOpen = ref(false)

onMounted(async () => {
  try {
    await authStore.initAuth()
    if (authStore.session?.user?.id) {
      // Fetch user profile if authenticated
      // This would typically fetch from a users table using the auth user ID
    }
  } catch (err) {
    console.error('App init error:', err)
  }
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