<template>
  <div>
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