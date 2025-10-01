<template>
	<div class="w-full min-h-full flex flex-col items-stretch">
		<UContainer class="pt-8">
			<div>
				<h2 class="text-2xl">Organizer Settings</h2>
			</div>
			<div class="pt-8">
				<div class="rounded-lg ring ring-default ">
					<div class="px-5 py-4 flex flex-col md:flex-row justify-between gap-2">
						<div class="text-highlighted">Organizer name</div>
						<div>
							<UInput placeholder="Name" class="md:w-96 block" />
						</div>
					</div>
					<USeparator />
					<div class="px-5 py-4 flex flex-col md:flex-row justify-between gap-2">
						<div class="text-highlighted">Organizer ID</div>
						<div>
							<UInput disabled placeholder="ID" variant="subtle" class="md:w-96 block">
								<template v-if="organizer.id?.length" #trailing>
									<UTooltip text="Copy to clipboard">
										<UButton
											:color="copied ? 'success' : 'neutral'"
											variant="link"
											size="sm"
											:icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
											aria-label="Copy to clipboard"
											@click="copy(organizer.id)"
										/>
									</UTooltip>
								</template>
							</UInput>
						</div>
					</div>
					<USeparator />
					<div class="px-5 py-4 flex justify-end gap-2">
						<UButton size="sm" label="Cancel" color="neutral" variant="outline" />
						<UButton size="sm" label="Save" />
					</div>
				</div>
			</div>
		</UContainer>
	</div>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useClipboard } from '@vueuse/core'
import { z } from 'zod/v4'

const { copy, copied } = useClipboard()

definePageMeta({
	layout: 'organizer'
})

const schema = z.object({
  email: z.string().min(3),
})

const organizer = ref({
	id: 'asdfasdfcfasdfasdfsd'
})

type Schema = z.output<typeof schema>

const state = ref({
  name: '',
})

async function onSubmit(payload: FormSubmitEvent<Schema>) {
	console.log(payload)
}

</script>