<template>
    <UDashboardGroup>
        <div class="flex flex-col h-screen w-screen">
            <UDashboardNavbar title="Runntra">
                <template #left>
                    <div class="flex gap-2 items-center">
                        <div>Runntra</div>
                        <slot name="breadcrumb" />
                    </div>
                </template>
                <template #right>
                    <div class="flex items-center justifiy-end gap-2">
                        <UDropdownMenu :items="userMenu" :content="{
                            align: 'end',
                            side: 'bottom',
                            sideOffset: 8
                        }">
                            <UUser :avatar="{
                                src: 'https://i.pravatar.cc/150?u=john-doe',
                                icon: 'i-lucide-image'
                            }" />
                            <template #content-top>
                                <div class="p-2">
                                    <UUser name="John Doe" :description="user?.email" :avatar="{
                                        src: 'https://i.pravatar.cc/150?u=john-doe',
                                        icon: 'i-lucide-image'
                                    }" />
                                </div>
                                <USeparator />
                            </template>
                        </UDropdownMenu>
                    </div>
                </template>
            </UDashboardNavbar>
            <div class="flex flex-1 w-full overflow-y-hidden">
                <div class="h-full">
                    <slot name="sidebar">
                    </slot>
                </div>
                <div class="flex-grow h-full overflow-y-auto">
                    <slot />
                </div>
            </div>
        </div>
    </UDashboardGroup>
</template>
<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items: NavigationMenuItem[] = [
    {
        label: 'Events',
        icon: 'i-lucide-boxes',
        to: `/org/${route.params.orgId}`
    },
    {
        label: 'Team',
        icon: 'i-lucide-users',
        to: `/org/${route.params.orgId}/team`
    },
    {
        label: 'Organizer Settings',
        icon: 'i-lucide-settings',
        to: `/org/${route.params.orgId}/settings`
    }]

const user = useSupabaseUser();

const userMenu = ref<DropdownMenuItem[][]>([
    [
        {
            label: 'Profile',
            icon: 'i-lucide-user'
        },
        {
            label: 'Races',
            icon: 'i-lucide-medal',
            to: '/my-races'
        },
        {
            label: 'Events',
            icon: 'i-lucide-calendar-1',
            to: '/my-events'
        },
        {
            label: 'Organizers',
            icon: 'i-lucide-boxes',
            to: '/organizers'
        },
    ],
    [
        {
            label: 'Log out',
            type: 'link'
        }
    ]
])
const organizers = ref([
    {
        label: 'Siksorogo',
        value: '1',
    },
    {
        label: 'Konco Lari',
        value: '2',
    },
])

const events = ref([
    {
        label: 'SLU2025',
        value: '1',
    },
    {
        label: 'ROL2025',
        value: '2',
    },
    {
        label: 'SMC2025',
        value: '3',
    }
])
const event = ref([])
const organizer = ref([])
</script>