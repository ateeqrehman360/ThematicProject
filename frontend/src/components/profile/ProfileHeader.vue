<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div class="h-24 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

    <div class="px-6 pb-6">
      <div class="flex flex-col md:flex-row gap-4 md:-mt-12 md:items-end md:justify-between">
        <div class="flex items-end gap-4">
          <div class="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-indigo-200 flex items-center justify-center text-indigo-700 text-3xl font-bold">
            {{ profile.username.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ profile.username }}</h1>
            <p class="text-gray-600">@{{ profile.username }}</p>
          </div>
        </div>

        <div class="flex gap-2">
          <AddFriendButton v-if="!isOwnProfile" :userId="profile.id" />
          <BlockUserButton v-if="!isOwnProfile" :userId="profile.id" />
          <button v-if="isOwnProfile" @click="goToEdit" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      <div class="mt-6">
        <p class="text-gray-700 text-lg mb-3">{{ profile.bio }}</p>
        <div class="flex gap-6 text-gray-600 text-sm">
          <span v-if="profile.city">📍 {{ profile.city }}<span v-if="profile.area">, {{ profile.area }}</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
import AddFriendButton from '@/components/friends/AddFriendButton.vue'
import BlockUserButton from '@/components/safety/BlockUserButton.vue'

interface Props {
  profile: User
  isOwnProfile: boolean
}

interface Emits {
  (e: 'edit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const goToEdit = () => {
  emit('edit')
}
</script>
