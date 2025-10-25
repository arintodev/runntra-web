import { defineStore } from 'pinia'
import type { Participant, ParticipantFormData } from '~/types/participant'
import { FunctionsHttpError } from '@supabase/supabase-js'

interface ParticipantState {
  participants: Participant[]
  isLoading: boolean
  error: string | null
  filter: {
    keyword: string | null
  }
}

export const useParticipantStore = defineStore('participant', {
  state: (): ParticipantState => ({
    participants: [],
    isLoading: false,
    error: null,
    filter: {
      keyword: null
    }
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
        let query = sb.from('participants')
          .select(`
            *,
            details:participant_details(*)
          `)
          .eq('tenant_id', orgId as string)
          .eq('event_id', eventId as string)
          .order('bib_number')

        if (this.filter.keyword && this.filter.keyword.trim() !== '') {
          const kw = this.filter.keyword.trim()
          query = query.or(
            `first_name.ilike.%${kw}%,last_name.ilike.%${kw}%`
          )
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        this.participants = data.map((p: any) => ({ ...p, full_name: `${p.first_name || ''} ${p.last_name || ''}` }));
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
          body: { tenant_id: orgId, event_id: eventId, path: filePath },
        })
       
        if (fnError) {
          let errorMsg = fnError.message;
          if (fnError instanceof FunctionsHttpError) {
            const errorMessage = await fnError.context.json()
            if (errorMessage.error) {
              errorMsg = errorMessage.error
            }
          }
          toast.add({
            color: "error",
            title: "Batch update file failed",
            description: errorMsg
          })
          return;
        }

        toast.add({
          color: "success",
          title: "Import participant success",
          description: `${data.count} participant imported`
        })
      
        await this.fetchParticipants()
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: 'Import participant failed',
          description: e.message
        })
      }
    },

    async exportParticipant() {
      const sb = useSupabaseClient<any>()
      const toast = useToast()
      const route = useRoute()

      toast.add({
        id: 'exportLoading',
        title: 'Exporting...',
        description: 'Please wait while we generate CSV',
        icon: 'i-lucide-refresh-cw animate-spin',
        color: 'primary',
        duration: Infinity,
      })

      try {
        const { data, error } = await sb.functions.invoke('participant-export', {
          body: {
            filter: this.filter,
            tenant_id: route.params.orgId,
            event_id: route.params.eventId
          }
        })

        if (error) {
          throw error
        }

        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)

        toast.remove('exportLoading')

        toast.add({
          title: "Export ready",
          description: "Click to download CSV",
          icon: "i-lucide-check-circle",
          color: "success",
          progress: false,
          duration: Infinity,
          actions: [
            {
              label: "Download",
              icon: "i-lucide-download",
              onClick: () => {
                const link = document.createElement('a')
                link.href = url
                link.download = `participant-${new Date().toISOString()}.csv`
                link.click()
                URL.revokeObjectURL(url)
              }
            }
          ]
        })
      } catch (e: any) {
        toast.remove('exportLoading')

        toast.add({
          color: 'error',
          title: 'Export participant failed',
          description: e.message
        })
      }
    },

    async batchUpdate(file: File) {
      const sb = useSupabaseClient()
      const toast = useToast()
      const route = useRoute()

      try {
        const { orgId, eventId } = route.params
        const filePath = `${orgId}/${eventId}/batch-update/${Date.now()}-${file.name}`

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
            title: "Upload batch-update file failed",
            description: error.message
          })
          return
        }

        const { data, error: fnError } = await sb.functions.invoke('participant-import', {
          body: { tenant_id: orgId, event_id: eventId, path: filePath },
        })

        if (fnError) {
          let errorMsg = fnError.message;
          if (fnError instanceof FunctionsHttpError) {
            const errorMessage = await fnError.context.json()
            if (errorMessage.error) {
              errorMsg = errorMessage.error
            }
          }
          toast.add({
            color: "error",
            title: "Batch update file failed",
            description: errorMsg
          })
          return;
        }

        toast.add({
          color: "success",
          title: "Batch update success",
          description: `${data.count} participant updated`
        })

        await this.fetchParticipants()
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: 'Batch update failed',
          description: e.message
        })
      }
    },

    async saveParticipant(payload: ParticipantFormData) {
      const sb = useSupabaseClient<any>()
      const toast = useToast()
      const route = useRoute()

      if (payload.id) {
        // update participant
        const index = this.participants.findIndex((p) => p.id == payload.id)

        if (index == -1) {
          return
        }

        try {
          const updatePayload = {
            race_id: payload.race_id,
            first_name: payload.first_name,
            last_name: payload.last_name || null,
            gender: payload.gender || null,
            country_code: payload.country_code || null,
            club: payload.club || null,
            bib_number: payload.bib_number || null,
            bib_name: payload.bib_name || null,
            chip_id: payload.chip_id || null,
          }

          const detailPayload = {
            id: payload.id,
            dob: payload.dob || null,
            email: payload.email || null,
            phone: payload.phone || null,
            ec_name: payload.ec_name || null,
            ec_phone: payload.ec_phone || null,
            id_number: payload.id_number || null,
            tenant_id: route.params.orgId as string,
            event_id: route.params.eventId as string
          }

          const { error } = await sb
            .from('participants')
            .update(updatePayload)
            .eq('id', payload.id)

          if (error) {
            throw error
          }

          const { error: detailError } = await sb
            .from('participant_details')
            .upsert(detailPayload)
            .eq('id', payload.id)

          if (detailError) {
            throw detailError
          }

          this.participants[index] = {
            ...this.participants[index],
            ...updatePayload,
            details: {
              ...this.participants[index]?.details,
              ...detailPayload
            },
            full_name: `${updatePayload.first_name} ${updatePayload.last_name}`
          }

          toast.add({
            color: 'success',
            title: 'Update participant success',
            description: 'Participant has been updated'
          })
        } catch (e: any) {
          toast.add({
            color: 'error',
            title: 'Update participant failed',
            description: e.message
          })
        }
      } else {
        // create new participant
        try {
          const createPayload = {
            race_id: payload.race_id,
            first_name: payload.first_name,
            last_name: payload.last_name || null,
            gender: payload.gender || null,
            country_code: payload.country_code || null,
            club: payload.club || null,
            bib_number: payload.bib_number || null,
            bib_name: payload.bib_name || null,
            chip_id: payload.chip_id || null,
            tenant_id: route.params.orgId,
            event_id: route.params.eventId
          }

          const detailPayload = {
            dob: payload.dob || null,
            email: payload.email || null,
            phone: payload.phone || null,
            ec_name: payload.ec_name || null,
            ec_phone: payload.ec_phone || null,
            id_number: payload.id_number || null,
            tenant_id: route.params.orgId,
            event_id: route.params.eventId
          }

          const { data, error } = await sb
            .from('participants')
            .insert(createPayload)
            .select('id')
            .single()

          if (error) {
            throw error
          }

          const { error: detailError } = await sb
            .from('participant_details')
            .insert({
              ...detailPayload,
              id: data.id,
            })

          if (detailError) {
            throw detailError
          }

          toast.add({
            color: 'success',
            title: 'Create participant success',
            description: 'Participant has been updated'
          })

          await this.fetchParticipants()
        } catch (e: any) {
          toast.add({
            color: 'error',
            title: 'Create participant failed',
            description: e.message
          })
        }
      }
    },

    async deleteParticipant(participantId: string) {
      const sb = useSupabaseClient<any>()
      const toast = useToast()

      const index = this.participants.findIndex((p) => p.id == participantId)

      if (index == -1) {
        return
      }

      try {
        const { error } = await sb
          .from('participants')
          .delete()
          .eq('id', participantId)

        if (error) {
          throw error
        }

        toast.add({
          color: 'success',
          title: 'Delete participant success',
          description: 'Participant has been deleted'
        })

        await this.fetchParticipants()
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: 'Delete participant failed',
          description: e.message
        })
      }
    }
  }
})