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
    <slot />
  </NuxtLayout>
</template>
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute()

const path = `/org/${route.params.orgId}/event/${route.params.eventId}`

const items: NavigationMenuItem[] = [
  {
    label: 'Overview',
    icon: 'i-lucide-home',
    to: `${path}`
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