<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Create Post</h2>

        <div class="space-y-4">
          <textarea
            v-model="content"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="What's on your mind? Share about your collection, organize game nights..."
          ></textarea>

          <div class="flex items-center gap-2">
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="handleImageSelect"
              class="hidden"
            />
            <button
              @click="fileInput?.click()"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add Image
            </button>
            <span v-if="imageName" class="text-sm text-gray-600">{{ imageName }}</span>
          </div>

          <p v-if="error" class="text-sm text-red-500 bg-red-50 p-2 rounded">{{ error }}</p>

          <div class="flex gap-2">
            <button
              @click="handleCreate"
              :disabled="loading || !content.trim()"
              class="flex-1 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
            >
              <span v-if="loading">Creating...</span>
              <span v-else>Post</span>
            </button>
            <button
              @click="closeModal"
              class="flex-1 py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Emits {
  (e: 'close'): void
  (e: 'create', content: string, imageUrl?: string): void
}

const emit = defineEmits<Emits>()

const content = ref('')
const imageName = ref('')
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement>()
const loading = ref(false)
const error = ref('')

const handleImageSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    selectedFile.value = file
    imageName.value = file.name
  }
}

const handleCreate = async () => {
  if (!content.value.trim()) {
    error.value = 'Post content cannot be empty'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // In a real app, we'd upload the image first if present
    // For now, just pass empty imageUrl
    emit('create', content.value, '')
    resetForm()
  } catch (err: any) {
    error.value = err.message || 'Failed to create post'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  content.value = ''
  imageName.value = ''
  selectedFile.value = null
  error.value = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}

// Handle Escape key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
