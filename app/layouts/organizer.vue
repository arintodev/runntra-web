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
		<template #breadcrumb>
			<div v-if="route.params.orgId" class="flex gap-1 items-center">
				<div class="text-dimmed mr-1">/</div>
				<div>
					<ULink :to="`/organizers/${route.params.orgId}`" color="neutral" :active="false"
						class="flex gap-2 items-center">
						<UIcon name="i-lucide-boxes" size="md" />
						<span class="hidden md:inline">Siksorogo</span>
					</ULink>
				</div>
				<div>
					<UPopover :content="{ side: 'bottom', align: 'start' }">
						<UButton icon="i-lucide-chevrons-up-down" color="neutral" variant="ghost" size="sm" />
						<template #content>
							<UCommandPalette v-model="organizer" placeholder="Search..."
								:groups="[{ id: 'organizers', items: organizers }]"
								:ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }">
								<template #footer>
									<UButton to="/organizers/new" label="New Organizer" block variant="soft" color="neutral" size="sm"
										icon="i-lucide-plus" />
								</template>
							</UCommandPalette>
						</template>
					</UPopover>
				</div>
			</div>
			<div v-if="route.params.eventId" class="flex gap-1 items-center">
				<div class="text-dimmed mr-1">/</div>
				<div>
					<ULink :to="`/organizers/${route.params.orgId}/event/${route.params.eventId}`" color="neutral"
						:active="false" class="flex gap-2 items-center">
						<UIcon name="i-lucide-box" size="md" />
						<span class="hidden md:inline">SLU2025</span>
					</ULink>
				</div>
				<div>
					<UPopover :content="{ side: 'bottom', align: 'start' }">
						<UButton icon="i-lucide-chevrons-up-down" color="neutral" variant="ghost" size="sm" />
						<template #content>
							<UCommandPalette v-model="event" placeholder="Search..."
								:groups="[{ id: 'events', items: events }]"
								:ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }">
								<template #footer>
									<UButton label="New event" block variant="soft" color="neutral" size="sm"
										icon="i-lucide-plus" />
								</template>
							</UCommandPalette>
						</template>
					</UPopover>
				</div>
			</div>
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
		to: `/organizers/${route.params.orgId}`
	},
	{
		label: 'Team',
		icon: 'i-lucide-users',
		to: `/organizers/${route.params.orgId}/team`
	},
	{
		label: 'Organizer Settings',
		icon: 'i-lucide-settings',
		to: `/organizers/${route.params.orgId}/settings`
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