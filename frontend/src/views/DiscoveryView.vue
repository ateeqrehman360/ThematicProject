<template>
  <div class="max-w-6xl mx-auto py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Discovery</h1>

    <!-- Search and filters -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
          <input
            v-model="searchName"
            type="text"
            @input="handleSearch"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Search players..."
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              v-model="searchLocation"
              type="text"
              @input="handleSearch"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="City, State"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">TCG Interest</label>
            <select
              v-model="selectedInterest"
              @change="handleSearch"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">All Interests</option>
              <option v-for="tcg in TCG_TAGS" :key="tcg" :value="tcg">{{ tcg }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 mb-8 border-b">
      <button
        v-for="tab in ['players', 'events', 'stores']"
        :key="tab"
        @click="activeTab = tab as any"
        :class="[
          'px-4 py-2 font-semibold capitalize transition-colors',
          activeTab === tab
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Players Tab -->
    <div v-if="activeTab === 'players'">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>

      <div v-else-if="players.length === 0" class="text-center py-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl">
        <svg class="w-20 h-20 mx-auto text-indigo-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">No players found nearby yet</h2>
        <p class="text-gray-600">Check back soon or broaden your search filters to find more TCG players in your area!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PlayerCard
          v-for="player in players"
          :key="player.id"
          :player="player"
          @preview="openPlayerPreview"
        />
      </div>
    </div>

    <!-- Events Tab -->
    <div v-if="activeTab === 'events'">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>

      <div v-else-if="events.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">No events found</p>
      </div>

      <div v-else class="space-y-4">
        <EventCard
          v-for="event in events"
          :key="event.eventId"
          :event="event"
        />
      </div>
    </div>

    <!-- Stores Tab -->
    <div v-if="activeTab === 'stores'">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>

      <div v-else-if="stores.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">No stores found</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StoreCard
          v-for="store in stores"
          :key="store.storeId"
          :store="store"
        />
      </div>
    </div>

    <ProfilePreviewModal
      v-if="showProfilePreview && selectedPlayer"
      :player="selectedPlayer"
      @close="closePlayerPreview"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useDiscovery } from '@/composables/useDiscovery'
import { useUserStore } from '@/stores/userStore'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { TCG_TAGS } from '@/types/interest'
import PlayerCard from '@/components/discovery/PlayerCard.vue'
import EventCard from '@/components/discovery/EventCard.vue'
import StoreCard from '@/components/discovery/StoreCard.vue'
import ProfilePreviewModal from '@/components/discovery/ProfilePreviewModal.vue'

const {
  activeTab,
  players,
  events,
  stores,
  filters,
  loading,
  showProfilePreview,
  selectedPlayer,
  searchPlayers,
  fetchEvents,
  fetchStores,
  openPlayerPreview,
  closePlayerPreview
} = useDiscovery()

const userStore = useUserStore()
const searchName = ref('')
const searchLocation = ref('')
const selectedInterest = ref('')

onMounted(async () => {
  // Ensure user profile is loaded
  if (!userStore.profile) {
    console.log('User profile not loaded in DiscoveryView, loading now...')
    try {
      await useCurrentUser()
      console.log('Profile loaded in DiscoveryView:', userStore.profile)
    } catch (err) {
      console.error('Failed to load profile in DiscoveryView:', err)
    }
  }
  
  await loadInitialData()
})

const loadInitialData = async () => {
  await searchPlayers({})
  await fetchEvents()
  await fetchStores()
}

const handleSearch = async () => {
  if (activeTab.value === 'players') {
    await searchPlayers({
      name: searchName.value,
      location: searchLocation.value,
      interest: selectedInterest.value
    })
  }
}
</script>
