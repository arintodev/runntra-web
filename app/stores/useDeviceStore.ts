import type { Device } from '../types/race'

export interface DeviceState {
  devices: Device[]
  isLoading: boolean
  error: string | null
}

export const useDeviceStore = defineStore('devices', {
  state: (): DeviceState => ({
    devices: [],
    isLoading: false,
    error: null
  }),
  getters: {
    deviceItems: (state) => state.devices.map((d) => ({value: d.id, label: d.code}))
  },
  
  actions: {
    async fetchDevices() {
      const db = useSupabaseClient<any>()

      this.isLoading = true
      try {
        const { data, error: supabaseError } = await db
          .from('devices')
          .select(`*`)

        if (supabaseError) {
          throw supabaseError
        }
        
        this.devices = data;
      } catch (e: any) {
        const toast = useToast()
        toast.add({
          color: 'error',
          title: 'Fetch devices failed',
          description: e.message
        })
      } finally {
        this.isLoading = false
      }
    }
  }
})