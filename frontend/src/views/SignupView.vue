<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center px-4 py-8">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      <h1 class="text-3xl font-bold text-center mb-2 text-gray-900">Join Kinship</h1>
      <p class="text-center text-gray-600 mb-8">Find your TCG community</p>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="your_username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="you@example.com"
            @blur="validateEmail"
          />
          <p v-if="emailError" class="text-xs text-red-500 mt-1">{{ emailError }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="••••••••"
            @blur="validatePassword"
          />
          <p v-if="passwordError" class="text-xs text-red-500 mt-1">{{ passwordError }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            v-model="dateOfBirth"
            type="date"
            required
            @blur="validateAge"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <p v-if="ageError" class="text-xs text-red-500 mt-1">{{ ageError }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              v-model="city"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="New York"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <input
              v-model="area"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Manhattan"
            />
          </div>
        </div>

        <p v-if="authStore.error" class="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{{ authStore.error }}</p>

        <button
          type="submit"
          :disabled="authStore.loading || !isFormValid"
          class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
        >
          <span v-if="authStore.loading">Creating account...</span>
          <span v-else>Sign Up</span>
        </button>
      </form>

      <p class="text-center text-gray-600 mt-6">
        Already have an account?
        <router-link to="/login" class="text-indigo-600 font-semibold hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const dateOfBirth = ref('')
const city = ref('')
const area = ref('')
const emailError = ref('')
const passwordError = ref('')
const ageError = ref('')

const isFormValid = computed(() => {
  return username.value && email.value && password.value && 
         dateOfBirth.value && !emailError.value && !passwordError.value && !ageError.value
})

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
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
  } else if (!/[A-Z]/.test(password.value) || !/[0-9]/.test(password.value)) {
    passwordError.value = 'Password must contain uppercase letter and number'
  } else {
    passwordError.value = ''
 

const validateAge = () => {
  if (!dateOfBirth.value) {
  validateAge()
    ageError.value = 'Date of birth is required'
    return false
  }
  
  const today = new Date()
  const birthDate = new Date(dateOfBirth.value)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  if (age < 13) {
    ageError.value = 'You must be at least 13 years old to create an account'
    return false
  }
  
  ageError.value = ''
  return true
} }
}

const handleSignup = async () => {
  validateEmail()
  validatePassword()

  if (!isFormValid.value) return

  try {
    const { useUserStore } = await import('@/stores/userStore')
    const userStore = useUserStore()
    
    await authStore.signup({
      username: username.value,
      email: email.value,
      password: password.value,
      date_of_birth: dateOfBirth.value,
      city: city.value,
      area: area.value
    })
    
    // Get the user ID from session and fetch profile
    if (authStore.session?.user?.id) {
      await userStore.fetchUser(authStore.session.user.id)
    }
    
    // Redirect to /feed after successful signup
    router.push('/feed')
  } catch (err: any) {
    console.error('Signup error:', err)
  }
}
</script>
