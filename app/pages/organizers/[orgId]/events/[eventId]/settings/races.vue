<template>
  <div class="flex flex-col gap-6">
    <UCard v-for="(item, index) in raceStore.eventRaces" :key="item.id" :title="item.name">
      <template #header>
        <div>
          <span class="text-primary">{{ item.name }}</span>
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-12">
        <div class="col-span-6 mb-4">Settings</div>
        <div class="col-span-6 flex flex-col gap-4">
          <UFormField label="Race ID" name="name">
            <UInput disabled placeholder="ID" variant="subtle" class="block" v-model="item.id">
              <template v-if="item.id?.length" #trailing>
                <UTooltip text="Copy to clipboard">
                  <UButton :color="copied ? 'success' : 'neutral'" variant="link" size="sm"
                    :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'" aria-label="Copy to clipboard"
                    @click="copy(item.id)" />
                </UTooltip>
              </template>
            </UInput>
          </UFormField>
          <RaceForm :race="item" :ref="el => raceFormRefs[index] = el" @save="onRaceFormSave" />
          <div class="flex justify-end gap-3 mt-2">
            <UButton size="sm" label="Cancel" color="neutral" variant="outline"
              @click="raceFormRefs[index]?.cancel()" />
            <UButton size="sm" label="Save" @click="raceFormRefs[index]?.save()" />
          </div>
        </div>
      </div>
      <USeparator class="my-6" />
      <div class="flex items-center justify-between my-8">
        <div>Checkpoints</div>
        <div>
          <UButton icon="i-lucide-plus" label="Checkpoint" variant="outline" size="sm" @click="() => addCheckpoint(item.id)" />
        </div>
      </div>
      <div class="w-full overflow-x-auto py-8 rounded-lg bg-elevated">
        <CustomStepper orientation="horizontal" :items="items" class="w-full" @select="updateCheckpoint">
          <template #description="{ item }">
            <div class="text-sm rounded-lg mt-2 p-2 bg-default flex flex-col gap-1 m-w-64">
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
            <div class="text-sm rounded-lg mt-2 p-2 bg-default flex flex-col gap-1">
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
        <CheckpointForm ref="checkpointForm" @save="submit" @cancel="cancel" />
      </template>
      <template #footer>
        <div class="flex justify-between w-full">
          <div>
            <UButton @click="cancel" type="button" size="sm" label="Cancel" variant="outline" color="neutral" />
          </div>
          <div>
            <UButton size="sm" label="Save checkpoint" @click="checkpointFormRef?.save()" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const modalOpen = ref(false)
const checkpointFormRef = useTemplateRef('checkpointForm')
const { copy, copied } = useClipboard()

const raceStore = useEventRaceStore()
const raceFormRefs = ref<any>([])

const supabase = useSupabaseClient()

function addCheckpoint(raceId: string) {
  modalOpen.value = true;
}

function updateCheckpoint() {
  modalOpen.value = true;
}

function cancel() {
  modalOpen.value = false;
}

async function submit(data: any) {
  const { data: checkpoint, error } = await supabase
    .from('race_checkpoints')
    .insert([data])
  modalOpen.value = false;
}

function onRaceFormSave(data: any) {
  raceStore.updateEventRace(data?.id, data)
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