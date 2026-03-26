<template>
  <div class="max-w-4xl mx-auto py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Friends</h1>

    <!-- Tabs -->
    <div class="flex gap-4 mb-8 border-b">
      <button
        @click="activeTab = 'friends'"
        :class="[
          'px-4 py-2 font-semibold transition-colors',
          activeTab === 'friends'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        Friends ({{ friends.length }})
      </button>
      <button
        @click="activeTab = 'requests'"
        :class="[
          'px-4 py-2 font-semibold transition-colors',
          activeTab === 'requests'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        Requests ({{ requests.length }})
      </button>
    </div>

    <!-- Friends Tab -->
    <div v-if="activeTab === 'friends'">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>

      <div v-else-if="friends.length === 0" class="text-center py-12 bg-gray-50 rounded-xl">
        <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292m0 0H8.646m3.354 0H16" />
        </svg>
        <p class="text-gray-500 text-lg">No friends yet. Start exploring and adding people!</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="friend in friends"
          :key="friend.userId"
          class="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <router-link :to="`/profile/${friend.userId}`" class="flex items-center gap-3 flex-1 hover:opacity-75">
            <img :src="friend.avatarUrl" :alt="friend.fullName" class="w-12 h-12 rounded-full object-cover" />
            <div>
              <h3 class="font-semibold text-gray-900">{{ friend.fullName }}</h3>
              <p class="text-sm text-gray-500">{{ friend.location }}</p>
            </div>
          </router-link>
          <router-link :to="`/messages/${friend.userId}`" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Message
          </router-link>
        </div>
      </div>
    </div>

    <!-- Requests Tab -->
    <div v-if="activeTab === 'requests'">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>

      <div v-else-if="requests.length === 0" class="text-center py-12 bg-gray-50 rounded-xl">
        <p class="text-gray-500 text-lg">No pending requests</p>
      </div>

      <div v-else class="space-y-3">
        <FriendRequestCard
          v-for="request in requests"
          :key="request.userId"
          :request="request"
          @accept="handleAcceptRequest"
          @reject="handleRejectRequest"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFriends } from '@/composables/useFriends'
import FriendRequestCard from '@/components/friends/FriendRequestCard.vue'

const {
  activeTab,
  friends,
  requests,
  loading,
  loadFriends,
  loadRequests,
  handleAcceptRequest,
  handleRejectRequest
} = useFriends()

onMounted(async () => {
  await loadFriends()
  await loadRequests()
})
</script>
