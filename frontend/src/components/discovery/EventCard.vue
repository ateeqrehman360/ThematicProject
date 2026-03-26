<template>
  <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
    <div class="flex items-start justify-between mb-3">
      <h3 class="font-semibold text-gray-900 text-lg">{{ event.name }}</h3>
      <span class="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{{ event.tcgType }}</span>
    </div>

    <p class="text-sm text-gray-700 mb-4">{{ event.description }}</p>

    <div class="space-y-2 text-sm text-gray-600">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ new Date(event.date).toLocaleDateString() }}
      </div>
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        {{ event.location }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '@/types/report'

interface Props {
  event: Event
}

defineProps<Props>()
</script>
