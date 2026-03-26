import { defineStore } from 'pinia'
import { ref } from 'vue'
import { discoveryService } from '@/services/discoveryService'
import type { DiscoveryUser, Store, Event } from '@/types/report'

export const useDiscoveryStore = defineStore('discovery', () => {
  const players = ref<DiscoveryUser[]>([])
  const stores = ref<Store[]>([])
  const events = ref<Event[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const filters = ref({
    interest: '',
    location: '',
    name: ''
  })

  async function searchPlayers(params: { interest?: string; location?: string; name?: string; limit?: number } = {}) {
    loading.value = true
    error.value = null
    try {
      players.value = await discoveryService.searchPlayers(params)
      if (params.interest) filters.value.interest = params.interest
      if (params.location) filters.value.location = params.location
      if (params.name) filters.value.name = params.name
    } catch (err: any) {
      error.value = err.message || 'Failed to search players'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchStores(location?: string, limit?: number) {
    loading.value = true
    error.value = null
    try {
      stores.value = await discoveryService.fetchStores(location, limit)
      if (location) filters.value.location = location
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch stores'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchEvents(location?: string, tcgType?: string, limit?: number) {
    loading.value = true
    error.value = null
    try {
      events.value = await discoveryService.fetchEvents(location, tcgType, limit)
      if (location) filters.value.location = location
      if (tcgType) filters.value.interest = tcgType
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch events'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearFilters() {
    filters.value = { interest: '', location: '', name: '' }
  }

  return {
    players,
    stores,
    events,
    filters,
    loading,
    error,
    searchPlayers,
    fetchStores,
    fetchEvents,
    clearFilters
  }
})
