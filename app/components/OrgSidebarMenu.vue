<template>
  <UDashboardSidebar mode="drawer" :collapsed="true">
    <template #default="{ collapsed }">
      <UNavigationMenu type="single" :highlight="false" :tooltip="true" :collapsed="collapsed" :items="menus" orientation="vertical" />
    </template>
  </UDashboardSidebar>
</template>
<script setup lang="ts">
const route = useRoute()
const menus = computed(() => {
const { orgId, eventId } = route.params;

  if (eventId) {
    return [
      [
        {
          label: 'Overview',
          icon: 'i-lucide-home',
          to: `/organizers/${orgId}/events/${eventId}`,
          active: route.path == `/organizers/${orgId}/events/${eventId}`
        },
        {
          label: 'Races',
          icon: 'i-lucide-medal',
          to: `/organizers/${orgId}/events/${eventId}/races`
        },
        {
          label: 'Participants',
          icon: 'i-lucide-user',
          to: `/organizers/${orgId}/events/${eventId}/participants`
        },
      ],
      [
        {
          label: 'Crew',
          icon: 'i-lucide-users',
          to: `/organizers/${orgId}/events/${eventId}/crew`
        },
        {
          label: 'Event Settings',
          icon: 'i-lucide-settings',
          to: `/organizers/${orgId}/events/${eventId}/settings`
        }
      ]
    ]
  }

  return [
    {
      label: 'Events',
      icon: 'i-lucide-boxes',
      to: `/organizers/${orgId}`
    },
    {
      label: 'Team',
      icon: 'i-lucide-users',
      to: `/organizers/${orgId}/team`
    },
    {
      label: 'Organizer Settings',
      icon: 'i-lucide-settings',
      to: `/organizers/${orgId}/settings`
    }
  ]

})

</script>