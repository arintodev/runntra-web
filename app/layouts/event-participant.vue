<template>
    <NuxtLayout name="event">
        <div class="border-b border-default">
            <div class="flex items-stretch">
                <div class="py-4 px-6 border-r border-default w-auto md:w-64">Participants</div>
                <div class="px-6 flex items-center justify-between">
                    <div class="flex gap-2 items-center text-success">
                        <UIcon name="i-lucide-plus" />
                        <span>Category</span>
                    </div>
                    <div class="flex gap-2 items-center text-success hidden">
                        <div>
                            10K
                        </div>
                        <UPopover :content="{ side: 'bottom' }">
                            <UButton icon="i-lucide-chevrons-up-down" color="neutral" variant="ghost" size="sm" />
                        </UPopover>
                    </div>
                </div>
            </div>
        </div>
        <UContainer class="pt-8">
            <div>
                <h2 class="text-2xl">Participants</h2>
            </div>
            <UNavigationMenu :items="items" orientation="horizontal" class="w-full mt-8" />
        </UContainer>
        <slot />
    </NuxtLayout>
</template>
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute()
const path = `/org/${route.params.orgId}/event/${route.params.eventId}`

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