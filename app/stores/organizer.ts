import { defineStore } from 'pinia'

interface Organizer {
  id: string
  name: string
  event_count: number
}

interface OrganizerState {
  organizers: Organizer[]
  isLoading: boolean
  error: string | null
}

interface OrganizerItem {
  label: string
  value: string
}

export const useOrganizerStore = defineStore('organizer', {
  state: (): OrganizerState => ({
    organizers: [],
    isLoading: false,
    error: null
  }),

  getters: {
    organizerItems: (state: OrganizerState): OrganizerItem[] => 
      state.organizers.map((org: Organizer) => ({
        label: org.name,
        value: org.id
      }))
  },

  actions: {
    async fetchOrganizers() {
      const supabase = useSupabaseClient()
      this.isLoading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('organizers')
          .select()

        if (error) {
          throw error
        }

        this.organizers = data || []
      } catch (e: any) {
        this.error = e.message
        const toast = useToast()
        toast.add({
          color: 'error',
          title: 'Fetch organizers failed',
          description: e.message
        })
      } finally {
        this.isLoading = false
      }
    }
  }
})