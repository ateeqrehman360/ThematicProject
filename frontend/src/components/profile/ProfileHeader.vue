<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div class="h-24 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

    <div class="px-6 pb-6">
      <div class="flex flex-col md:flex-row gap-4 md:-mt-12 md:items-end md:justify-between">
        <div class="flex items-end gap-4">
          <img :src="profile.avatarUrl || defaultAvatar" :alt="profile.fullName || profile.username" class="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ profile.fullName || profile.username }}</h1>
            <p class="text-gray-600">@{{ profile.username }}</p>
          </div>
        </div>

        <div class="flex gap-2">
          <button v-if="!isOwnProfile" disabled class="px-6 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">Add Friend</button>
          <button v-if="isOwnProfile" @click="goToEdit" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      <div class="mt-6">
        <p class="text-gray-700 text-lg mb-3">{{ profile.bio }}</p>
        <div class="flex gap-6 text-gray-600 text-sm">
          <span>📍 {{ [profile.city, profile.area].filter(Boolean).join(', ') || 'Location not set' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'

interface Props {
  profile: User
  isOwnProfile: boolean
}

interface Emits {
  (e: 'edit'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><rect width='96' height='96' fill='%23e5e7eb'/><circle cx='48' cy='36' r='18' fill='%239ca3af'/><path d='M18 82c4-16 20-24 30-24s26 8 30 24' fill='%239ca3af'/></svg>"

const goToEdit = () => {
  emit('edit')
}
</script>
