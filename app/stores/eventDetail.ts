import { defineStore } from 'pinia'

interface Event {
  id: string
  name: string
  location: string
  start_date: string
  end_date: string
  organizer_id: string
  description: string
  logo_url?: string
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

interface EventState {
  event: Event | null
  isLoading: boolean
  error: string | null
}

export const useEventDetailStore = defineStore('eventDetail', {
  state: (): EventState => ({
    event: null,
    isLoading: false,
    error: null
  }),

  getters: {
    // Format event data for breadcrumb and displays
    eventInfo: (state): { name: string; id: string } | null => {
      if (!state.event) return null
      return {
        name: state.event.name,
        id: state.event.id
      }
    },

    // Check if event can be edited (not completed or cancelled)
    isEditable: (state): boolean => {
      if (!state.event) return false
      return ['draft', 'published'].includes(state.event.status)
    },

    // Format dates for display
    eventDates: (state) => {
      if (!state.event) return null
      return {
        start: new Date(state.event.start_date),
        end: new Date(state.event.end_date)
      }
    }
  },

  actions: {
    async fetchEventDetail(eventId: string) {
      const supabase = useSupabaseClient()
      this.isLoading = true
      this.error = null

      try {
        const { data, error: supabaseError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single()

        if (supabaseError) {
          throw supabaseError
        }

        this.event = data
      } catch (e: any) {
        this.error = e.message
        const toast = useToast()
        toast.add({
          color: 'error',
          title: 'Fetch event failed',
          description: e.message
        })
      } finally {
        this.isLoading = false
      }
    },

    async updateEventDetail(updates: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>) {
      if (!this.event) return

      const supabase = useSupabaseClient()
      this.isLoading = true
      this.error = null

      try {
        const { data, error: supabaseError } = await supabase
          .from('events')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', this.event.id)
          .select()
          .single()

        if (supabaseError) {
          throw supabaseError
        }

        this.event = data
        const toast = useToast()
        toast.add({
          color: 'success',
          title: 'Event updated',
          description: 'Event details have been updated successfully'
        })
      } catch (e: any) {
        this.error = e.message
        const toast = useToast()
        toast.add({
          color: 'error',
          title: 'Update event failed',
          description: e.message
        })
      } finally {
        this.isLoading = false
      }
    },

    clearEvent() {
      this.event = null
      this.error = null
      this.isLoading = false
    }
  }
})