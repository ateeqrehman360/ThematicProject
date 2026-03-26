<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img v-if="store.imageUrl" :src="store.imageUrl" :alt="store.name" class="w-full h-40 object-cover" />
    <div v-else class="w-full h-40 bg-gray-300 flex items-center justify-center">
      <span class="text-gray-500">No image</span>
    </div>

    <div class="p-6">
      <h3 class="font-semibold text-gray-900 text-lg mb-2">{{ store.name }}</h3>
      <p class="text-sm text-gray-700 mb-3">{{ store.description }}</p>

      <div class="flex items-center gap-2 text-sm text-gray-600">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        {{ store.location }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Store } from '@/types/report'

interface Props {
  store: Store
}

defineProps<Props>()
</script>
