import type { Event } from "~/types/event"

interface EventState {
  events: Event[],
  activeEvent: Event | null
  isLoading: boolean
  error: string | null
}

interface EventItem {
  label: string
  value: string
}

export const useEventStore = defineStore('events', {
state: (): EventState => ({
    events: [],
    activeEvent: null,
    isLoading: false,
    error: null
  }),

  getters: {
    eventItems: (state: EventState): EventItem[] => {
      const items: EventItem[] = [];
      for (const item of state.events) {
        if (item.id) {
          items.push({ label: item.name, value: item.id})
        }
      }

      return items;
    }
  },

  actions: {
    setActiveEvent(org: Event) {
      this.activeEvent = {...org}
    },

    async fetchEvents() {
      const db = useSupabaseClient()
      const route = useRoute();
  
      this.isLoading = true
      this.error = null

      if (!route.params.orgId) return

      try {
        const { data, error } = await db
          .from('events')
          .select(`*`)
          .eq('tenant_id', route.params.orgId)

        if (error) {
          throw error
        }

        // Set active organization if orgId exists in route
        if (route.params.eventId && data.length > 0) {
          const activeEvent = data.find((event: Event) => event.id === route.params.eventId)
          if (activeEvent) {
            this.activeEvent = activeEvent
          } else {
            const { data: activeEvent, error: activeEventError } = await db
              .from('events')
              .select(`*`)
              .eq('tenant_id', route.params.orgId)
              .eq('id', route.params.eventId)
              .single()

            if (activeEventError) {
              throw activeEventError
            }
  
            data.push(activeEvent)
            this.activeEvent = activeEvent
          }
        }

        this.events = data || []
      } catch (e: any) {
        this.error = e.message
        const toast = useToast()
        toast.add({
          color: 'error',
          title: 'Fetch events failed',
          description: e.message
        })
      } finally {
        this.isLoading = false
      }
    }
  }
})