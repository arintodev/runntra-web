import { defineStore } from 'pinia'

interface OrganizerEvent {
  id: string
  name: string
  location: string
  start_date: string
  end_date: string
  organizer_id: string
}

interface OrganizerEventState {
  organizerEvents: OrganizerEvent[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  organizerId: string | null
  limit: number
}

export const useOrganizerEventStore = defineStore('organizerEvent', {
  state: (): OrganizerEventState => ({
    organizerEvents: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    organizerId: null,
    limit: 10
  }),

  getters: {
    // Filter events locally first based on search query
    filteredEvents(state: OrganizerEventState): OrganizerEvent[] {
      if (!state.searchQuery) return state.organizerEvents.slice(0, state.limit)
      
      const searchLower = state.searchQuery.toLowerCase()
      return state.organizerEvents
        .filter(event => event.name.toLowerCase().includes(searchLower))
        .slice(0, state.limit)
    },

    // Format events for UCommandPalette
    eventItems(state: OrganizerEventState): { label: string; value: string }[] {
      if (!state.searchQuery) {
        return state.organizerEvents.slice(0, state.limit).map(event => ({
          label: event.name,
          value: event.id
        }))
      }
      
      const searchLower = state.searchQuery.toLowerCase()
      return state.organizerEvents
        .filter(event => event.name.toLowerCase().includes(searchLower))
        .slice(0, state.limit)
        .map(event => ({
          label: event.name,
          value: event.id
        }))
    }
  },

  actions: {
    async fetchOrganizerEvents(organizerId?: string) {
      const supabase = useSupabaseClient()
      this.isLoading = true
      this.error = null

      try {
        if (organizerId) {
          this.organizerId = organizerId
        }

        // Build query
        let query = supabase
          .from('events')
          .select('*')
          .limit(this.limit)

        // Filter by organizer_id if available
        if (this.organizerId) {
          query = query.eq('organizer_id', this.organizerId)
        }

        const { data, error: supabaseError } = await query

        if (supabaseError) {
          throw supabaseError
        }

        this.organizerEvents = data || []
      } catch (e: any) {
        this.error = e.message
        const toast = useToast()
        toast.add({
          color: 'error',
          title: 'Fetch organizer events failed',
          description: e.message
        })
      } finally {
        this.isLoading = false
      }
    },

    async searchEvents(search: string) {
      this.searchQuery = search

      // Check for local results first
      const localResults = this.organizerEvents
        .filter(event => event.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, this.limit)

      // If we have enough results locally, don't fetch
      if (localResults.length > 0) return

      // If no local results, fetch from API with search
      const supabase = useSupabaseClient()
      this.isLoading = true
      this.error = null

      try {
        let query = supabase
          .from('events')
          .select('*')
          .limit(this.limit)
          .ilike('name', `%${search}%`)

        if (this.organizerId) {
          query = query.eq('organizer_id', this.organizerId)
        }

        const { data, error: supabaseError } = await query

        if (supabaseError) {
          throw supabaseError
        }

        // Merge new results with existing ones, avoiding duplicates
        const newEvents = (data || []) as OrganizerEvent[]
        const existingIds = new Set(this.organizerEvents.map(e => e.id))
        const uniqueNewEvents = newEvents.filter((event: OrganizerEvent) => !existingIds.has(event.id))
        
        this.organizerEvents = [...this.organizerEvents, ...uniqueNewEvents]
      } catch (e: any) {
        this.error = e.message
        const toast = useToast()
        toast.add({
          color: 'error',
          title: 'Search events failed',
          description: e.message
        })
      } finally {
        this.isLoading = false
      }
    },

    setOrganizerId(organizerId: string) {
      this.organizerId = organizerId
      this.searchQuery = ''
      return this.fetchOrganizerEvents(organizerId)
    },

    clearSearch() {
      this.searchQuery = ''
    }
  }
})