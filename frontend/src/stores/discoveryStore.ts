import { defineStore } from 'pinia'
import { ref } from 'vue'
import { discoveryService } from '@/services/discoveryService'
import type { DiscoveryUser } from '@/types/report'

export const useDiscoveryStore = defineStore('discovery', () => {
  const players = ref<DiscoveryUser[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const filters = ref({
    interest: '',
    city: '',
    area: '',
    username: ''
  })

  async function searchPlayers(params: { interest?: string; city?: string; area?: string; username?: string; limit?: number; userId?: string } = {}) {
    loading.value = true
    error.value = null
    try {
      players.value = await discoveryService.searchPlayers(params)
      if (params.interest) filters.value.interest = params.interest
      if (params.city) filters.value.city = params.city
      if (params.area) filters.value.area = params.area
      if (params.username) filters.value.username = params.username
    } catch (err: any) {
      error.value = err.message || 'Failed to search players'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearFilters() {
    filters.value = { interest: '', city: '', area: '', username: '' }
  }

  return {
    players,
    filters,
    loading,
    error,
    searchPlayers,
    clearFilters
  }
})
