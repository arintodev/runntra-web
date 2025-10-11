import { de } from '@nuxt/ui/runtime/locale/index.js'
import { ref, computed } from 'vue'

type Event = {
  id: string,
  name: string,
  location: string,
  start_date: string,
  end_date: string,
  organizer_id: string
}

interface FetchEventsParams {
  orgId?: string
  page?: number
  search?: string
  perPage?: number
}

export const useOrganizerEvents = () => {
  const events = ref<Event[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const perPage = ref(10)
  const searchQuery = ref('')
  const orgId = ref<string | null>(null)

  // Computed for pagination
  const totalPages = computed(() => Math.ceil(total.value / perPage.value))
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  const fetchEvents = async (params?: FetchEventsParams) => {
    const supabase = useSupabaseClient()
    isLoading.value = true
    error.value = null

    try {
      // Update state with provided params
      if (params) {
        currentPage.value = params.page || currentPage.value
        searchQuery.value = params.search ?? searchQuery.value
        perPage.value = params.perPage || perPage.value
        orgId.value = params.orgId || null
      }

      // Calculate pagination range
      const from = (currentPage.value - 1) * perPage.value
      const to = from + perPage.value - 1

      // Build query
      let query = supabase
        .from('events')
        .select('*', { count: 'exact' })
        .order('start_date', { ascending: false })

      // Add name search if provided
      if (searchQuery.value) {
        query = query.ilike('name', `%${searchQuery.value}%`)
      }

      if (orgId.value) {
        query = query.eq('organizer_id', orgId.value)
      }

      // Add pagination
      query = query.range(from, to)

      const { data, error: supabaseError, count } = await query

      if (supabaseError) {
        throw supabaseError
      }

      events.value = data || []
      if (count !== null) {
        total.value = count
      }
    } catch (e: any) {
      error.value = e.message
      const toast = useToast()
      toast.add({
        color: 'error',
        title: 'Fetch events failed',
        description: e.message
      })
    } finally {
      isLoading.value = false
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      fetchEvents({ page: currentPage.value + 1 })
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      fetchEvents({ page: currentPage.value - 1 })
    }
  }

  const searchEvents = (search: string) => {
    currentPage.value = 1 // Reset to first page when searching
    fetchEvents({ search, page: 1 })
  }

  return {
    // Data
    events,
    isLoading,
    error,
    total,
    currentPage,
    perPage,
    searchQuery,
    // Computed
    totalPages,
    hasNextPage,
    hasPrevPage,
    // Methods
    fetchEvents,
    nextPage,
    prevPage,
    searchEvents
  }
}