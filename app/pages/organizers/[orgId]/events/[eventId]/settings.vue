<template>
  <UContainer>
    <div class="pt-8">
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
    {{ activeItem }}
    <div class="pt-8">
      <NuxtPage />
    </div>
  </UContainer>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'event'
})
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute()
const router = useRouter()
const path = `/organizers/${route.params.orgId}/events/${route.params.eventId}/settings`
const activeItem = ref()

onMounted(() => {
  if (route.path === path) {
    router.replace(`${path}/general`)
  }
})

const items: NavigationMenuItem[] = [
  {
    label: 'General',
    to: `${path}/general`
  },
  {
    label: 'Races',
    to: `${path}/races`
  },
]

</script>