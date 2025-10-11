<template>
	<div class="w-full min-h-full flex flex-col items-stretch">
		<UContainer class="pt-8">
			<div>
				<h2 class="text-2xl">Events</h2>
			</div>
			<div class="pt-8">
				<div class="flex justify-between mb-4">
					<div class="flex">
						<UInput icon="i-lucide-search" size="sm" variant="outline" placeholder="Search..." />
					</div>
					<div class="flex justify-end">
						<UButton :to="`/organizers/${route.params.orgId}/events/new`" icon="i-lucide-plus" size="sm" label="New event" />
					</div>
				</div>
				<div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<ULink v-for="item in events" :to="`/organizers/${route.params.orgId}/events/${item.id}`">
							<UCard>
								<h3 class="text-highlighted">{{ item.name }}</h3>
								<div class="text-sm text-dimmed">25 Jun 2025</div>
								<div class="mt-3 flex justify-between items-center">
									<div class="text-sm">Archived</div>
									<div>
										<UButton icon="i-lucide-arrow-right" variant="ghost" />
									</div>
								</div>
							</UCard>
						</ULink>
					</div>
				</div>
			</div>
		</UContainer>
	</div>
</template>
<script setup lang="ts">
const route = useRoute();

const { events, fetchEvents } = useOrganizerEvents()

onMounted(() => {
	fetchEvents({
		orgId: route.params.orgId as string
	})
})

definePageMeta({
	layout: 'organizer'
})

</script>