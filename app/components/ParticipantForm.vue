<template>
  <UForm ref="participantForm" :schema="schema" :state="state" @submit="onSubmit">
    <div class="space-y-4">
      <USeparator label="Personal information" />
      <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
        <UFormField label="First Name" name="first_name">
          <UInput v-model="state.first_name" />
        </UFormField>

        <UFormField label="Last Name" name="last_name">
          <UInput v-model="state.last_name" />
        </UFormField>

        <UFormField label="Gender" name="gender">
          <USelect class="w-full" v-model="state.gender" :items="[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' }
          ]" />
        </UFormField>

        <UFormField label="Date of Birth" name="dob">
          <DateInput v-model="state.dob" class="w-full" />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="state.email" type="email" />
        </UFormField>

        <UFormField label="Phone" name="phone">
          <UInput v-model="state.phone" type="tel" />
        </UFormField>

        <UFormField label="Country" name="country_code">
          <USelect class="w-full" v-model="state.country_code" :items="countryOptions" />
        </UFormField>

        <UFormField label="Club" name="club">
          <UInput v-model="state.club" />
        </UFormField>

        <UFormField label="ID Number" name="id_number">
          <UInput v-model="state.id_number" />
        </UFormField>
      </div>

      <USeparator label="Emergency Contact" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Contact name" name="ec_name">
          <UInput v-model="state.ec_name" />
        </UFormField>

        <UFormField label="Phone" name="ec_phone">
          <UInput v-model="state.ec_phone" type="tel" />
        </UFormField>
      </div>

      <USeparator label="Race Information" />
      <UFormField label="Race" name="race_id">
        <USelect class="w-full" v-model="state.race_id" :items="raceStore.raceItems" />
      </UFormField>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="BIB Number" name="bib_number">
          <UInput v-model="state.bib_number" type="number" />
        </UFormField>

        <UFormField label="BIB Name" name="bib_name">
          <UInput v-model="state.bib_name" />
        </UFormField>

        <UFormField label="Chip ID" name="chip_id">
          <UInput v-model="state.chip_id" />
        </UFormField>
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import countries from '~/data/countries'
import type { Participant, ParticipantFormData } from '~/types/participant'

const form = useTemplateRef('participantForm')
const loading = ref(false)

const raceStore = useRaceStore()

interface ParticipantFormProps {
  data?: Participant
  inline?: boolean // if true, no card wrapper and footer buttons
  submit?: (data: ParticipantFormData) => void | Promise<void>
}

const props = withDefaults(defineProps<ParticipantFormProps>(), {
  inline: false
})

const emit = defineEmits<{
  (e: 'submit', data: ParticipantFormData): void
  (e: 'cancel'): void
}>()

// Validation schema
const schema = z.object({
  race_id: z.string().min(2, 'Race must be seleted'),
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().optional(),
  gender: z.string(),
  bib_number: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined
      return Number(val)
    },
    z.number().min(1).optional()
  ),
  bib_name: z.string().optional(),
  country_code: z.string().optional(),
  club: z.string().optional(),
  email: z.string().optional().refine(
    (val) => !val || val === '' || z.string().email().safeParse(val).success,
    { message: 'Invalid email format' }
  ),
  phone: z.string().optional().refine(
    (val) => !val || val === '' || z.string().min(8).safeParse(val).success,
    { message: 'Invalid phone number' }
  ),
  dob: z.string().optional().refine(
    (val) => !val || val === '' || z.string().regex(/^\d{4}[-\/]\d{2}[-\/]\d{2}$/).safeParse(val).success,
    { message: 'Invalid date format' }
  ),
  ec_phone: z.string().optional(),
  ec_name: z.string().optional(),
  id_number: z.string().optional(),
  chip_id: z.string().optional()
})

// Form state
const state = reactive<ParticipantFormData>({
  race_id: props.data?.race_id,
  first_name: props.data?.first_name || '',
  last_name: props.data?.last_name || '',
  gender: props.data?.gender || '',
  bib_number: props.data?.bib_number,
  bib_name: props.data?.bib_name || '',
  country_code: props.data?.country_code || '',
  club: props.data?.club || '',
  email: props.data?.details?.email || '',
  phone: props.data?.details?.phone || '',
  dob: props.data?.details?.dob || '',
  ec_phone: props.data?.details?.ec_phone || '',
  ec_name: props.data?.details?.ec_name || '',
  id_number: props.data?.details?.id_number || '',
  chip_id: props.data?.chip_id || ''
})

// Convert countries data to options format for USelect
const countryOptions = computed(() =>
  countries.map(country => ({
    label: country.name,
    value: country.code
  }))
)

// Update form when data prop changes
watch(() => props.data, (newData) => {
  if (newData) {
    Object.assign(state, newData)
  }
}, { deep: true })

const onSubmit = async () => {
  loading.value = true
  try {
    const data: ParticipantFormData = {
      ...state,
      id: props.data?.id
    }

    if (props.submit) {
      await props.submit(data)
    } else {
      emit('submit', data)
    }
  } finally {
    loading.value = false
  }
}

function submit() {
  form.value?.submit()
}

defineExpose({
  submit
})
</script>