<template>
	<UDashboardGroup>
		<div class="flex flex-col h-screen w-screen">
			<UDashboardNavbar title="Runntra">
				<template #left>
					<div class="flex gap-2 items-center">
						<div>Runntra</div>
						<slot name="breadcrumb">
							<div class="flex gap-1 items-center">
								<div class="text-dimmed mr-1">/</div>
								<div>
									<ULink :to="`/org/${route.params.orgId}`" color="neutral" :active="false"
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
													<UButton label="New Organizer" block variant="soft" color="neutral" size="sm"
														icon="i-lucide-plus" />
												</template>
											</UCommandPalette>
										</template>
									</UPopover>
								</div>
							</div>
						</slot>
						<div v-if="route.params.eventId" class="flex gap-1 items-center">
							<div class="text-dimmed mr-1">/</div>
							<div>
								<ULink :to="`/org/${route.params.orgId}/event/${route.params.eventId}`" color="neutral" :active="false"
									class="flex gap-2 items-center">
									<UIcon name="i-lucide-box" size="md" />
									<span class="hidden md:inline">SLU2025</span>
								</ULink>
							</div>
							<div>
								<UPopover :content="{ side: 'bottom', align: 'start' }">
									<UButton icon="i-lucide-chevrons-up-down" color="neutral" variant="ghost" size="sm" />
									<template #content>
										<UCommandPalette v-model="event" placeholder="Search..." :groups="[{ id: 'events', items: events }]"
											:ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }">
											<template #footer>
												<UButton label="New event" block variant="soft" color="neutral" size="sm" icon="i-lucide-plus" />
											</template>
										</UCommandPalette>
									</template>
								</UPopover>
							</div>
						</div>
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
									<UUser name="John Doe" :description="user?.email"  :avatar="{
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
					<UDashboardSidebar mode="drawer" :collapsed="true">
						<template #default="{collapsed}">
							<slot name="sidebarMenu" :collapsed="collapsed">
								<UNavigationMenu :tooltip="true" :collapsed="collapsed" :items="items" orientation="vertical" />
							</slot>
						</template>
					</UDashboardSidebar>
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
			label: 'Organizers',
			icon: 'i-lucide-boxes'
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