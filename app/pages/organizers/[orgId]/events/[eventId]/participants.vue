<template>
  <div>
    <div class="py-8 px-8 border-b border-default">
      <h2 class="text-2xl">Registrations</h2>
    </div>
    <div class="flex-1 w-full overflow-y-auto">
      <div class="flex justify-between p-4 gap-4">
        <div class="flex gap-2">
          <SearchInput placeholder="Search..." v-model="filter.keyword" @search="onSearch" />
          <UButton variant="outline" color="neutral" icon="i-lucide-filter" @click="filterOpen = !filterOpen" />
        </div>
        <div class="flex justify-end gap-2">
            <UButton @click="refresh" variant="outline" color="neutral" icon="i-lucide-refresh-cw" title="Refresh" />
          <UDropdownMenu :items="addActionItems">
            <UButton icon="i-lucide-plus">
              <span class="hidden md:inline">Participant</span>
            </UButton>
          </UDropdownMenu>
          <UDropdownMenu :items="moreActionItems">
            <UButton variant="outline" color="neutral" icon="i-lucide-ellipsis-vertical" />
          </UDropdownMenu>
        </div>
      </div>
      <div class="flex-1">
        <UCollapsible v-model:open="filterOpen" class="flex flex-col gap-2 w-full overflow-y-auto">
          <template #content>
            <div class="flex items-center px-4 py-3 bg-elevated">
              <USelect placeholder="Gender" class="min-w-28" :items="[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' }
              ]" />
            </div>
          </template>
        </UCollapsible>
        <UTable :data="participants" :loading="isLoading" :columns="columns" class="flex-1 max-h-full" @select="onSelect" />
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
    <UModal v-model:open="batchUpdateOpen" :dismissible="false" title="Batch update participant">
      <template #body>
        <div>
          <UFileUpload v-model="batchUpdateFile" accept=".csv" color="primary" highlight label="Upload your file here"
            description="CSV (max. 1MB)" class="w-full" />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton size="sm" label="Cancel" color="neutral" variant="outline" @click="closeBatchUpdate" />
          <UButton size="sm" label="Save" @click="uploadBatchUpdate" />
        </div>
      </template>
    </UModal>
    <USlideover v-model:open="pFormOpen" :title="selected?.id ? 'Edit participant' : 'Create participant'">
      <template #body>
        <ParticipantForm ref="participantForm" :data="selected" @submit="onPFormSubmit" />
      </template>
      <template #footer>
        <div class="flex justify-between gap-3 w-full">
          <div>
            <UButton v-if="selected?.id" variant="link" color="error" size="sm" label="Delete" @click="deleteParticipant" />
          </div>
          <div class="flex gap-2">
            <UButton @click="pFormCancel" type="button" size="sm" label="Cancel" variant="outline" color="neutral" />
            <UButton @click="pFormSubmit" size="sm" label="Save" />
          </div>
        </div>
      </template>
    </USlideover>
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
import type { DropdownMenuItem } from '@nuxt/ui/runtime/components/DropdownMenu.vue.js'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
let searchDebounce: any = null

const toast = useToast()
const { copy } = useClipboard()
const importOpen = ref(false)
const batchUpdateOpen = ref(false)
const participantStore = useParticipantStore()
const { participants, isLoading, filter } = storeToRefs(participantStore)
const importFile = ref<File | null>(null)
const batchUpdateFile = ref<File | null>(null)
const pFormOpen = ref(false)
const selected = ref<Participant>()
const pFormRef = useTemplateRef("participantForm")
const filterOpen = ref(false)

async function uploadImport() {
  const file = importFile.value
  if (!file) return

  await participantStore.importParticipant(file)

  importFile.value = null
  importOpen.value = false
}

function closeImport() {
  importOpen.value = false;
  importFile.value = null
}

async function closeBatchUpdate() {
  batchUpdateOpen.value = false;
  batchUpdateFile.value = null
}

async function uploadBatchUpdate() {
  const file = batchUpdateFile.value
  if (!file) return

  await participantStore.batchUpdate(file)

  batchUpdateFile.value = null
  batchUpdateOpen.value = false
}

function pFormCancel() {
  pFormOpen.value = false
  selected.value = undefined
}

function pFormSubmit() {
  pFormRef.value?.submit()
}

async function onPFormSubmit(data: any) {
  await participantStore.saveParticipant(data)
  selected.value = undefined
  pFormOpen.value = false
}

async function deleteParticipant() {
  if (selected.value?.id) {
    await participantStore.deleteParticipant(selected.value.id)
    selected.value = undefined
    pFormOpen.value = false
  }
}

function refresh() {
  participantStore.fetchParticipants()
}

async function onSearch() {
  participantStore.fetchParticipants()
}

async function onSelect(row: Row<Participant>) {
  selected.value = row.original
  pFormOpen.value = true
}

const addActionItems: DropdownMenuItem[] = [
  {
    label: 'Create',
    icon: 'i-lucide-user-plus',
    onSelect: () => {
      selected.value = {}
      pFormOpen.value = true
    }
  },
  {
    label: 'Import CSV',
    icon: 'i-lucide-file',
    onSelect: () => (importOpen.value = true)
  }
]

const moreActionItems: DropdownMenuItem[] = [
  {
    label: 'Export',
    icon: 'i-lucide-file-up',
    onSelect: () => {
      participantStore.exportParticipant()
    }
  },
  {
    label: 'Batch Update',
    icon: 'i-lucide-file-pen',
    onSelect: () => {
      batchUpdateOpen.value = true
    }
  },
]

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
    accessorKey: 'details.email',
    header: 'Email'
  },
]

onMounted(() => {
  participantStore.fetchParticipants()
})
</script>
