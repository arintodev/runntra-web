<template>
    <UContainer class="py-8 flex flex-col gap-6">
        <UCard title="30K">
            <template #header>
                <div class="flex items-center justify-between">
                    <div>30K</div>
                    <div>
                        <UButton icon="i-lucide-plus" label="Checkpoint" size="sm" @click="() => addCheckpoint()" />
                    </div>
                </div>
            </template>
            <div class="w-full overflow-x-auto pb-2">
                <CustomStepper orientation="horizontal" :items="items" class="w-full" @select="updateCheckpoint">
                    <template #description="{ item }">
                        <div class="text-sm rounded-lg mt-2 p-2 bg-elevated flex flex-col gap-1 m-w-64">
                            <div>
                                <div class="text-muted">Segment</div>
                                <div>2</div>
                            </div>
                            <div>
                                <div class="text-muted">Cut off point</div>
                                <div class="flex items-center gap-4 justify-center mt-1">
                                    <div class="flex items-center gap-2">
                                        <UIcon name="i-lucide-mars" />
                                        <span>4h</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <UIcon name="i-lucide-venus" />
                                        <span>4h</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-sm rounded-lg mt-2 p-2 bg-elevated flex flex-col gap-1">
                            <div class="flex items-center gap-3 justify-center text-nowrap">
                                <UIcon size="md" name="i-lucide-computer" />
                                D0-122-3232
                            </div>
                        </div>
                    </template>
                </CustomStepper>
            </div>
        </UCard>
        <UCard title="50K">
            <template #header>
                50K
            </template>
            <div class="w-full overflow-x-auto pb-2">
                <CustomStepper orientation="horizontal" :items="items" class="w-full">
                    <template #description="{ item }">
                        <div class="text-sm rounded-lg mt-2 p-2 bg-elevated flex flex-col gap-1">
                            <div>
                                <div class="text-muted">Segment</div>
                                <div>2</div>
                            </div>
                            <div>
                                <div class="text-muted">Cut off point</div>
                                <div class="flex items-center gap-4 justify-center mt-1">
                                    <div class="flex items-center gap-2">
                                        <UIcon name="i-lucide-mars" />
                                        <span>4h</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <UIcon name="i-lucide-venus" />
                                        <span>4h</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-sm rounded-lg mt-2 p-2 bg-elevated flex flex-col gap-1">
                            <div class="flex items-center gap-3 justify-center text-nowrap">
                                <UIcon size="md" name="i-lucide-computer" />
                                D0-122-3232
                            </div>
                        </div>
                    </template>
                </CustomStepper>
            </div>
        </UCard>
        <UModal v-model:open="modalOpen" :dismissible="false" title="Checkpoint">
            <template #body>
                <div class="flex flex-col gap-4">
                    <UFormField label="Races" name="race_id" required>
                        <USelectMenu :items="races" class="w-full" placeholder="Select a race"/>
                    </UFormField>
                    <UFormField label="Name" name="name" required>
                        <UInput placeholder="Name" class="w-full" />
                    </UFormField>
                    <UFormField label="Checkpoint type" name="name" required>
                        <USelect :items="checkpointTypes" class="w-full" placeholder="Select checkpoint type"/>
                    </UFormField>
                    <UFormField label="Segment number" name="segment" required>
                        <UInput placeholder="Segment number" class="w-full" />
                    </UFormField>
                    <div class="text-sm font-semibold">Cut off point</div>
                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Male" name="cop_male" required>
                            <UInput placeholder="COP" class="w-full">
                                <template #trailing>
                                    <span>minutes</span>
                                </template>
                            </UInput>
                        </UFormField>
                        <UFormField label="Female" name="cop_female" required>
                            <UInput placeholder="COP" class="w-full">
                                <template #trailing>
                                    <span>minutes</span>
                                </template>
                            </UInput>
                        </UFormField>
                        <UFormField label="As a timing result?" name="is_result">
                            <UCheckbox label="Yes" />
                        </UFormField>
                    </div>
                    <USeparator />
                    <UFormField label="Device" name="device_code" required>
                        <USelectMenu :items="devices" class="w-full" placeholder="Select device"/>
                    </UFormField>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-between w-full">
                    <div>
                        <UButton @click="cancel" type="button" size="sm" label="Cancel" variant="outline" color="neutral" />
                    </div>
                    <div>
                        <UButton size="sm" label="Save checkpoint" />
                    </div>
                </div>
            </template>
        </UModal>
    </UContainer>
</template>
<script setup lang="ts">

definePageMeta({
    layout: 'event-settings'
})

const modalOpen = ref(false)
const races = ['30K', '50K', '80K']
const checkpointTypes = ['Start', 'Checkpoint', 'Finish', 'Loop', 'Relay']
const devices = ref(['D-01234-0001', 'D-01234-0002', 'D-01234-0003', 'D-01234-0004'])

function addCheckpoint() {
    modalOpen.value = true;
}

function updateCheckpoint() {
    modalOpen.value = true;
}

function cancel() {
    modalOpen.value = false;
}

function submit() {
     modalOpen.value = false;
}

const items = ref<any[]>([
    {
        label: '01',
        title: 'Start Line',
        description: 'Kicked off the project with team alignment.',
        icon: 'i-lucide-rocket',
        active: true
    },
    {
        label: '02',
        title: 'Cemoro Kandang',
        description: 'User research and design workshops.',
        icon: 'i-lucide-map-pin'
    },
    {
        label: '03',
        title: 'Puncak Lawu',
        description: 'Frontend and backend development.',
        icon: 'i-lucide-map-pin',
        active: true
    },
    {
        label: '04',
        title: 'Finsih Line',
        description: 'QA testing and performance optimization.',
        icon: 'i-lucide-flag',
        active: true
    }
])
</script>