<template>
  <div class="flex flex-col gap-1.5 w-full text-left">
    <label v-if="label" class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
      {{ label }}
    </label>

    <div class="relative">
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 shadow-sm cursor-pointer"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      
      <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Defining the structure for dropdown options
interface Option {
  label: string;
  value: string | number;
}

defineProps<{
  label?: string;
  modelValue?: string | number;
  options: Option[];
}>();

defineEmits(['update:modelValue']);
</script>