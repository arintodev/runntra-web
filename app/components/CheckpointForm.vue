<template>
  <UForm ref="checkpointForm" :schema="schema" :state="state" @submit="onSubmit">
    <div class="flex flex-col gap-4">
      <UFormField label="Races" name="race_id" required>
        <USelect :disabled="props.data?.id ? true : false" :items="raceItems" class="w-full" placeholder="Select a race" v-model="state.race_id" />
      </UFormField>
      <UFormField label="Name" name="name" required>
        <UInput placeholder="Name" class="w-full" v-model="state.name" />
      </UFormField>
      <UFormField label="Type" name="type" required>
        <USelect :items="checkpointTypes" class="w-full" placeholder="Select type" v-model="state.type" />
      </UFormField>
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Distance" name="distance" required>
          <UInput placeholder="Distance" class="w-full" v-model="state.distance" type="number">
            <template #trailing>
              <span>km</span>
            </template>
          </UInput>
        </UFormField>
        <UFormField label="Elevation" name="elevation" required>
          <UInput placeholder="Elevation" class="w-full" v-model="state.elevation" type="number">
            <template #trailing>
              <span>m</span>
            </template>
          </UInput>
        </UFormField>
      </div>
      <UFormField label="Segment number" name="segments">
        <UInput placeholder="Segment number" class="w-full" v-model="state.segment" type="number" />
      </UFormField>
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="COP Male" name="cop_male" required>
          <UInput placeholder="COP" class="w-full" v-model="state.cop_male" type="number">
            <template #trailing>
              <span>minutes</span>
            </template>
          </UInput>
        </UFormField>
        <UFormField label="COP Female" name="cop_female" required>
          <UInput placeholder="COP" class="w-full" v-model="state.cop_female" type="number">
            <template #trailing>
              <span>minutes</span>
            </template>
          </UInput>
        </UFormField>
      </div>
      <UFormField label="As a timing result?" name="is_result">
        <UCheckbox label="Yes" v-model="state.is_result" />
      </UFormField>
      <USeparator />
      <UFormField label="Device" name="device_id" required>
        <USelectMenu :items="deviceItems" multiple class="w-full" placeholder="Select device" v-model="state.devices" />
      </UFormField>
    </div>
  </UForm>
</template>
<script setup lang="ts">
import { z } from 'zod'

const checkpointTypes = ['Start', 'Checkpoint', 'Finish', 'Loop', 'Relay']
const deviceStore = useDeviceStore()
const { deviceItems } = storeToRefs(deviceStore)
const raceStore = useRaceStore()
const { raceItems } = storeToRefs(raceStore);

const form = useTemplateRef('checkpointForm')

export interface checkpointFormData {
  id?: string
  race_id?: string,
  name?: string,
  type?: string,
  cop_male?: number | null
  cop_female?: number | null
  distance?: number | null
  elevation?: number | null
  segment?: number | null
  devices?: Array<any>,
  is_result?: boolean
}

interface checkpointFormProps {
  data?: checkpointFormData
  inline?: boolean // if true, no card wrapper and footer buttons
  onSave?: (data: checkpointFormData) => void | Promise<void>
  onCancel?: () => void
}

const props = withDefaults(defineProps<checkpointFormProps>(), {
  inline: false
})

const emit = defineEmits<{
  (e: 'save', data: checkpointFormData): void
  (e: 'cancel'): void
}>()

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  race_id: z.string(),
  type: z.string(),
  cop_male: z.number().min(0, 'COP must be positive').nullable(),
  cop_female: z.number().min(0, 'COP must be positive').nullable(),
  segment: z.number().nullable(),
  is_result: z.boolean().nullable()
})

const state = reactive<checkpointFormData>({
  name: props.data?.name || undefined,
  race_id: props.data?.race_id || undefined,
  type: props.data?.type || undefined,
  cop_male: props.data?.cop_male ? Number(props.data.cop_male) : null,
  cop_female: props.data?.cop_female ? Number(props.data.cop_female) : null,
  segment: props.data?.segment ? Number(props.data?.segment) : null,
  elevation: props.data?.elevation ? Number(props.data?.elevation) : null,
  distance: props.data?.distance ? Number(props.data?.distance) : null,
  is_result: props.data?.is_result || true,
  devices: props.data?.devices || []
})

// Update form when race prop changes
watch(() => props.data, (newData) => {
  if (newData) {
    Object.assign(state, newData)
  }
}, { deep: true })

const onSubmit = () => {
  const payload = { ...state }
  payload.devices = payload.devices?.map((d) => ({ id: d.value, code: d.label}))

  const data: checkpointFormData = {
    ...payload,
    id: props.data?.id
  }
  if (props.onSave) {
    props.onSave(data)
  } else {
    emit('save', data)
  }
}

function save() {
  form.value?.submit()
}

defineExpose({
  save
})
</script>