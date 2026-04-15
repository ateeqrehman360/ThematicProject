<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center px-4 py-8">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      <h1 class="text-3xl font-bold text-center mb-2 text-gray-900">Kinship</h1>
      <p class="text-center text-gray-600 mb-8">Welcome back to your TCG community</p>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="you@example.com"
            @blur="validateEmail"
          />
          <p v-if="emailError" class="text-sm text-red-500 mt-1">{{ emailError }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
            @blur="validatePassword"
          />
          <p v-if="passwordError" class="text-sm text-red-500 mt-1">{{ passwordError }}</p>
        </div>

        <p v-if="authStore.error" class="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{{ authStore.error }}</p>

        <button
          type="submit"
          :disabled="authStore.loading || !isFormValid"
          class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
        >
          <span v-if="authStore.loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>

      <p class="text-center text-gray-600 mt-6">
        Don't have an account?
        <router-link to="/signup" class="text-indigo-600 font-semibold hover:underline">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabaseClient'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')

const isFormValid = computed(() => email.value && password.value && !emailError.value && !passwordError.value)

const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Invalid email format'
  } else {
    emailError.value = ''
  }
}

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Password is required'
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
  } else {
    passwordError.value = ''
  }
}

const handleLogin = async () => {
  validateEmail()
  validatePassword()

  if (!isFormValid.value) return

  try {
    // Call Supabase auth directly
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    // Check for authentication error
    if (error) {
      authStore.error = error.message
      return
    }

    // Redirect to feed on successful login
    // Profile will be fetched when needed
    if (data.user?.id) {
      router.push('/feed')
    }
  } catch (err: any) {
    authStore.error = err.message || 'Login failed'
  }
}
</script>
