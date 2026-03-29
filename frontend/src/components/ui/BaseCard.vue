<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div v-if="$slots.header" class="relative">
      <slot name="header" />
    </div>

    <div class="p-5">
      <slot />
    </div>

    <div v-if="$slots.footer" class="px-5 py-4 bg-gray-50 border-t border-gray-100">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Basic card wrapper for the assignment
</script>