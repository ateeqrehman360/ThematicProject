<template>
  <div class="space-y-10 pb-20">
    <header>
      <h1 class="text-3xl font-black text-gray-900">Component Style Guide</h1>
      <p class="text-gray-500">Standardized UI library for the Kinship TCG platform.</p>
    </header>

    <section class="p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="space-y-8">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase mb-4">Avatars & Selection</p>
            <div class="flex items-center gap-4 mb-6">
              <UserAvatar size="md" />
              <UserAvatar size="lg" />
              <BaseButton @click="showModal = true" variant="outline">Test Modal</BaseButton>
            </div>
            <BaseSelect label="Favorite TCG" :options="[{label: 'Pokémon', value: 'p'}]" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase mb-4">Form Elements</p>
            <BaseInput label="Test Input" placeholder="Example usage..." />
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-xs font-bold text-gray-400 uppercase">Reusable Card Layout</p>
          <PostCard :post="mockPost" />
        </div>
      </div>
    </section>

    <BaseModal :show="showModal" title="Component Logic Test" @close="showModal = false">
      <p class="text-sm text-gray-600 mb-4">Modal component verification successful.</p>
      <BaseButton @click="showModal = false" fullWidth>Close Guide</BaseButton>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import PostCard from '@/components/PostCard.vue'

const showModal = ref(false)
const mockPost = {
  authorName: 'Design_System',
  authorAvatar: '',
  content: 'This card demonstrates the integration of BaseCard and UserAvatar.',
  timestamp: new Date().toISOString(),
  likes: 10,
  commentCount: 2
}
</script>