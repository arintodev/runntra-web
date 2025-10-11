<template>
	<div class="w-full min-h-full flex flex-col items-stretch">
		<UContainer class="pt-8">
            <UForm :schema="schema" :state="state" @submit="createOrganizer">
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
                                <UButton type="submit" size="sm" label="Create organizer" />
                            </div>
                        </div>
                    </template>

                    <UFormField name="name" label="Name" help="What's the name of your company or team?" required>
                        <UInput placeholder="Organizer name" class="w-full" v-model="state.name" />
                    </UFormField>
                </UCard>
            </UForm>
		</UContainer>
	</div>
</template>
<script setup lang="ts">
definePageMeta({
	layout: 'dashboard'
})

import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod/v4';

const router = useRouter();
const supabase = useSupabaseClient();
const toast = useToast();

const schema = z.object({
  name: z.string().min(3),
})

const state = reactive({
  name: '',
})

type Schema = z.output<typeof schema>

function cancel() {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.replace('/organizers')
    }
}

async function createOrganizer(payload: FormSubmitEvent<Schema>) {
    const { error } = await supabase.rpc('create_organizer_with_user', {
        name: payload.data.name
    } as any)

    if (error) {
        toast.add({
            color: 'error',
            title: 'Create organizer failed',
        });

        return;
    } 

    if (window.history.length > 1) {
        router.back()
    } else {
        router.replace('/organizers')
    }
}

</script>