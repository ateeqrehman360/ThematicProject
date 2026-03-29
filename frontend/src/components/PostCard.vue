<template>
  <BaseCard class="mb-4">
    <div class="flex items-center gap-3 mb-4">
      <UserAvatar :src="post.authorAvatar" :alt="post.authorName" size="md" />
      <div>
        <p class="font-bold text-gray-900 leading-tight">{{ post.authorName }}</p>
        <p class="text-xs text-gray-500">{{ formatTime(post.timestamp) }}</p>
      </div>
    </div>

    <p class="text-gray-800 mb-4">{{ post.content }}</p>

    <template v-if="post.imageUrl" #header>
      <img :src="post.imageUrl" class="w-full h-64 object-cover" alt="Post image" />
    </template>

    <template #footer>
      <div class="flex items-center gap-6">
        <button class="text-sm font-semibold text-gray-600 hover:text-indigo-600">❤️ {{ post.likes }}</button>
        <button class="text-sm font-semibold text-gray-600 hover:text-indigo-600">💬 {{ post.commentCount }}</button>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './ui/BaseCard.vue';
import UserAvatar from './ui/UserAvatar.vue';

defineProps<{
  post: {
    authorName: string; authorAvatar: string; content: string;
    imageUrl?: string; timestamp: string; likes: number; commentCount: number;
  }
}>();

const formatTime = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
</script>