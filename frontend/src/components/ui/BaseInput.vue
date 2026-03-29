<template>
  <div class="flex flex-col gap-1.5 w-full text-left">
    <label v-if="label" class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
      {{ label }}
    </label>
    
    <input
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 shadow-sm"
    />
    
    <span v-if="error" class="text-xs text-red-500 mt-1 ml-1 font-medium">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
// Basic props for the assignment requirement
defineProps<{
  label?: string;
  modelValue?: string;
  error?: string;
}>();

defineEmits(['update:modelValue']);
</script>