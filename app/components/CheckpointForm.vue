<template>
  <UForm ref="checkpointForm" :schema="schema" :state="state" @submit="onSubmit">
    <div class="flex flex-col gap-4">
      <UFormField label="Races" name="race_id" required>
        <USelectMenu :items="races" class="w-full" placeholder="Select a race" v-model="state.race_id" />
      </UFormField>
      <UFormField label="Name" name="name" required>
        <UInput placeholder="Name" class="w-full" v-model="state.name" />
      </UFormField>
      <UFormField label="Type" name="type" required>
        <USelect :items="checkpointTypes" class="w-full" placeholder="Select type" v-model="state.type" />
      </UFormField>
      <UFormField label="Segment number" name="segments">
        <UInput placeholder="Segment number" class="w-full" v-model="state.segment" type="number"/>
      </UFormField>
      <div class="text-sm font-semibold">Cut off point</div>
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Male" name="cop_male" required>
          <UInput placeholder="COP" class="w-full" v-model="state.cop_male" type="number" >
            <template #trailing>
              <span>minutes</span>
            </template>
          </UInput>
        </UFormField>
        <UFormField label="Female" name="cop_female" required>
          <UInput placeholder="COP" class="w-full" v-model="state.cop_female" type="number" >
            <template #trailing>
              <span>minutes</span>
            </template>
          </UInput>
        </UFormField>
        <UFormField label="As a timing result?" name="is_result">
          <UCheckbox label="Yes" v-model="state.is_result" />
        </UFormField>
      </div>
      <USeparator />
      <UFormField label="Device" name="device_id" required>
        <USelectMenu :items="devices" class="w-full" placeholder="Select device" v-model="state.device_id" />
      </UFormField>
    </div>
  </UForm>
</template>
<script setup lang="ts">
import { z } from 'zod'

const races = ['30K', '50K', '80K']
const checkpointTypes = ['Start', 'Checkpoint', 'Finish', 'Loop', 'Relay']
const devices = ref(['D-01234-0001', 'D-01234-0002', 'D-01234-0003', 'D-01234-0004'])

const form = useTemplateRef('checkpointForm')

interface checkpointFormData {
    id?: string | undefined
    race_id: string | undefined
    name: string | undefined
    type: string | undefined
    cop_male: number | null
    cop_female: number | null
    segment: number | null
    device_id: string | undefined
    is_result: boolean
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
    segment: props.data?.segment || null,
    is_result: props.data?.is_result || true,
    device_id: props.data?.device_id || ''
})

// Update form when race prop changes
watch(() => props.data, (newRace) => {
    if (newRace) {
        Object.assign(state, newRace)
    }
}, { deep: true })

const onSubmit = () => {
    const data: checkpointFormData = {
        ...state,
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