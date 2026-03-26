<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in">
        <button @click="emit('close')" class="float-right text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="clear-both flex flex-col items-center mb-4">
          <img :src="player.avatarUrl" :alt="player.fullName" class="w-20 h-20 rounded-full object-cover mb-3" />
          <h2 class="text-2xl font-bold text-gray-900 text-center">{{ player.fullName }}</h2>
          <p class="text-gray-600">@{{ player.username }}</p>
        </div>

        <p class="text-gray-700 text-center mb-4">{{ player.bio }}</p>

        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">📍 {{ player.location }}</p>
        </div>

        <div v-if="player.tcgInterests.length > 0" class="mb-4">
          <p class="text-sm font-semibold text-gray-700 mb-2">Interests:</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="interest in player.tcgInterests" :key="interest" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
              {{ interest }}
            </span>
          </div>
        </div>

        <div class="flex gap-2">
          <router-link :to="`/profile/${player.userId}`" @click="emit('close')" class="flex-1 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-center">
            View Profile
          </router-link>
          <button @click="emit('close')" class="flex-1 py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { DiscoveryUser } from '@/types/report'

interface Props {
  player: DiscoveryUser
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
