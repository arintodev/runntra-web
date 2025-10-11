<!-- RaceForm.vue -->
<template>
    <UForm :schema="schema" :state="state" @submit="onSubmit">
        <UCard :class="{ 'max-w-xl mx-auto': !inline }">
            <template #header v-if="!inline">
                <div>{{ isEdit ? 'Edit race' : 'Create a new race' }}</div>
            </template>
            <template #footer v-if="!inline">
                <div class="flex justify-between">
                    <div>
                        <UButton @click="onCancel" type="button" size="sm" label="Cancel" variant="outline"
                            color="neutral" />
                    </div>
                    <div>
                        <UButton type="submit" size="sm" :label="isEdit ? 'Update race' : 'Create race'" />
                    </div>
                </div>
            </template>

            <div class="flex flex-col gap-4">
                <UFormField label="Name" name="name" required>
                    <UInput placeholder="Race name" class="w-full" v-model="state.name" />
                </UFormField>
                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Distance" name="distance" required>
                        <UInput placeholder="Distance" class="w-full" v-model="state.distance" type="number">
                            <template #trailing>
                                <span>meters</span>
                            </template>
                        </UInput>
                    </UFormField>
                    <UFormField label="Elevation" name="elevation">
                        <UInput placeholder="Elevation" class="w-full" v-model="state.elevation" type="number">
                            <template #trailing>
                                <span>meters</span>
                            </template>
                        </UInput>
                    </UFormField>
                </div>
                <UFormField label="Race Type" name="race_type" required>
                    <USelect :items="raceTypes" class="w-full" v-model="state.race_type" placeholder="Select race type" />
                </UFormField>
                <div v-if="['Relay', 'Loop', 'Loop Relay'].includes(state.race_type)"
                    class="grid grid-cols-2 gap-4">
                    <UFormField v-if="['Loop', 'Loop Relay'].includes(state.race_type)" label="Number of loops"
                        name="loops" :required="['Loop', 'Loop Relay'].includes(state.race_type)">
                        <UInputNumber placeholder="Loops" class="w-full" v-model="state.loops" />
                    </UFormField>
                    <UFormField v-if="['Relay', 'Loop Relay'].includes(state.race_type)" label="Number of segments"
                        name="segments" :required="['Relay', 'Loop Relay'].includes(state.race_type)">
                        <UInputNumber placeholder="Segments" class="w-full" v-model="state.segments" />
                    </UFormField>
                </div>
            </div>
        </UCard>
    </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'

interface RaceFormProps {
    raceId?: string
    inline?: boolean // if true, no card wrapper and footer buttons
    onSave?: (data: RaceFormData) => void | Promise<void>
    onCancel?: () => void
}

interface RaceFormData {
    id?: string
    name: string
    race_type: string
    distance: number | string | null
    elevation: number | string | null
    loops: number | null
    segments: number | null
}

const props = withDefaults(defineProps<RaceFormProps>(), {
    inline: false
})

const emit = defineEmits<{
    (e: 'save', data: RaceFormData): void
    (e: 'cancel'): void
}>()

const isEdit = computed(() => !!props.raceId)
const raceTypes = ['Standard', 'Loop', 'Relay', 'Loop Relay']

const schema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    race_type: z.string(),
    distance: z.number().min(0, 'Distance must be positive').nullable(),
    elevation: z.number().nullable(),
    loops: z.number().nullable(),
    segments: z.number().nullable()
}).superRefine((data, ctx) => {
    if (['Loop', 'Loop Relay'].includes(data.race_type) && !data.loops) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Number of loops is required for Loop races',
            path: ['loops']
        })
    }
    if (['Relay', 'Loop Relay'].includes(data.race_type) && !data.segments) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Number of segments is required for Relay races',
            path: ['segments']
        })
    }
})

const state = reactive<RaceFormData>({
    name: '',
    race_type: 'Standard',
    distance: null,
    elevation: null,
    loops: null,
    segments: null
})

// If in edit mode and raceId is provided, fetch race data
const raceStore = useEventRaceStore()
watchEffect(async () => {
    if (props.raceId) {
        const race = await raceStore.fetchRaceDetail(props.raceId)
        if (race) {
            Object.assign(state, race)
        }
    }
})

const onSubmit = () => {
    const data: RaceFormData = {
        ...state,
        id: props.raceId
    }
    if (props.onSave) {
        props.onSave(data)
    } else {
        emit('save', data)
    }
}

const onCancel = () => {
    if (props.onCancel) {
        props.onCancel()
    } else {
        emit('cancel')
    }
}
</script>