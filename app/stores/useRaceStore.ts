import type { Race, Checkpoint } from '../types/race'

export interface RaceState {
  races: Race[]
  isLoading: boolean
  error: string | null
}

export const useRaceStore = defineStore('event-races', {
  state: (): RaceState => ({
    races: [],
    isLoading: false,
    error: null
  }),
  getters: {
    raceItems: (state): { label: string; value: string }[] => {
      const items = [];
      for (const item of state.races) {
        if (item.id) {
          items.push({ label: item.name, value: item.id})
        }
      }

      return items;
    }
  },
  actions: {
    setRaces(races: Race[]) {
      this.races = races.map((r) => {
        r.checkpoints?.sort((a, b) => (a?.distance ?? 0) - (b?.distance ?? 0))
        return r
      })
    },

    async createRace(payload: Race) {
      const db = useSupabaseClient<any>()
      const toast = useToast()
      const orgStore = useOrganizerStore()

      try {
        const { data, error: supabaseError } = await db
          .from('races')
          .insert({
            name: payload.name,
            distance: payload.distance,
            elevation_gain: payload.elevation_gain,
            flag_off: payload.flag_off,
            race_type: payload.race_type,
            loop_target: payload.loop_target,
            loop_duration: payload.loop_duration,
            loop_count: payload.loop_count,
            race_status: payload.race_status,
            segments: payload.segments,
            event_id: payload.event_id,
            tenant_id: orgStore.activeOrg?.id
          })
          .select()
          .single()

        if (supabaseError) {
          throw supabaseError
        }

        this.races.push(data)

        toast.add({
          color: 'success',
          title: 'Race created',
          description: 'Race has been created successfully'
        })

        return data;
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: 'Create race failed',
          description: e.message
        })
      }
    },

    async updateRace(payload: Partial<Race>) {
      const index = this.races.findIndex(r => r.id === payload.id)
      if (index === -1) return

      const db = useSupabaseClient<any>()
      const toast = useToast()

      try {
        const { data, error: supabaseError } = await db
          .from('races')
          .update({
            ...payload,
          })
          .eq('id', payload.id)
          .select()
          .single()

        if (supabaseError) {
          throw supabaseError
        }

        this.races[index] = {
          ...this.races[index],
          ...data
        }

        toast.add({
          color: 'success',
          title: 'Race updated',
          description: 'Race has been updated successfully'
        })

        return data;
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: 'Update race failed',
          description: e.message
        })

        return false;
      }
    },

    async deleteRace(payload: Partial<Race>) {
      const index = this.races.findIndex(r => r.id === payload.id)
      if (index === -1) return

      const db = useSupabaseClient<any>()
      const toast = useToast()

      try {
        const { data, error: supabaseError } = await db
          .from('races')
          .update({
            deleted_at: new Date().toISOString(),
          })
          .eq('id', payload.id)
          .select()

        if (supabaseError) {
          throw supabaseError
        }

        this.races.splice(index, 1);

        toast.add({
          color: 'success',
          title: 'Race deleted',
          description: 'Race has been deleted successfully'
        })

        return data;
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: 'Delete race failed',
          description: e.message
        })
      }
    },

    async saveCheckpoint(payload: Checkpoint) {
      const index = this.races.findIndex(r => r.id === payload.race_id)
      if (index === -1) return

      const db = useSupabaseClient<any>()
      const toast = useToast()
      const payloadDevices = payload?.devices ? [ ...payload.devices ] : [];

      delete payload.devices

      const orgStore = useOrganizerStore()
      const orgId = orgStore.activeOrg?.id;

      if (payload.id) {
        // update checkpoint
        const cpIndex = this.races[index]?.checkpoints?.findIndex(r => r.id === payload.id)
        if (index === -1 || cpIndex == undefined) return

        if (!this.races[index]?.checkpoints?.[cpIndex]) return
        
        try {
          const { data: cp, error: cpError } = await db
            .from('checkpoints')
            .update({
              name: payload.name,
              type: payload.type,
              segment: payload.segment,
              cop_male: payload.cop_male,
              cop_female: payload.cop_female,
              is_result: payload.is_result,
              distance: payload.distance,
              elevation_gain: payload.elevation_gain
            })
            .eq('id', payload.id)
            .select()
            .single()
          
          if (cpError) {
            throw cpError
          }

          await db
            .from('checkpoint_devices') 
            .delete()
            .eq('checkpoint_id', payload.id)

          if (payloadDevices.length) {
            const { data: devices, error: deviceError } = await db
              .from('checkpoint_devices')
              .insert(
                payloadDevices.map(device => ({
                  checkpoint_id: payload.id,
                  device_id: device.id,
                  tenant_id: orgId
                }))
              )
              .select(`devices(*)`);

              if (deviceError) {
                throw deviceError
              }

              cp.devices = devices.map((item: any) => ({ id: item.devices.id, code: item.devices.code }))
          }

          if (this.races[index]) {
            if (this.races[index]?.checkpoints) {
              this.races[index].checkpoints[cpIndex] = cp
              this.races[index].checkpoints.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
            } else {
              this.races[index].checkpoints = [cp]
            }
          }

          toast.add({
            color: 'success',
            title: 'Checkpoint updated',
            description: 'Checkpoint has been created successfully'
          })

          return cp;
        } catch (e: any) {
          toast.add({
            color: 'error',
            title: 'Update checkpoint failed',
            description: e.message
          })
        }
      } else {
        // create checkpoint
        try {
          const { data: cp, error: cpError } = await db
            .from('checkpoints')
            .insert({
              tenant_id: orgId,
              race_id: payload.race_id,
              name: payload.name,
              type: payload.type,
              segment: payload.segment,
              cop_male: payload.cop_male,
              cop_female: payload.cop_female,
              is_result: payload.is_result,
              distance: payload.distance,
              elevation_gain: payload.elevation_gain
            })
            .select()
            .single()

          if (cpError) {
            throw cpError
          }

          if (payloadDevices.length) {
            const { data: devices, error: deviceError } = await db
              .from('checkpoint_devices')
              .insert(
                payloadDevices.map(device => ({
                  checkpoint_id: cp.id,
                  device_id: device.id,
                  tenant_id: orgId,
                }))
              )
              .select(`devices(*)`)

              if (deviceError) {
                throw deviceError
              }

              cp.devices = devices.map((item: any) => ({ id: item.devices.id, code: item.devices.code }))
          }

          if (this.races[index]) {
            if (this.races[index]?.checkpoints) {
              const newCp = [...this.races[index].checkpoints, cp];
              newCp.sort((a, b) => a.distance - b.distance)
              this.races[index].checkpoints = newCp
            } else {
              this.races[index].checkpoints = [cp]
            }
          }

          toast.add({
            color: 'success',
            title: 'Checkpoint created',
            description: 'Checkpoint has been created successfully'
          })

          return cp;
        } catch (e: any) {
          toast.add({
            color: 'error',
            title: 'Create checkpoint failed',
            description: e.message
          })
        }

      }
    },
  }
})