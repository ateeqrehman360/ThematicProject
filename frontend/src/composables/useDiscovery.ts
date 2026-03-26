import { computed, ref } from 'vue'
import { useDiscoveryStore } from '@/stores/discoveryStore'

export const useDiscovery = () => {
  const discoveryStore = useDiscoveryStore()
  const activeTab = ref<'players' | 'events' | 'stores'>('players')
  const showProfilePreview = ref(false)
  const selectedPlayer = ref<any>(null)

  const players = computed(() => discoveryStore.players)
  const events = computed(() => discoveryStore.events)
  const stores = computed(() => discoveryStore.stores)
  const filters = computed(() => discoveryStore.filters)
  const loading = computed(() => discoveryStore.loading)

  const searchPlayers = async (params: any) => {
    await discoveryStore.searchPlayers(params)
  }

  const fetchStores = async (location?: string) => {
    await discoveryStore.fetchStores(location)
  }

  const fetchEvents = async (location?: string, tcgType?: string) => {
    await discoveryStore.fetchEvents(location, tcgType)
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
    activeTab,
    players,
    events,
    stores,
    filters,
    loading,
    showProfilePreview,
    selectedPlayer,
    searchPlayers,
    fetchStores,
    fetchEvents,
    openPlayerPreview,
    closePlayerPreview
  }
}
