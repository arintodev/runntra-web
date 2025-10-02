<template>
	<div class="w-full min-h-full flex flex-col items-stretch">
		<UContainer class="pt-8">
			<div>
				<h2 class="text-2xl">Organizers</h2>
			</div>
			<div class="pt-8">
				<div class="flex justify-between mb-4">
					<div class="flex">
						<UInput icon="i-lucide-search" size="sm" variant="outline" placeholder="Search..." />
					</div>
					<div class="flex justify-end">
						<UButton icon="i-lucide-plus" size="sm" label="New Organizer" />
					</div>
				</div>
				<div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<ULink :to="`/org/asdfjjkl`">
							<UCard>
								<h3 class="text-highlighted">Siksorogo</h3>
								<div class="mt-3 flex justify-between items-center">
									<div class="text-sm">2 events</div>
									<div>
										<UButton icon="i-lucide-arrow-right" variant="ghost" />
									</div>
								</div>
							</UCard>
						</ULink>
						<ULink :to="`/org/asdfjjkl`">
							<UCard>
								<h3 class="text-highlighted">Konco Lari</h3>
								<div class="mt-3 flex justify-between items-center">
									<div class="text-sm">1 events</div>
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

definePageMeta({
	layout: 'dashboard'
})

</script>