<template>
	<div class="w-full min-h-full flex flex-col items-stretch">
		<UContainer class="pt-8">
			<div>
				<h2 class="text-2xl">Crew</h2>
			</div>
			<div class="pt-8">
				<div class="flex justify-between mb-4">
					<div></div>
					<div class="flex justify-end">
						<UButton size="sm" label="Invite crew" />
					</div>
				</div>
				<div class="border border-muted rounded-md">
					<UTable :data="users" :columns="columns" class="flex-1" />
				</div>
			</div>
		</UContainer>
	</div>
</template>
<script setup lang="ts">
definePageMeta({
	layout: 'organizer'
})

import type { TableColumn } from '@nuxt/ui'

const UAvatar = resolveComponent('UAvatar')

type User = {
	id: number
	name: string
	email: string
	role: string,
	avatar: { src: string }
}

const users = ref<User[]>([
	{
		id: 1,
		name: "Fajar",
		email: "fajar@runntra.com",
		role: "Crew",
		avatar: { src: 'https://i.pravatar.cc/120?img=1' }
	}
])

const columns: TableColumn<User>[] = [
	{
		accessorKey: 'name',
		header: 'User',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-3' }, [
				h(UAvatar, {
					...row.original.avatar,
					size: 'lg'
				}),
				h('div', undefined, [
					h('p', { class: 'font-medium text-highlighted' }, row.original.name),
					h('p', { class: '' }, `${row.original.email}`)
				])
			])
		}
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }) => row.original.role
	}
]

</script>