import { computed, ref } from 'vue'
import { useDiscoveryStore } from '@/stores/discoveryStore'
import type { Event, Store } from '@/types/report'

export const useDiscovery = () => {
  const discoveryStore = useDiscoveryStore()
  const activeTab = ref<'players' | 'events' | 'stores'>('players')
  const showProfilePreview = ref(false)
  const selectedPlayer = ref<any>(null)
  const events = ref<Event[]>([])
  const stores = ref<Store[]>([])

  const players = computed(() => discoveryStore.players)
  const filters = computed(() => discoveryStore.filters)
  const loading = computed(() => discoveryStore.loading)

  const searchPlayers = async (params: any) => {
    await discoveryStore.searchPlayers(params)
  }

  const fetchEvents = async () => {
    events.value = []
  }

  const fetchStores = async () => {
    stores.value = []
  }

  const openPlayerPreview = (player: any) => {
    selectedPlayer.value = player
    showProfilePreview.value = true
  }

  const closePlayerPreview = () => {
    showProfilePreview.value = false
    selectedPlayer.value = null
  }

  return {
    players,
    activeTab,
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
  }
}
