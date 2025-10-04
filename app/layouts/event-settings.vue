<template>
  <NuxtLayout name="event">
    <UContainer class="pt-8">
      <div>
        <h2 class="text-2xl">Event Settings</h2>
      </div>
      <div class="-mx-2 mt-4 border-b border-default">
        <UNavigationMenu
            variant="link"
            highlight
            orientation="horizontal"
            :items="items"
            class="w-full"
        />
      </div>
    </UContainer>
    <slot />
  </NuxtLayout>
</template>
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute()
const path = `/organizers/${route.params.orgId}/event/${route.params.eventId}/settings`

const items: NavigationMenuItem[] = [
  {
    label: 'General',
    to: `${path}`
  },
  {
    label: 'Timing System',
    to: `${path}/timing-system`
  },
]
</script>