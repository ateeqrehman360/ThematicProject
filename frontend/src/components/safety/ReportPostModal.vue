<template>
  <button
    @click="showModal = true"
    class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
  >
    Report Post
  </button>

  <Teleport v-if="showModal" to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Report Post</h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <select
              v-model="reason"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select a reason</option>
              <option value="harassment">Harassment</option>
              <option value="inappropriate_content">Inappropriate Content</option>
              <option value="spam">Spam</option>
              <option value="fraud">Fraud</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Details (optional)</label>
            <textarea
              v-model="description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Provide additional details about the issue..."
            ></textarea>
          </div>

          <p v-if="error" class="text-sm text-red-500 bg-red-50 p-2 rounded">{{ error }}</p>

          <div class="flex gap-2">
            <button
              type="submit"
              :disabled="!reason || submitting"
              class="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              <span v-if="submitting">Submitting...</span>
              <span v-else>Report</span>
            </button>
            <button
              type="button"
              @click="showModal = false"
              class="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/services/supabaseClient'
import { useUserStore } from '@/stores/userStore'

interface Props {
  postId: string
}

const props = defineProps<Props>()

const userStore = useUserStore()
const showModal = ref(false)
const reason = ref('')
const description = ref('')
const submitting = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!reason.value || !userStore.profile) return

  submitting.value = true
  error.value = ''

  try {
    await supabase.from('reports').insert({
      reporter_id: userStore.profile.id,
      reported_post_id: props.postId,
      reason: reason.value,
      description: description.value,
      status: 'pending'
    })

    showModal.value = false
    reason.value = ''
    description.value = ''
  } catch (err: any) {
    error.value = err.message || 'Failed to submit report'
  } finally {
    submitting.value = false
  }
}
</script>
