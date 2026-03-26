<template>
  <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <span class="text-2xl">🎴</span>
    <span class="font-medium text-gray-900 truncate">{{ card }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  card: string
}

defineProps<Props>()
</script>
