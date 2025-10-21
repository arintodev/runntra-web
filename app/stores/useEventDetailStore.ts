interface EventDetailState {
  event: Event | null
  isLoading: boolean
  error: string | null
}

interface Event {
  id: string
  name: string
  location: string
  start_date: string
  end_date: string
  organizer_id: string
  description: string
  logo?: string | null
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export const useEventDetailStore = defineStore('event-detail', {
  state: (): EventDetailState => ({
    event: null,
    isLoading: false,
    error: null
  }),
  getters: {
    eventInfo: (state) => {
      if (! state.event) return null;

      return {
        id: state.event.id,
        name: state.event.name
      }
    }
  },
  actions: {
    async fetchEventDetail(eventId: string) {
      const db = useSupabaseClient<any>()

      this.isLoading = true
      try {
        const { data, error: supabaseError } = await db
          .from('events')
          .select(`*, races(*, checkpoints(*, devices(*)))`)
          .eq('id', eventId)
          .single()

        if (supabaseError) {
          throw supabaseError
        }

        if (data.races) {
          const raceStore = useRaceStore()
          raceStore.setRaces(data.races)
        }

        delete data.races;
        
        this.event = data;
      } catch (e: any) {
        const toast = useToast()
        toast.add({
          color: 'error',
          title: 'Fetch event failed',
          description: e.message
        })
      } finally {
        this.isLoading = false
      }
    }
  }
})