<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center px-4 py-8">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      <h1 class="text-3xl font-bold text-center mb-2 text-gray-900">Join Kinship</h1>
      <p class="text-center text-gray-600 mb-8">Find your TCG community</p>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              v-model="firstName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="John"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              v-model="lastName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Doe"
            />
          </div>
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
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select v-model="gender" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              v-model="phoneNumber"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            v-model="address"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="City, State"
          />
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

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const dateOfBirth = ref('')
const gender = ref('')
const phoneNumber = ref('')
const address = ref('')
const emailError = ref('')
const passwordError = ref('')

const isFormValid = computed(() => {
  return firstName.value && lastName.value && email.value && password.value && 
         dateOfBirth.value && gender.value && !emailError.value && !passwordError.value
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
  }
}

const handleSignup = async () => {
  validateEmail()
  validatePassword()

  if (!isFormValid.value) return

  try {
    await authStore.signup({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      dateOfBirth: dateOfBirth.value,
      gender: gender.value,
      address: address.value,
      phoneNumber: phoneNumber.value
    })
    router.push('/feed')
  } catch (err: any) {
    console.error('Signup error:', err)
  }
}
</script>
