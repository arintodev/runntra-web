<template>
    <div>
      <div class="rounded-lg ring ring-default">
        <div class="grid grid-cols-1 md:grid-cols-12 p-6">
          <div class="col-span-6 mb-4">General Settings</div>
          <div class="col-span-6 flex flex-col gap-4">
            <UFormField label="Event ID" name="name">
              <UInput disabled placeholder="ID" variant="subtle" class="block" v-model="state.id">
                <template v-if="state.id?.length" #trailing>
                  <UTooltip text="Copy to clipboard">
                    <UButton :color="copied ? 'success' : 'neutral'" variant="link" size="sm"
                      :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'" aria-label="Copy to clipboard"
                      @click="copy(state.id)" />
                  </UTooltip>
                </template>
              </UInput>
            </UFormField>
            <div class="flex flex-col gap-4">
                <UFormField label="Name" name="name" required>
                    <UInput placeholder="Event name" class="w-full" v-model="state.name" />
                </UFormField>
                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Start date" name="start_date" required>
                        <DateInput class="w-full" v-model="state.start_date" />
                    </UFormField>
                    <UFormField label="End date" name="start_date" required>
                        <DateInput class="w-full" v-model="state.end_date" />
                    </UFormField>
                </div>
                <UFormField label="Location" name="location">
                    <UInput placeholder="Location" class="w-full" v-model="state.location" />
                </UFormField>
            </div>
          </div>
        </div>
        <USeparator />
        <div class="px-5 py-4 flex justify-end gap-2">
          <UButton size="sm" label="Cancel" color="neutral" variant="outline" />
          <UButton size="sm" label="Save" />
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    layout: 'event'
})

import { useClipboard } from '@vueuse/core'

const { copy, copied } = useClipboard()
const eventStore = useEventDetailStore();

const state = reactive({
    id: eventStore.event?.id || '',
    name: eventStore.event?.name || '',
    location: eventStore.event?.location || '',
    start_date: eventStore.event?.start_date || null,
    end_date: eventStore.event?.end_date || null
})

// Opsi 1: Sync state dengan store menggunakan watch
watch(() => eventStore.event, (newEvent) => {
    if (newEvent) {
        state.id = newEvent.id || ''
        state.name = newEvent.name || ''
        state.location = newEvent.location || ''
        state.start_date = newEvent.start_date || null
        state.end_date = newEvent.end_date || null
    }
})
</script>