<template>
  <div>
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
                      <UButton :to="`${path}/races/new`" label="New race" block variant="soft" color="neutral" size="sm"
                        icon="i-lucide-plus" />
                    </template>
                  </UCommandPalette>
                </template>
              </UPopover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 w-full overflow-y-auto">
      <div class="flex justify-between p-4">
        <div class="flex">
          <UInput icon="i-lucide-search" size="sm" variant="outline" placeholder="Search..." />
        </div>
        <div class="flex justify-end">
          <UButton icon="i-lucide-file-spreadsheet" size="sm" label="Import" />
        </div>
      </div>
      <div class="flex-1">
        <UTable :data="data" :columns="columns" class="flex-1 max-h-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'event'
})

import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

type Payment = {
  id: string
  date: string
  status: 'paid' | 'failed' | 'refunded'
  email: string
  amount: number
}

const data = ref<Payment[]>([
  {
    id: '4600',
    date: '2024-03-11T15:30:00',
    status: 'paid',
    email: 'james.anderson@example.com',
    amount: 594
  },
  {
    id: '4599',
    date: '2024-03-11T10:10:00',
    status: 'failed',
    email: 'mia.white@example.com',
    amount: 276
  },
  {
    id: '4598',
    date: '2024-03-11T08:50:00',
    status: 'refunded',
    email: 'william.brown@example.com',
    amount: 315
  },
  {
    id: '4597',
    date: '2024-03-10T19:45:00',
    status: 'paid',
    email: 'emma.davis@example.com',
    amount: 529
  },
  {
    id: '4596',
    date: '2024-03-10T15:55:00',
    status: 'paid',
    email: 'ethan.harris@example.com',
    amount: 639
  }
])

const columns: TableColumn<Payment>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('date')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = {
        paid: 'success' as const,
        failed: 'error' as const,
        refunded: 'neutral' as const
      }[row.getValue('status') as string]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status')
      )
    }
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]

function getRowItems(row: Row<Payment>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy payment ID',
      onSelect() {
        copy(row.original.id)

        toast.add({
          title: 'Payment ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'View customer'
    },
    {
      label: 'View payment details'
    }
  ]
}

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
</script>
