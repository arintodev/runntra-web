<template>
    <div class="w-full min-h-full flex flex-col items-stretch">
        <UContainer class="pt-8">
            <UForm :schema="schema" :state="state">
                <UCard class="max-w-xl mx-auto">
                    <template #header>
                        <div>Create a new race</div>
                    </template>
                    <template #footer>
                        <div class="flex justify-between">
                            <div>
                                <UButton @click="cancel" type="button" size="sm" label="Cancel" variant="outline"
                                    color="neutral" />
                            </div>
                            <div>
                                <UButton size="sm" label="Create race" />
                            </div>
                        </div>
                    </template>

                    <div class="flex flex-col gap-4">
                        <UFormField label="Name" name="name" required>
                            <UInput placeholder="Race name" class="w-full" v-model="state.name" />
                        </UFormField>
                        <div class="grid grid-cols-2 gap-4">
                            <UFormField label="Distance" name="distance" required>
                                <UInput placeholder="Distance" class="w-full" v-model="state.distance">
                                    <template #trailing>
                                        <span>meters</span>
                                    </template>
                                </UInput>
                            </UFormField>
                            <UFormField label="Elevation" name="elevation">
                                <UInput placeholder="Elevation" class="w-full" v-model="state.elevation">
                                    <template #trailing>
                                        <span>meters</span>
                                    </template>
                                </UInput>
                            </UFormField>
                        </div>
                        <UFormField label="Race Type" name="race_type" required>
                            <USelect :items="raceTypes" class="w-full" v-model="state.race_type" placeholder="Select race type"/>
                        </UFormField>
                        <div v-if="['Relay', 'Loop', 'Loop Relay'].includes(state.race_type)" class="grid grid-cols-2 gap-4">
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
        </UContainer>
    </div>
</template>
<script setup lang="ts">
import { z } from 'zod/v4';

const route = useRoute()
const path = `/organizers/${route.params.orgId}/event/${route.params.eventId}`
const raceTypes = ref(['Standard', 'Loop', 'Relay', 'Loop Relay'])

const router = useRouter();

const schema = z.object({
    name: z.string().min(3),
})

const state = reactive({
    id: '',
    name: '',
    race_type: 'Standard',
    distance: null,
    elevation: null,
    loops: null,
    segments: null
})

function cancel() {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.replace(`${path}/races`)
    }
}

function submit() {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.replace(`${path}/races`)
    }
}

type Schema = z.output<typeof schema>

definePageMeta({
    layout: 'event'
})

</script>