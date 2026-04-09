<template>
  <div class="max-w-2xl mx-auto py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Edit Profile</h1>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-lg p-8">
      <form @submit.prevent="handleSave" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            v-model="formData.username"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              v-model="formData.city"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Area</label>
            <input
              v-model="formData.area"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            v-model="formData.dateOfBirth"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            v-model="formData.bio"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="Tell us about yourself and your TCG interests..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">TCG Interests</label>
          <div class="space-y-2">
            <label v-for="tcg in TCG_TAGS" :key="tcg" class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="formData.tcgInterests.includes(tcg)"
                @change="toggleInterest(tcg)"
                class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-gray-700">{{ tcg }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="formData.isPrivate"
              class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-gray-700">Private profile (only friends can see posts)</span>
          </label>
        </div>

        <p v-if="error" class="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{{ error }}</p>

        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
          >
            <span v-if="loading">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
          <router-link to="/profile" class="flex-1 py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors text-center">
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { TCG_TAGS } from '@/types/interest'
import type { User } from '@/types/user'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const error = ref('')

const formData = reactive({
  username: '',
  city: '',
  area: '',
  dateOfBirth: '',
  bio: '',
  tcgInterests: [] as string[],
  isPrivate: false
})

onMounted(() => {
  if (userStore.profile) {
    formData.username = userStore.profile.username
    formData.city = userStore.profile.city || ''
    formData.area = userStore.profile.area || ''
    formData.dateOfBirth = formatDateForInput(userStore.profile.date_of_birth)
    formData.bio = userStore.profile.bio || ''
    formData.tcgInterests = [...(userStore.profile.tcg_interests || [])]
    formData.isPrivate = userStore.profile.is_private || false
  }
})

const formatDateForInput = (dateStr: string | undefined): string => {
  if (!dateStr) return ''
  // Convert ISO date format to input date format (YYYY-MM-DD)
  return dateStr.split('T')[0]
}

const toggleInterest = (interest: string) => {
  const index = formData.tcgInterests.indexOf(interest)
  if (index > -1) {
    formData.tcgInterests.splice(index, 1)
  } else {
    formData.tcgInterests.push(interest)
  }
}

const handleSave = async () => {
  loading.value = true
  error.value = ''
  try {
    await userStore.updateProfile({
      username: formData.username,
      city: formData.city,
      area: formData.area,
      date_of_birth: formData.dateOfBirth,
      bio: formData.bio,
      tcg_interests: formData.tcgInterests,
      is_private: formData.isPrivate
    } as Partial<User>)
    router.push('/profile')
  } catch (err: any) {
    error.value = err.message || 'Failed to save profile'
  } finally {
    loading.value = false
  }
}
</script>
