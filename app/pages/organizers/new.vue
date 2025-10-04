<template>
	<div class="w-full min-h-full flex flex-col items-stretch">
		<UContainer class="pt-8">
            <UForm :schema="schema">
                <UCard class="max-w-xl mx-auto">
                    <template #header>
                        <div>Create a new organizer</div>
                    </template>
                    <template #footer>
                        <div class="flex justify-between">
                            <div>
                                <UButton @click="cancel" type="button" size="sm" label="Cancel" variant="outline" color="neutral" />
                            </div>
                            <div>
                                <UButton size="sm" label="Create organizer" />
                            </div>
                        </div>
                    </template>

                    <UFormField label="Name" help="What's the name of your company or team?" required>
                        <UInput placeholder="Organizer name" class="w-full" />
                    </UFormField>
                </UCard>
            </UForm>
		</UContainer>
	</div>
</template>
<script setup lang="ts">
import { z } from 'zod/v4';

const router = useRouter();

const schema = z.object({
  name: z.string().min(3),
})

const state = reactive({
  id: '',
  name: '',
})

function cancel() {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.replace('/organizers')
    }
}

function submit() {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.replace('/organizers')
    }
}

type Schema = z.output<typeof schema>

definePageMeta({
	layout: 'dashboard'
})

</script>