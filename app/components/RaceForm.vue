<!-- RaceForm.vue -->
<template>
    <UForm ref="raceForm" :schema="schema" :state="state" @submit="onSubmit">
        <div class="flex flex-col gap-4">
            <UFormField label="Name" name="name" required>
                <UInput placeholder="Race name" class="w-full" v-model="state.name" />
            </UFormField>
            <UFormField label="Flag off" name="flag_off" required>
                <DateTimeInput class="w-full" v-model="state.flag_off" show-time format="MMM D, YYYY HH:mm:ss"/>
            </UFormField>
            <div class="grid grid-cols-2 gap-4">
                <UFormField label="Distance" name="distance" required>
                    <UInput placeholder="Distance" class="w-full" v-model="state.distance" type="number">
                        <template #trailing>
                            <span>km</span>
                        </template>
                    </UInput>
                </UFormField>
                <UFormField label="Elevation" name="elevation">
                    <UInput placeholder="Elevation" class="w-full" v-model="state.elevation" type="number">
                        <template #trailing>
                            <span>m</span>
                        </template>
                    </UInput>
                </UFormField>
            </div>
            <UFormField label="Race Type" name="race_type" required>
                <USelect :items="raceTypes" class="w-full" v-model="state.race_type" placeholder="Select race type" />
            </UFormField>
            <div v-if="['Relay', 'Loop', 'Loop Relay'].includes(state.race_type)"
                class="grid grid-cols-2 gap-4">
                <UFormField v-if="['Loop', 'Loop Relay'].includes(state.race_type)" label="Loop target"
                    name="loop_target" :required="['Loop', 'Loop Relay'].includes(state.race_type)">
                    <USelect :items="loopTypes" class="w-full" v-model="state.loop_target" placeholder="Select loop target" />
                </UFormField>
                <template v-if="['Loop', 'Loop Relay'].includes(state.race_type)">
                    <UFormField v-if=" state.loop_target == 'Count'" label="Number of loops"
                        name="loop_count" :required="['Loop', 'Loop Relay'].includes(state.race_type)">
                        <UInputNumber placeholder="Loop count" class="w-full" v-model="state.loop_count" />
                    </UFormField>
                    <UFormField v-if="state.loop_target == 'Time'" label="Duration"
                        name="loop_duration" :required="['Loop', 'Loop Relay'].includes(state.race_type)">
                        <UInput placeholder="Duration" class="w-full" v-model="state.loop_duration" type="number">
                            <template #trailing>
                                <span>minutes</span>
                            </template>
                        </UInput>
                    </UFormField>
                </template>
                <UFormField v-if="['Relay', 'Loop Relay'].includes(state.race_type)" label="Number of segments"
                    name="segments" :required="['Relay', 'Loop Relay'].includes(state.race_type)">
                    <UInputNumber placeholder="Segments" class="w-full" v-model="state.segments" />
                </UFormField>
            </div>
        </div>
    </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'

const form = useTemplateRef('raceForm')

interface RaceFormData {
    id?: string
    name: string
    race_type: string
    distance: number | null
    flag_off: string | null
    elevation: number | null
    loop_target: any
    loop_count: number | null
    loop_duration: number | null
    segments: number | null
}

interface RaceFormProps {
    race?: RaceFormData
    inline?: boolean // if true, no card wrapper and footer buttons
    onSave?: (data: RaceFormData) => void | Promise<void>
    onCancel?: () => void
}

const props = withDefaults(defineProps<RaceFormProps>(), {
    inline: false
})

const emit = defineEmits<{
    (e: 'save', data: RaceFormData): void
    (e: 'cancel'): void
}>()

const isEdit = computed(() => !!props.race?.id)
const raceTypes = ['Standard', 'Loop', 'Relay', 'Loop Relay']
const loopTypes = ['Time', 'Count']

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 3 characters'),
    flag_off: z.string().nullable(),
    race_type: z.string(),
    distance: z.number().min(0, 'Distance must be positive').nullable(),
    elevation: z.number().nullable(),
    loop_target: z.string().nullable(),
    loop_count: z.number().nullable(),
    loop_duration: z.number().nullable(),
    segments: z.number().nullable()
}).superRefine((data, ctx) => {
    if (['Loop', 'Loop Relay'].includes(data.race_type)) {
        if (!data.loop_target) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Loop target is required for Loop',
                path: ['loop_target']
            })

            if (data.loop_target === 'Count' && !data.loop_count) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Number of loops is required for Loop races', 
                    path: ['loop_count']
                })
            } else if (data.loop_target === 'Time' && !data.loop_duration) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Loop duration is required for Time based Loop races',
                    path: ['loop_duration']
                })
            }
        }
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
    name: props.race?.name || '',
    flag_off: props.race?.flag_off || new Date().toISOString(),
    race_type: props.race?.race_type || 'Standard',
    distance: props.race?.distance ? Number(props.race.distance) : null,
    elevation: props.race?.elevation ? Number(props.race.elevation) : null,
    loop_target: props.race?.loop_target || null,
    loop_count: props.race?.loop_count || null,
    loop_duration: props.race?.loop_duration || null,
    segments: props.race?.segments || null
})

// Update form when race prop changes
watch(() => props.race, (newRace) => {
    if (newRace) {
        Object.assign(state, newRace)
    }
}, { deep: true })

const onSubmit = () => {
    const data: RaceFormData = {
        ...state,
        id: props.race?.id
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

function save() {
    form.value?.submit()
}

defineExpose({
    save
})
</script>