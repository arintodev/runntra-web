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
                        <UColorModeButton />
                        <AppUser />
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
</script>