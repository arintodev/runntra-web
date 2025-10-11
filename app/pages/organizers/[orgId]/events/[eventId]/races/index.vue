<template>
    <div class="w-full min-h-full flex flex-col items-stretch">
        <UContainer class="pt-8">
            <div>
                <h2 class="text-2xl">Races</h2>
            </div>
            <div class="pt-8">
                <div class="flex justify-between mb-4">
                    <div></div>
                    <div class="flex justify-end">
                        <UButton icon="i-lucide-plus" size="sm" label="New race" @click="isNewRaceModalOpen = true" />
                    </div>
                </div>
                <UModal :dismissible="false" v-model:open="isNewRaceModalOpen" title="Create new race race" description="create a new race">
                    <template #content>
                        <RaceForm :event-id="eventId" @created="onRaceCreated" @cancel="isNewRaceModalOpen = false" />
                    </template>
                </UModal>
                <div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <UCard v-for="item in races" :key="item.id" size="sm">
                            <div class="flex justify-between items-center">
                                <div class="text-highlighted">{{ item.name }}</div>
                                <UPopover>
                                    <UButton icon="i-lucide-more-vertical" variant="ghost" />
                                    <template #content>
                                        <div class="flex flex-col gap-2 p-2">
                                            <UButton variant="link" icon="i-lucide-edit" label="Edit Race" color="neutral" />
                                            <UButton variant="link" icon="i-lucide-user" label="Manage Participants" color="neutral"/>
                                            <USeparator />
                                            <UButton variant="link" label="Delete race" icon="i-lucide-trash" color="error" />
                                        </div>
                                    </template>
                                </UPopover>
                            </div>
                            <div class="mt-3">
                                <div class="text-sm text-dimmed">50 participants</div>
                            </div>
                        </UCard>
                    </div>
                </div>
            </div>
        </UContainer>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    layout: 'event'
})

const route = useRoute()
const eventId = computed(() => route.params.eventId as string)
const eventRaceStore = useEventRaceStore()
const isNewRaceModalOpen = ref(false)

const races = computed(() => eventRaceStore.eventRaces)

// Load races when component mounts
onMounted(async () => {
    await eventRaceStore.fetchEventRaces(eventId.value)
})

// Handle new race creation
const onRaceCreated = async () => {
    isNewRaceModalOpen.value = false
    await eventRaceStore.fetchEventRaces(eventId.value)
}
</script>