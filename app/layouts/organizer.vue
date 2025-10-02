<template>
	<NuxtLayout name="dashboard">
		<template #sidebar>
			<slot name="sidebar">
				<UDashboardSidebar mode="drawer" :collapsed="true">
					<template #default="{ collapsed }">
						<UNavigationMenu :tooltip="true" :collapsed="collapsed" :items="items" orientation="vertical" />
					</template>
				</UDashboardSidebar>
			</slot>
		</template>
		<slot />
	</NuxtLayout>
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