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
          <UButton icon="i-lucide-file-spreadsheet" size="sm" label="Import" @click="importOpen = true" />
        </div>
      </div>
      <div class="flex-1">
        <UTable :data="participants" :loading="isLoading" :columns="columns" class="flex-1 max-h-full" />
      </div>
    </div>
    <UModal v-model:open="importOpen" :dismissible="false" title="Import participant">
      <template #body>
        <div>
          <UFileUpload v-model="importFile" accept=".csv" color="primary" highlight label="Import your data here"
            description="CSV (max. 1MB)" class="w-full" />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton size="sm" label="Cancel" color="neutral" variant="outline" @click="closeImport" />
          <UButton size="sm" label="Save" @click="uploadImport" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'organizer'
})

import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'
import type { Participant } from '~/types/participant'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()
const importOpen = ref(false)
const participantStore = useParticipantStore()
const { participants, isLoading } = storeToRefs(participantStore)
const importFile = ref<File | null>(null)

async function uploadImport() {
  const file = importFile.value
  if (!file) return
  
  await participantStore.importParticipant(file)

  importFile.value = null
  importOpen.value = false
}

function closeImport() {
  importOpen.value = false;
}

const columns: TableColumn<Participant>[] = [
  {
    accessorKey: 'bib_number',
    header: 'BIB',
  },
  {
    accessorKey: 'full_name',
    header: 'Full name',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'email',
    header: 'Email'
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
              size: 'sm',
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

function getRowItems(row: Row<Participant>) {
  return [
    {
      type: 'label',
      label: 'Actions'
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

onMounted(() => {
  participantStore.fetchParticipants()
})
</script>
