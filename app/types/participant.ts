export interface Participant {
  id?: string
  race_id?: string,
  first_name?: string
  last_name?: string | null
  full_name?: string | null
  gender?: string | null
  bib_number?: number | null
  bib_name?: string | null
  country_code?: string | null
  club?: string | null
  chip_id?: string | null,
  details?: {
    email?: string | null 
    phone?: string | null
    dob?: string | null
    ec_phone?: string | null
    ec_name?: string | null
    id_number?: string | null
  }
  event_id?: string | null,
  tenant_id?: string | null
}

export interface ParticipantFormData {
  id?: string
  race_id?: string
  first_name: string
  last_name: string
  gender?: string
  bib_number?: number | null
  bib_name?: string
  country_code: string
  club?: string
  email?: string
  phone?: string
  dob?: string
  ec_phone?: string
  ec_name?: string
  id_number?: string
  chip_id?: string
}