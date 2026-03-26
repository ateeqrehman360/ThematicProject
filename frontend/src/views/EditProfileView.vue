<template>
  <div class="max-w-2xl mx-auto py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Edit Profile</h1>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-lg p-8">
      <form @submit.prevent="handleSave" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
          <div class="flex items-center gap-4">
            <img v-if="profile?.avatarUrl" :src="profile.avatarUrl" alt="Avatar" class="w-16 h-16 rounded-full object-cover" />
            <div v-else class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <span class="text-gray-600">No image</span>
            </div>
            <input
              type="file"
              accept="image/*"
              @change="handleAvatarUpload"
              class="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          <p v-if="uploadingAvatar" class="text-sm text-indigo-600 mt-2">Uploading...</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              v-model="formData.fullName"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              v-model="formData.location"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
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
              v-model="formData.isPrivateProfile"
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
const uploadingAvatar = ref(false)

const formData = reactive({
  fullName: '',
  location: '',
  bio: '',
  tcgInterests: [] as string[],
  isPrivateProfile: false
})

onMounted(() => {
  if (userStore.profile) {
    formData.fullName = userStore.profile.fullName
    formData.location = userStore.profile.location
    formData.bio = userStore.profile.bio
    formData.tcgInterests = [...userStore.profile.tcgInterests]
    formData.isPrivateProfile = userStore.profile.isPrivateProfile || false
  }
})

const toggleInterest = (interest: string) => {
  const index = formData.tcgInterests.indexOf(interest)
  if (index > -1) {
    formData.tcgInterests.splice(index, 1)
  } else {
    formData.tcgInterests.push(interest)
  }
}

const handleAvatarUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploadingAvatar.value = true
  try {
    await userStore.uploadAvatar(file)
  } catch (err: any) {
    error.value = err.message || 'Failed to upload avatar'
  } finally {
    uploadingAvatar.value = false
  }
}

const handleSave = async () => {
  loading.value = true
  error.value = ''
  try {
    await userStore.updateProfile({
      fullName: formData.fullName,
      location: formData.location,
      bio: formData.bio,
      tcgInterests: formData.tcgInterests,
      isPrivateProfile: formData.isPrivateProfile
    } as Partial<User>)
    router.push('/profile/edit')
  } catch (err: any) {
    error.value = err.message || 'Failed to save profile'
  } finally {
    loading.value = false
  }
}
</script>
