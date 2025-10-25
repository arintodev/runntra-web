<template>
  <div class="flex h-full flex-col items-stretch">
    <div class="border-b border-default">
      <div class="flex items-stretch">
        <div class="py-4 px-6 border-r border-default w-auto md:w-64">Participant Registration</div>
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
                </UCommandPalette>
              </template>
            </UPopover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>