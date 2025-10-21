<template>
  <div v-if="route.params.orgId" class="flex gap-1 items-center">
    <div class="text-dimmed mr-1">/</div>
    <div>
      <ULink :to="`/organizers/${route.params.orgId}`" color="neutral" :active="false" class="flex gap-2 items-center">
        <UIcon name="i-lucide-boxes" size="md" />
        <span class="hidden md:inline">{{ activeOrg?.name }}</span>
      </ULink>
    </div>
    <div>
      <UPopover v-model:open="orgOpen" :content="{ side: 'bottom', align: 'start' }">
        <UButton icon="i-lucide-chevrons-up-down" color="neutral" variant="ghost" size="sm" @click="orgOpen = true" />
        <template #content>
          <UCommandPalette placeholder="Search..." :model-value="orgModel" @update:modelValue="onOrgSelect"
            :groups="[{ id: 'organizers', items: orgStore.organizerItems }]"
            :ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }">
            <template #footer>
              <UButton to="/organizers/new" label="New Organizer" block variant="soft" color="neutral" size="sm"
                icon="i-lucide-plus" />
            </template>
          </UCommandPalette>
        </template>
      </UPopover>
    </div>
  </div>
  <div v-if="route.params.eventId" class="flex gap-1 items-center">
    <div class="text-dimmed mr-1">/</div>
    <div>
      <ULink :to="`/organizers/${route.params.orgId}/events/${route.params.eventId}`" color="neutral" :active="false" class="flex gap-2 items-center">
        <UIcon name="i-lucide-box" size="md" />
        <span class="hidden md:inline">{{ activeEvent?.name }}</span>
      </ULink>
    </div>
    <div>
      <UPopover v-model:open="eventOpen" :content="{ side: 'bottom', align: 'start' }">
        <UButton icon="i-lucide-chevrons-up-down" color="neutral" variant="ghost" size="sm" @click="eventOpen = true" />
        <template #content>
          <UCommandPalette :model-value="eventModel" @update:modelValue="onEventSelect" placeholder="Search..."
            :groups="[{ id: 'events', items: eventItems }]" :loading="eventLoading"
             :ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }">
            <template #footer>
              <UButton :to="`/organizers/${route.params.orgId}/new-event`" label="New event" block variant="soft" color="neutral" size="sm"
                icon="i-lucide-plus" />
            </template>
          </UCommandPalette>
        </template>
      </UPopover>
    </div>
  </div>
</template>
  <script setup lang="ts">
  const orgStore = useOrganizerStore()
  const { activeOrg, isLoading: orgLoading } = storeToRefs(orgStore)
  const eventStore = useEventStore()
  const { activeEvent, isLoading: eventLoading, eventItems } = storeToRefs(eventStore)
  const route = useRoute()
  const router = useRouter()
  const orgOpen = ref(false)
  const eventOpen = ref(false)

  const orgModel = computed(() => ({ value: activeOrg.value?.id, label: activeOrg.value?.name }))
  const eventModel = computed(() => ({ value: activeEvent.value?.id, label: activeEvent.value?.name }))

  const pathLabels = {
    'organizers': {
      'label': 'Organizers'
    },
    'settins': {
      'label': 'Settings'
    }
  }

  interface CommandPaletteItem {
    id?: string
    value?: string
    label?: string
  }

  function onOrgSelect(value: CommandPaletteItem) {
    if (!value?.value || !value?.label) return

    orgStore.setActiveOrg({
      id: value.value,
      name: value.label
    })

    orgOpen.value = false

    router.push(`/organizers/${value.value}`)
  }

  function onEventSelect(value: CommandPaletteItem) {
    if (!value?.value || !value?.label) return

    eventStore.setActiveEvent({
      id: value.value,
      name: value.label
    })

    eventOpen.value = false

    router.push(`/organizers/${value.value}/events/${value.value}`)
  }
</script>