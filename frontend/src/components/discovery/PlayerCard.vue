<template>
  <div
    @click="emit('preview', player)"
    class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg cursor-pointer transition-all"
  >
    <div class="flex items-start gap-3 mb-4">
      <div class="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold flex-shrink-0">
        {{ player.username.charAt(0).toUpperCase() }}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 truncate">{{ player.username }}</h3>
        <p class="text-sm text-gray-500 truncate">@{{ player.username }}</p>
      </div>
    </div>

    <p class="text-sm text-gray-700 mb-3 line-clamp-2">{{ player.bio }}</p>

    <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      </svg>
      <span v-if="player.city">{{ player.city }}</span>
      <span v-if="player.area">, {{ player.area }}</span>
    </div>

    <div class="flex flex-wrap gap-2">
      <span v-for="interest in player.tcg_interests" :key="interest" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
        {{ interest }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiscoveryUser } from '@/types/report'

interface Props {
  player: DiscoveryUser
}

interface Emits {
  (e: 'preview', player: DiscoveryUser): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
