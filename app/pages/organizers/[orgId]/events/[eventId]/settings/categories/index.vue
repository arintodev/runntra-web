<template>
	<div>
		<div class="flex justify-between mb-4">
			<div></div>
			<div class="flex justify-end">
				<UButton size="sm" icon="i-lucide-plus" label="New category" />
			</div>
		</div>
		<div class="border border-muted rounded-md">
			<UTable :data="categories" :columns="columns" class="flex-1" @select="onSelect" />
		</div>
	</div>
</template>
<script setup lang="ts">

import type { TableColumn, TableRow } from '@nuxt/ui'

const router = useRouter();

function onSelect(row: TableRow<Category>, e?: Event) {
  router.push(`categories/${row.id}`)
}

type Category = {
	id: number
	name: string
	run_type: string,
	gun_time: string
}

const categories = ref<Category[]>([
	{
		id: 1,
		name: "20K",
		run_type: "Loop",
		gun_time: new Date().toISOString()
	}
])

const columns: TableColumn<Category>[] = [
	{
		accessorKey: 'name',
		header: 'Category',
    cell: ({ row }) => h('div', { class: 'text-highlighted font-semibold' }, row.original.name)
	},
	{
		accessorKey: 'run_type',
		header: 'Type',
	}
]

</script>