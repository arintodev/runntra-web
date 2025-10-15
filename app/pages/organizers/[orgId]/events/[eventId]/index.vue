<template>
	<div class="w-full min-h-full flex flex-col items-stretch">
		<UContainer class="py-8 flex flex-col md:py-14 md:flex-row md:justify-between gap-4">
			<div>
				<h2 class="text-2xl text-highlighted">{{ eventStore.event?.name }}</h2>
			</div>
			<div>
				<UButton :to="`/organizers/${route.params.orgId}/events/${route.params.eventId}/settings/general`" variant="outline" label="Settings" icon="i-lucide-settings" />
			</div>
		</UContainer>
		<USeparator />
	</div>
</template>
<script setup lang="ts">
definePageMeta({
	layout: 'event'
})

const eventStore = useEventDetailStore();
const route = useRoute();

</script>