<template>
    <NuxtLayout name="event">
        <div class="flex h-full flex-col items-stretch">
            <div class="border-b border-default">
                <div class="flex items-stretch">
                    <div class="py-4 px-6 border-r border-default w-auto md:w-64">Participants</div>
                    <div class="px-6 flex items-center justify-between">
                        <div class="flex gap-2 items-center text-success hidden">
                            <UIcon name="i-lucide-plus" />
                            <span>Category</span>
                        </div>
                        <div class="flex gap-2 items-center text-success">
                            <div>
                                30K
                            </div>
                            <UPopover :content="{ side: 'bottom' }">
                                <UButton icon="i-lucide-chevrons-up-down" color="neutral" variant="ghost" size="sm" />
                                <template #content>
                                    <UCommandPalette v-model="category" placeholder="Search..."
                                        :groups="[{ id: 'categories', items: categories }]"
                                        :ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }">
                                        <template #footer>
                                            <UButton :to="`${path}/races/new`" label="New race" block variant="soft" color="neutral"
                                                size="sm" icon="i-lucide-plus" />
                                        </template>
                                    </UCommandPalette>
                                </template>
                            </UPopover>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-1 w-full overflow-y-auto">
                <slot />
            </div>
        </div>
    </NuxtLayout>
</template>
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute()
const path = `/organizers/${route.params.orgId}/event/${route.params.eventId}`

const category = ref([])

const categories = ref([
    {
        label: '30K',
        value: '1',
    },
    {
        label: '50K',
        value: '2',
    },
    {
        label: '80K',
        value: '3',
    }
])

const items: NavigationMenuItem[] = [
    {
        label: '7K',
        to: `${path}`
    },
    {
        label: '15K',
        to: `${path}/timing-system`
    },
]
</script>