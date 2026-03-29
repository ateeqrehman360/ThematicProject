<template>
  <div 
    class="relative inline-block flex-shrink-0 overflow-hidden bg-indigo-100 rounded-full border-2 border-white shadow-sm"
    :class="[sizeClasses[size]]"
  >
    <img 
      v-if="src" 
      :src="src" 
      :alt="alt" 
      class="h-full w-full object-cover"
    />
    <div v-else class="flex h-full w-full items-center justify-center text-indigo-400 font-bold uppercase">
      {{ alt?.charAt(0) || 'U' }}
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple props for avatar sizing
interface Props {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  alt: 'User'
});

// Mapping sizes to Tailwind classes
const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl'
};
</script>