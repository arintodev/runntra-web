<template>
  <NuxtLayout name="organizer">
    <template #sidebar>
      <slot name="sidebar">
        <UDashboardSidebar mode="drawer" :collapsed="true">
          <template #default="{collapsed}">
            <UNavigationMenu :tooltip="true" :collapsed="collapsed" :items="items" orientation="vertical" />
            <USeparator />
            <UNavigationMenu :tooltip="true" :collapsed="collapsed" :items="settingMenus" orientation="vertical" />
          </template>
        </UDashboardSidebar>
      </slot>
    </template>
    <template #breadcrumb>
      <div v-if="route.params.eventId" class="flex gap-1 items-center">
        <div class="text-dimmed mr-1">/</div>
        <div>
          <ULink :to="eventPath" color="neutral" :active="false"
            class="flex gap-2 items-center">
            <UIcon name="i-lucide-box" size="md" />
            <span class="hidden md:inline">{{ eventInfo?.name }}</span>
          </ULink>
        </div>
        <div>
          <UPopover v-model:open="open" :content="{ side: 'bottom', align: 'start' }">
            <UButton icon="i-lucide-chevrons-up-down" color="neutral" variant="ghost" size="sm" @click="open = true" />
            <template #content>
              <UCommandPalette 
                v-model="event" 
                @update:modelValue="handleSelection"
                placeholder="Search..." 
                :groups="[{ id: 'events', items: eventItems }]"
                :loading="eventsLoading"
                @update:searchTerm="handleSearch($event)"
                :ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }">
                <template #footer>
                  <UButton :to="newEventPath" label="New event" block variant="soft" color="neutral" size="sm" icon="i-lucide-plus" />
                </template>
              </UCommandPalette>
            </template>
          </UPopover>
        </div>
      </div>
      <slot name="breadcrumb" />
    </template>
    <slot />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NavigationMenuItem, CommandPaletteItem } from '@nuxt/ui'
import { storeToRefs } from 'pinia'
import { useOrganizerEventStore } from '~/stores/organizerEvent'
import { useEventDetailStore } from '~/stores/eventDetail'

const route = useRoute()
const router = useRouter()
const organizerEventStore = useOrganizerEventStore()
const eventDetailStore = useEventDetailStore()
const eventRaceStore = useEventRaceStore()
const { eventItems, isLoading: eventsLoading } = storeToRefs(organizerEventStore)
const { eventInfo, isLoading: detailLoading } = storeToRefs(eventDetailStore)
const event = ref<CommandPaletteItem | null>(null)
const open = ref(false)

let searchdebounce: ReturnType<typeof setTimeout> | null = null

// Computed properties untuk reaktivitas
const orgId = computed(() => route.params.orgId as string)
const eventId = computed(() => route.params.eventId as string)
const eventPath = computed(() => `/organizers/${orgId.value}/events/${eventId.value}`)
const newEventPath = computed(() => `/organizers/${orgId.value}/events/new`)

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Overview',
    icon: 'i-lucide-home',
    to: `${eventPath.value}`
  },
  {
    label: 'Races',
    icon: 'i-lucide-medal',
    to: `${eventPath.value}/races`
  },
  {
    label: 'Participants',
    icon: 'i-lucide-user',
    to: `${eventPath.value}/participants`
  },
])

const settingMenus = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Crew',
    icon: 'i-lucide-users',
    to: `${eventPath.value}/crew`
  },
  {
    label: 'Event Settings',
    icon: 'i-lucide-settings',
    to: `${eventPath.value}/settings`
  }
])

const handleSearch = (search: string) => {
  if (searchdebounce) clearTimeout(searchdebounce)
  searchdebounce = setTimeout(() => {
    organizerEventStore.searchEvents(search)
  }, 200)
}

const handleSelection = (selected: CommandPaletteItem | null) => {
  if (selected && orgId.value && eventId.value) {
    const path = `/organizers/${orgId.value}/events/${selected.value}`
    router.push(path)
    open.value = false
  }
}

// Watch untuk update event info ketika eventId berubah
watchEffect(() => {
  const activeEvent = eventItems.value.find(event => event.value === eventId.value)
  if (activeEvent) {
    event.value = activeEvent
  }
})

// Watch untuk fetch event detail ketika eventId berubah
watch(() => eventId.value, (newEventId, old) => {
  console.log('Event ID changed:', old, newEventId);
  if (newEventId) {
    eventDetailStore.fetchEventDetail(newEventId)
    eventRaceStore.fetchEventRaces(newEventId)
  }
})

onMounted(async () => {
  if (orgId.value) {
    organizerEventStore.setOrganizerId(orgId.value)
  }
  
  if (eventId.value) {
    eventDetailStore.fetchEventDetail(eventId.value)
    eventRaceStore.fetchEventRaces(eventId.value)
  }
})

const collapsed = ref(true)
</script>