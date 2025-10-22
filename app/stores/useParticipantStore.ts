import { defineStore } from 'pinia'
import type { Participant } from '~/types/participant'

interface ParticipantState {
  participants: Participant[]
  isLoading: boolean
  error: string | null
}

export const useParticipantStore = defineStore('participant', {
  state: (): ParticipantState => ({
    participants: [],
    isLoading: false,
    error: null
  }),

  getters: {

  },

  actions: {
    async fetchParticipants() {
      const sb = useSupabaseClient()
      const user = useSupabaseUser();
      const route = useRoute();
      
      const { orgId, eventId } = route.params
  
      this.isLoading = true
      this.error = null

      if (!user.value) return

      try {
        const { data, error } = await sb.from('participants')
          .select(`
            *,
            participant_details(*)
          `)
          .eq('tenant_id', orgId as string)
          .eq('event_id', eventId as string)
          .order('bib_number')
        
        if (error) {
          throw error
        }

        this.participants = data.map((p: any) => ({ ...p, full_name: `${p.first_name} ${p.last_name}`}));
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
    },

    async importParticipant(file: File) {
      const sb = useSupabaseClient()
      const toast = useToast()
      const route = useRoute()

      try {
        const { orgId, eventId } = route.params
        const filePath = `${orgId}/${eventId}/imports/${Date.now()}-${file.name}`

        const { error } = await sb.storage
          .from('data-transfer')
          .upload(filePath, file, {
            cacheControl: 'no-cache',
            upsert: false,
            contentType: 'text/csv',
          })

        if (error) {
          toast.add({
            color: "error",
            title: "Upload import file failed",
            description: error.message
          })
          return
        }

        const { data, error: fnError } = await sb.functions.invoke('participant-import', {
          body: { orgId, eventId, path: filePath },
        })
        if (fnError) {
          toast.add({
            color: "error",
            title: "Upload import file failed",
            description: fnError.message
          })
          return;
        }

        toast.add({
          color: "success",
          title: "Import participant success",
          description: `${data.total} participant imported`
        })
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: 'Create organization failed',
          description: e.message
        })
      }
    }
  }
})