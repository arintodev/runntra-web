<template>
  <NuxtLayout name="dashboard">
    <template #sidebar>
      <slot name="sidebar">
        <UDashboardSidebar mode="drawer" :collapsed="true">
          <template #default="{ collapsed }">
            <UNavigationMenu :tooltip="true" :collapsed="collapsed" :items="items" orientation="vertical" />
          </template>
        </UDashboardSidebar>
      </slot>
    </template>
    <template #breadcrumb>
      <div v-if="route.params.orgId" class="flex gap-1 items-center">
        <div class="text-dimmed mr-1">/</div>
        <div>
          <ULink :to="`/organizers/${route.params.orgId}`" color="neutral" :active="false"
            class="flex gap-2 items-center">
            <UIcon name="i-lucide-boxes" size="md" />
            <span class="hidden md:inline">{{ organizer?.label }}</span>
          </ULink>
        </div>
        <div>
          <UPopover :content="{ side: 'bottom', align: 'start' }">
            <UButton icon="i-lucide-chevrons-up-down" color="neutral" variant="ghost" size="sm" />
            <template #content>
              <UCommandPalette v-model="organizer" placeholder="Search..."
                :groups="[{ id: 'organizers', items: organizerItems }]"
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
      <slot name="breadcrumb" />
    </template>
    <slot />
  </NuxtLayout>
</template>
<script setup lang="ts">
import type { CommandPaletteItem, DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'
import { storeToRefs } from 'pinia'
import { useOrganizerStore } from '~/stores/organizer'

const route = useRoute()
const organizerStore = useOrganizerStore()
const { organizerItems } = storeToRefs(organizerStore)
const organizer = ref<CommandPaletteItem | null>(null)

watchEffect(() => {
  const activeOrg = organizerItems.value.find(org => org.value === route.params.orgId)
  if (activeOrg) {
    organizer.value = activeOrg
  } else if (organizerItems.value.length > 0) {
    organizer.value = organizerItems.value[0] || null
  }
})

const items: NavigationMenuItem[] = [
  {
    label: 'Events',
    icon: 'i-lucide-boxes',
    to: `/organizers/${route.params.orgId}`
  },
  {
    label: 'Team',
    icon: 'i-lucide-users',
    to: `/organizers/${route.params.orgId}/team`
  },
  {
    label: 'Organizer Settings',
    icon: 'i-lucide-settings',
    to: `/organizers/${route.params.orgId}/settings`
  }]


const events = ref([
  {
    label: 'SLU2025',
    value: '1',
  },
  {
    label: 'ROL2025',
    value: '2',
  },
  {
    label: 'SMC2025',
    value: '3',
  }
])
const event = ref([])

onMounted(() => {
  organizerStore.fetchOrganizers()
})


</script>