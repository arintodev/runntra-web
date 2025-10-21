import { defineStore } from 'pinia'
import type { Organization } from '~/types/organization'

interface Organizer {
  id: string
  name: string
  event_count?: number
}

interface OrganizerState {
  organizers: Organizer[]
  isLoading: boolean
  activeOrg: Organizer | null
  error: string | null
}

interface OrganizerItem {
  label: string
  value: string
}

export const useOrganizerStore = defineStore('organizer', {
  state: (): OrganizerState => ({
    organizers: [],
    activeOrg: null,
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
    setActiveOrg(org: Organizer) {
      this.activeOrg = {...org}
    },

    async fetchOrganizers() {
      const db = useSupabaseClient()
      const user = useSupabaseUser();
      const route = useRoute();
  
      this.isLoading = true
      this.error = null

      if (!user.value) return

      try {
        const { data, error } = await db
          .from('organizations')
          .select(`*, organization_members!inner(role)`)
          .eq('organization_members.user_id', user.value?.id)

        if (error) {
          throw error
        }

        // Set active organization if orgId exists in route
        if (route.params.orgId && data.length > 0) {
          const activeOrg = data.find((org: Organizer) => org.id === route.params.orgId)
          if (activeOrg) {
            this.activeOrg = activeOrg
          } else {
            const { data: activeOrg, error: activeOrgError } = await db
              .from('organizations')
              .select(`*, organization_members!inner(role)`)
              .eq('organization_members.user_id', user.value?.id)
              .eq('id', route.params.orgId)
              .single()

            if (activeOrgError) {
              throw activeOrgError
            }
  
            data.push(activeOrg)
            this.activeOrg = activeOrg
          }
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
    },

    async createOrganization(payload: Organization) {
      const db = useSupabaseClient<any>()
      const user = useSupabaseUser();
      const toast = useToast()

      try {
        const { data: org, error: orgError } = await db
          .from('organizations')
          .insert({
            name: payload.name,
            website: payload.website,
            phone: payload.phone,
            email: payload.email,
            address: payload.address,
            created_by: user.value?.id
          })
          .select()
          .single()
        
        if (orgError) {
          throw orgError
        }
        
        const { data: member, error: memberError } = await db
          .from('organization_members')
          .insert({
            organization_id: org.id,
            user_id: user.value?.id,
            role: 'owner'
          })
        
        if (memberError) {
          throw memberError
        }

        this.organizers.push(org)
        
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