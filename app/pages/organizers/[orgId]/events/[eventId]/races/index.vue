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
            <UButton icon="i-lucide-plus" size="sm" label="New race" @click="createRace" />
          </div>
        </div>
        <UModal :dismissible="false" v-model:open="isNewRaceModalOpen" title="Create new race">
          <template #body>
            <RaceForm :race="race" ref="raceFormRef" @save="onSave" />
          </template>
          <template #footer>
            <div class="flex justify-between w-full">
              <div>
                <UButton @click="cancel" type="button" size="sm" label="Cancel" variant="outline" color="neutral" />
              </div>
              <div>
                <UButton size="sm" label="Create race" @click="raceFormRef?.save()" />
              </div>
            </div>
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
                      <UButton variant="link" icon="i-lucide-user" label="Manage Participants" color="neutral" />
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
  layout: 'organizer'
})

const route = useRoute()
const eventId = computed(() => route.params.eventId as string)
const raceStore = useRaceStore()
const isNewRaceModalOpen = ref(false)
const races = computed(() => raceStore.races)
const raceFormRef = useTemplateRef('raceFormRef')
const race = ref<any>()

function createRace() {
  isNewRaceModalOpen.value = true;
  race.value = {
    event_id: eventId.value
  }
}

function cancel() {
  race.value = {}
  isNewRaceModalOpen.value = false;
}

async function onSave(data: any) {
  await raceStore.createRace(data)
  isNewRaceModalOpen.value = false;
}
</script>