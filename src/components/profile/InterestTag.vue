<template>
  <span class="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
    {{ interest }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  interest: string
}

defineProps<Props>()
</script>
