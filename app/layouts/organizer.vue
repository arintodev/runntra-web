<template>
  <NuxtLayout name="dashboard">
    <template #sidebar>
      <OrgSidebarMenu />
    </template>
    <template #breadcrumb>
      <OrgNavbarMenu />
    </template>
    <div class="pb-8">
      <slot />
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import OrgSidebarMenu from '~/components/OrgSidebarMenu.vue'
import { useOrganizerStore } from '~/stores/useOrganizerStore'

const route = useRoute()
const organizerStore = useOrganizerStore()
const eventStore = useEventStore()

onMounted(() => {
  organizerStore.fetchOrganizers()
  if (route.params.eventId) {
     eventStore.fetchEvents()
  }
})


</script>