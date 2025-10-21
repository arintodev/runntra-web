<template>
    <NuxtLayout name="organizer">
        <template #breadcrumb>
            <div class="flex gap-1 items-center">
                <div class="text-dimmed mr-1">/</div>
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-plus" />
                    <span class="hidden md:inline">New event</span>
                </div>
            </div>
        </template>
        <div class="w-full min-h-full flex flex-col items-stretch">
            <UContainer class="pt-8">
                <UForm :schema="schema" :state="state" @submit="submit">
                    <UCard class="max-w-xl mx-auto">
                        <template #header>
                            <div>Create a new event</div>
                        </template>
                        <template #footer>
                            <div class="flex justify-between">
                                <div>
                                    <UButton @click="cancel" type="button" size="sm" label="Cancel" variant="outline"
                                        color="neutral" />
                                </div>
                                <div>
                                    <UButton type="submit" size="sm" label="Create event" />
                                </div>
                            </div>
                        </template>
                        <div class="flex flex-col gap-4">
                            <UFormField label="Name" name="name" required>
                                <UInput placeholder="Event name" class="w-full" v-model="state.name" />
                            </UFormField>
                            <div class="grid grid-cols-2 gap-4">
                                <UFormField label="Start date" name="start_date" required>
                                    <DateInput class="w-full" v-model="state.start_date" />
                                </UFormField>
                                <UFormField label="End date" name="start_date" required>
                                    <DateInput class="w-full" v-model="state.end_date" />
                                </UFormField>
                            </div>
                            <UFormField label="Location" name="location">
                                <UInput placeholder="Location" class="w-full" v-model="state.location" />
                            </UFormField>
                        </div>
                    </UCard>
                </UForm>
            </UContainer>
        </div>
    </NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
    layout: false
})

import { z } from 'zod/v4';

const route = useRoute()
const path = `/organizers/${route.params.orgId}`
const router = useRouter();
const supabase = useSupabaseClient()
const toast = useToast()

const schema = z.object({
    name: z.string().min(3),
})

const state = reactive({
    id: '',
    name: '',
    location: '',
    start_date: null,
    end_date: null
})

function cancel() {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.replace(`${path}`)
    }
}

async function submit() {
    const {data, error}: any = await supabase.from('events').insert({
        organizer_id: route.params.orgId,
        name: state.name,
        location: state.location,
        start_date: state.start_date,
        end_date: state.end_date,
        tenant_id: route.params.orgId
    })
    .select('id')
    .single()

    if (error) {
        toast.add({
            title: 'Create event failed',
            description: error.message,
            color: 'error'
        });
        return
    }

    toast.add({
        title: 'Event created',
        color: 'success'
    })

    router.push(`${path}/events/${data?.id}`);
}

type Schema = z.output<typeof schema>

</script>