export interface Race {
  id: string
  name: string
  race_type: string
  flag_off: string | null
  distance: number | null
  elevation: number | null
  loop_target: string | null
  loop_duration: number | null
  loop_count: number | null
  segments: number | null
  event_id: string
  tenant_id: string
  created_at: string
  updated_at: string
  race_status?: string
  checkpoints?: Checkpoint[]
}

export interface Checkpoint {
  id?: string 
  race_id?: string
  name?: string
  type?: string
  segment?: number | null
  cop_male?: number | null
  cop_female?: number | null
  is_result?: boolean
  distance?: number | null
  elevation?: number | null
  event_id?: string
  created_at?: string
  updated_at?: string
  tenant_id?: string
  devices?: Device[]
}

export interface Device {
  id: string
  code: string
  device_id: string
}