<template>
  <UContainer>
    <div class="pt-8">
      <div class="rounded-lg ring ring-default">
        <div class="grid grid-cols-1 md:grid-cols-12 p-6">
          <div class="col-span-6 mb-4">General Settings</div>
          <div class="col-span-6 flex flex-col gap-4">
            <UFormField label="Event ID" name="name">
              <UInput disabled placeholder="ID" variant="subtle" class="block">
                <template v-if="event.id?.length" #trailing>
                  <UTooltip text="Copy to clipboard">
                    <UButton :color="copied ? 'success' : 'neutral'" variant="link" size="sm"
                      :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'" aria-label="Copy to clipboard"
                      @click="copy(event.id)" />
                  </UTooltip>
                </template>
              </UInput>
            </UFormField>
            <UFormField label="Event Name" name="name">
              <UInput placeholder="Name" class="block" />
            </UFormField>
          </div>
        </div>
        <USeparator />
        <div class="px-5 py-4 flex justify-end gap-2">
          <UButton size="sm" label="Cancel" color="neutral" variant="outline" />
          <UButton size="sm" label="Save" />
        </div>
      </div>
    </div>
  </UContainer>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'event-settings'
})
import { useClipboard } from '@vueuse/core'

const { copy, copied } = useClipboard()

const route = useRoute();
const event = ref({
  id: "asdfjklmnoprstuvwxz",
  name: "Siksorogo Lawu Ultra 2025"
})

</script>