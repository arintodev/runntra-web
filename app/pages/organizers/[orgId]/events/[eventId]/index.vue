<template>
	<div class="w-full min-h-full flex flex-col items-stretch">
		<UContainer class="py-14">
			<div>
				<h2 class="text-2xl text-highlighted">{{ event?.name }}</h2>
			</div>
		</UContainer>
		<USeparator />
	</div>
</template>
<script setup lang="ts">
definePageMeta({
	layout: 'event'
})

const { event } = useEventDetailStore();

</script>