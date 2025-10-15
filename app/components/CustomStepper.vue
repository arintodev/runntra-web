<template>
  <div role="group" class="flex gap-4 flex-col w-full">
    <div class="flex">
      <div v-for="(item, index) in items" :key="index" class="group text-center relative w-full min-w-54"
        :data-state="item.active ? 'active' : 'inactive'" :data-disabled="item.disabled">
        <div class="relative flex justify-center">
          <UButton :icon="item.icon" size="lg" variant="subtle"
            :color="item.active ? 'primary' : 'neutral'" :disabled="item.disabled" class="rounded-full aspect-square"
            @click="handleStepClick(index)">
            <template v-if="!item.icon">
              {{ index + 1 }}
            </template>
          </UButton>
          <div v-if="index < items.length - 1" :class="[
            'absolute rounded-full top-[calc(50%-2px)] h-0.5 start-[calc(50%+28px)] end-[calc(-50%+28px)]',
            'bg-primary',
            item.disabled && 'opacity-75'
          ]" />
        </div>
        <div class="mt-2.5 px-4">
          <div class="text-xs text-dimmed">
            {{ item.label }}
          </div>
          <div class="font-medium text-gray-900 dark:text-white text-sm text-nowrap">
            {{ item.title }}
          </div>
          <slot name="description" :item="item">
            <div class="text-gray-500 dark:text-gray-400 text-wrap text-sm">
              {{ item.description }}
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StepItem {
  label?: string,
  title: string
  description: string
  icon?: string
  disabled?: boolean,
  active?: boolean
}

interface Props {
  items: StepItem[]
  modelValue?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0
})

const emit = defineEmits<{
  'select': [index: StepItem | undefined]
}>()

const handleStepClick = (index: number) => {
  if (!props.items[index]?.disabled) {
    emit('select', props.items[index])
  }
}
</script>