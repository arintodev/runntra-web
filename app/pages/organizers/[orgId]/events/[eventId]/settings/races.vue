<template>
  <div class="flex flex-col gap-6">
    <UCard v-for="(item, index) in races" :key="item.id" :title="item.name">
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
          <RaceForm :race="item" :ref="(el: any) => raceFormRefs[index] = el" @save="onRaceFormSave" />
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
        <CheckpointStepper orientation="horizontal" :items="item.checkpoints || []" class="w-full" @select="updateCheckpoint" />
      </div>
    </UCard>
    <UModal v-model:open="modalOpen" :dismissible="false" title="Checkpoint" @update:open="modalStateUpdate">
      <template #body>
        <CheckpointForm ref="checkpointForm" :data="activeCp" @save="submit" @cancel="cancel" />
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
import type { checkpointFormData } from '~/components/CheckpointForm.vue'
import type { Checkpoint } from '~/types/race'

const modalOpen = ref(false)
const checkpointFormRef = useTemplateRef('checkpointForm')
const { copy, copied } = useClipboard()
const route = useRoute()
const raceStore = useRaceStore();
const { races } = storeToRefs(raceStore)
const raceFormRefs = ref<any>([])

const activeCp = ref();

function addCheckpoint(raceId: string) {
  activeCp.value = {
    race_id: raceId
  }
  modalOpen.value = true;
}

function updateCheckpoint(value: Checkpoint | undefined) {
  if (! value) return;

  activeCp.value = {
    ...value,
    devices: value.devices?.map(d => ({ value: d.id, label: d.code }))
  };
  modalOpen.value = true;
}

function cancel() {
  modalOpen.value = false;
  activeCp.value = undefined;
}

function modalStateUpdate(value: boolean) {
  activeCp.value = undefined;
}

async function submit(data: checkpointFormData) {
  await raceStore.saveCheckpoint({
    ...data,
    event_id: route.params.eventId as string
  })

  modalOpen.value = false;
  activeCp.value = undefined;
}

function onRaceFormSave(data: any) {
  raceStore.updateRace(data)
}


</script>