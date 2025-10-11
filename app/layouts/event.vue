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
          <ULink :to="`/organizers/${route.params.orgId}/events/${route.params.eventId}`" color="neutral" :active="false"
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
                  <UButton :to="`/organizers/${route.params.orgId}/events/new`" label="New event" block variant="soft" color="neutral" size="sm" icon="i-lucide-plus" />
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
const { eventItems, isLoading: eventsLoading } = storeToRefs(organizerEventStore)
const { eventInfo, isLoading: detailLoading } = storeToRefs(eventDetailStore)
const event = ref<CommandPaletteItem | null>(null)
const open = ref(false)

const path = `/organizers/${route.params.orgId}/events/${route.params.eventId}`

let searchdebounce: ReturnType<typeof setTimeout> | null = null;

const handleSearch = (search: string) => {
  if (searchdebounce) clearTimeout(searchdebounce);
  searchdebounce = setTimeout(() => {
    organizerEventStore.searchEvents(search)
  }, 200);
}

const handleSelection = (selected: CommandPaletteItem | null) => {
  if (selected) {
    const orgId = route.params.orgId
    const eventId = selected.value
    if (orgId && typeof orgId === 'string' && eventId && typeof eventId === 'string') {
      const path = `/organizers/${orgId}/events/${eventId}`
      router.push(path)
    }
    open.value = false
  }
}

watchEffect(() => {
  const activeEvent = eventItems.value.find(event => event.value === route.params.eventId)
  if (activeEvent) {
    event.value = activeEvent
  }
})

onMounted(async () => {
  const orgId = route.params.orgId
  const eventId = route.params.eventId
  
  if (orgId && typeof orgId === 'string') {
    await organizerEventStore.setOrganizerId(orgId)
  }
  
  if (eventId && typeof eventId === 'string') {
    await eventDetailStore.fetchEventDetail(eventId)
  }
})

const items: NavigationMenuItem[] = [
  {
    label: 'Overview',
    icon: 'i-lucide-home',
    to: `${path}`
  },
  {
    label: 'Races',
    icon: 'i-lucide-medal',
    to: `${path}/races`
  },
  {
    label: 'Participants',
    icon: 'i-lucide-user',
    to: `${path}/participants`
  },
]

const settingMenus: NavigationMenuItem[] = [
  {
    label: 'Crew',
    icon: 'i-lucide-users',
    to: `${path}/crew`
  },
  {
    label: 'Event Settings',
    icon: 'i-lucide-settings',
    to: `${path}/settings`
  }
]

const collapsed = ref(true)
</script>