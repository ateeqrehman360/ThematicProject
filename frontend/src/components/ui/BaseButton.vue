<template>
  <button 
    :type="type"
    :disabled="loading || disabled"
    class="relative inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
    :class="[
      variant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : '',
      variant === 'outline' ? 'bg-white border-indigo-600 text-indigo-600 hover:bg-indigo-50' : '',
      variant === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' : '',
      fullWidth ? 'w-full' : ''
    ]"
  >
    <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    
    <slot />
  </button>
</template>

<script setup lang="ts">
// Defining props so other teammates can change how the button looks
interface Props {
  variant?: 'primary' | 'outline' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  fullWidth: false,
  loading: false,
  disabled: false
});
</script>