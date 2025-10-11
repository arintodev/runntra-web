import { defineStore } from 'pinia'

interface EventRace {
    id: string
    name: string
    race_type: string
    distance: number | null
    elevation: number | null
    loops: number | null
    segments: number | null
    event_id: string
    created_at: string
    updated_at: string
}

interface EventRaceState {
    eventRaces: EventRace[]
    currentRace: EventRace | null
    isLoading: boolean
    error: string | null
}

export const useEventRaceStore = defineStore('eventRace', {
    state: (): EventRaceState => ({
        eventRaces: [],
        currentRace: null,
        isLoading: false,
        error: null
    }),

    getters: {
        raceById: (state) => (id: string) => state.eventRaces.find((race: EventRace) => race.id === id),
        
        // Group races by type for display
        racesByType: (state) => {
            const grouped = state.eventRaces.reduce((acc: Record<string, EventRace[]>, race: EventRace) => {
                const type = race.race_type
                if (!acc[type]) acc[type] = []
                acc[type].push(race)
                return acc
            }, {} as Record<string, EventRace[]>)
            return grouped
        },

        // Format races for command palette
        raceItems: (state) => state.eventRaces.map((race: EventRace) => ({
            label: race.name,
            value: race.id,
            description: `${race.distance}m - ${race.race_type}`
        }))
    },

    actions: {
        async fetchEventRaces(eventId: string) {
            const supabase = useSupabaseClient<any>()
            this.isLoading = true
            this.error = null

            try {
                const { data, error: supabaseError } = await supabase
                    .from('races')
                    .select('*')
                    .eq('event_id', eventId)
                    .order('created_at', { ascending: true })

                if (supabaseError) {
                    throw supabaseError
                }

                this.eventRaces = data || []
            } catch (e: any) {
                this.error = e.message
                const toast = useToast()
                toast.add({
                    color: 'error',
                    title: 'Fetch races failed',
                    description: e.message
                })
            } finally {
                this.isLoading = false
            }
        },

        async fetchRaceDetail(raceId: string): Promise<EventRace | null> {
            const supabase = useSupabaseClient<any>()
            this.isLoading = true
            this.error = null

            try {
                const { data, error: supabaseError } = await supabase
                    .from('races')
                    .select('*')
                    .eq('id', raceId)
                    .single()

                if (supabaseError) {
                    throw supabaseError
                }

                this.currentRace = data
                return data
            } catch (e: any) {
                this.error = e.message
                const toast = useToast()
                toast.add({
                    color: 'error',
                    title: 'Fetch race failed',
                    description: e.message
                })
                return null
            } finally {
                this.isLoading = false
            }
        },

        async createEventRace(race: { name: string, race_type: string, distance: number | null, elevation: number | null, loops: number | null, segments: number | null, event_id: string }) {
            const supabase = useSupabaseClient<any>()
            this.isLoading = true
            this.error = null

            try {
                const timestamp = new Date().toISOString()
                const { data, error: supabaseError } = await supabase
                    .from('races')
                    .insert({
                        ...race,
                        created_at: timestamp,
                        updated_at: timestamp
                    })
                    .select()
                    .single()

                if (supabaseError) {
                    throw supabaseError
                }

                this.eventRaces.push(data)
                const toast = useToast()
                toast.add({
                    color: 'success',
                    title: 'Race created',
                    description: 'Race has been created successfully'
                })

                return data
            } catch (e: any) {
                this.error = e.message
                const toast = useToast()
                toast.add({
                    color: 'error',
                    title: 'Create race failed',
                    description: e.message
                })
                return null
            } finally {
                this.isLoading = false
            }
        },

        async updateEventRace(raceId: string, updates: { name?: string, race_type?: string, distance?: number | null, elevation?: number | null, loops?: number | null, segments?: number | null, event_id?: string }) {
            const supabase = useSupabaseClient<any>()
            this.isLoading = true
            this.error = null

            try {
                const { data, error: supabaseError } = await supabase
                    .from('races')
                    .update({
                        ...updates,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', raceId)
                    .select()
                    .single()

                if (supabaseError) {
                    throw supabaseError
                }

                const index = this.eventRaces.findIndex((r: EventRace) => r.id === raceId)
                if (index !== -1) {
                    this.eventRaces[index] = data
                }
                if (this.currentRace?.id === raceId) {
                    this.currentRace = data
                }

                const toast = useToast()
                toast.add({
                    color: 'success',
                    title: 'Race updated',
                    description: 'Race has been updated successfully'
                })

                return data
            } catch (e: any) {
                this.error = e.message
                const toast = useToast()
                toast.add({
                    color: 'error',
                    title: 'Update race failed',
                    description: e.message
                })
                return null
            } finally {
                this.isLoading = false
            }
        },

        async deleteEventRace(raceId: string) {
            const supabase = useSupabaseClient()
            this.isLoading = true
            this.error = null

            try {
                const { error: supabaseError } = await supabase
                    .from('races')
                    .delete()
                    .eq('id', raceId)

                if (supabaseError) {
                    throw supabaseError
                }

                this.eventRaces = this.eventRaces.filter((r: EventRace) => r.id !== raceId)
                if (this.currentRace?.id === raceId) {
                    this.currentRace = null
                }

                const toast = useToast()
                toast.add({
                    color: 'success',
                    title: 'Race deleted',
                    description: 'Race has been deleted successfully'
                })
            } catch (e: any) {
                this.error = e.message
                const toast = useToast()
                toast.add({
                    color: 'error',
                    title: 'Delete race failed',
                    description: e.message
                })
            } finally {
                this.isLoading = false
            }
        }
    }
})