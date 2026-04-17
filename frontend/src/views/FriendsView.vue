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

      <div v-else-if="friends.length === 0" class="text-center py-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl">
        <svg class="w-20 h-20 mx-auto text-indigo-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 9v3m0 0v3m0-3h3m0 0h3m0-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">You haven't added any friends yet</h2>
        <p class="text-gray-600 mb-6">Start exploring and connecting with other players in your area!</p>
        <router-link
          to="/discovery"
          class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Head to Discovery
        </router-link>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="friend in friends"
          :key="friend.id"
          class="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <router-link :to="`/profile/${friend.id}`" class="flex items-center gap-3 flex-1 hover:opacity-75">
            <div class="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              {{ friend.username.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ friend.username }}</h3>
              <p class="text-sm text-gray-500">{{ friend.city }}{{ friend.area ? `, ${friend.area}` : '' }}</p>
            </div>
          </router-link>
          <router-link :to="`/messages/${friend.id}`" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
          :key="request.id"
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
import { useUserStore } from '@/stores/userStore'
import { useCurrentUser } from '@/composables/useCurrentUser'
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

const userStore = useUserStore()

onMounted(async () => {
  // Ensure user profile is loaded
  if (!userStore.profile) {
    console.log('User profile not loaded in FriendsView, loading now...')
    try {
      await useCurrentUser()
      console.log('Profile loaded in FriendsView:', userStore.profile)
    } catch (err) {
      console.error('Failed to load profile in FriendsView:', err)
    }
  }
  
  await loadFriends()
  await loadRequests()
})
</script>
