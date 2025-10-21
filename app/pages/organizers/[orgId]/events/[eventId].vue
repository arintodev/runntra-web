<template>
  <NuxtPage />
</template>
<script setup lang="ts">
const route = useRoute()
const eventDetailStore = useEventDetailStore()
const eventStore = useEventStore()
const deviceStore = useDeviceStore()
onMounted(() => {
  if (route.params.eventId) {
    const activeEvent = eventStore.events.find((e) => e.id == route.params.eventId)
    if (activeEvent) {
      eventStore.setActiveEvent(activeEvent)
    }
    eventDetailStore.fetchEventDetail(route.params.eventId as string)
  }
  deviceStore.fetchDevices();
})
</script>