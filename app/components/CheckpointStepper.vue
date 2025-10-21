<template>
  <div role="group" class="flex gap-4 flex-col w-full">
    <div class="flex">
      <div v-for="(item, index) in items" :key="index" class="group text-center relative w-full min-w-54 max-w-96"
        :data-state="item.is_result ? 'active' : 'inactive'" :data-disabled="props.disabled">
        <div class="relative flex justify-center">
          <UButton :icon="typeIcon(item.type)" size="lg" variant="subtle"
            :color="item.is_result ? 'primary' : 'neutral'" :disabled="props.disabled" class="rounded-full aspect-square"
            @click="handleStepClick(index)" />
          <div v-if="index < items.length - 1" :class="[
            'absolute rounded-full top-[calc(50%-2px)] h-0.5 start-[calc(50%+28px)] end-[calc(-50%+28px)]',
            'bg-primary',
            props.disabled && 'opacity-75'
          ]" />
        </div>
        <div class="mt-2.5 px-4">
          <div class="font-medium text-gray-900 dark:text-white text-sm text-nowrap">
            {{ item.name }}
          </div>
          <div class="text-sm rounded-lg mt-2 p-4 bg-default flex flex-col gap-1 m-w-64">
              <div v-if="item.distance || item.segment || item.elevation" class="flex justify-center gap-3 mb-2">
                <div v-if="item.distance" class="flex gap-1 items-center">
                  <UIcon name="i-lucide-ruler-dimension-line" class="text-muted" />
                  <span>{{ item.distance }}</span>
                </div>
                <div v-if="item.elevation" class="flex gap-1 items-center" >
                  <UIcon name="i-lucide-trending-up" class="text-muted"/>
                  <span>{{ item.elevation }}</span>
                </div>
                <div v-if="item.segment" class="flex gap-1 items-center" >
                  <UIcon name="i-lucide-flag" class="text-muted"/>
                  <span>{{ item.segment }}</span>
                </div>
              </div>
              <div>
                <div class="text-muted">Cut off point</div>
                <div class="flex items-center gap-4 justify-center mt-1">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-mars" />
                    <span>4h</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-venus" />
                    <span>4h</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-for="device in item.devices" class="text-sm rounded-lg mt-2 p-2 bg-default flex flex-col gap-1">
              <div class="flex items-center gap-3 justify-center text-nowrap">
                <UIcon size="md" name="i-lucide-computer" />
                {{ device.code }}
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Checkpoint } from '~/types/race';

function typeIcon(type?: string) {
  if (type == 'Start') return 'i-lucide-rocket'
  if (type == 'Checkpoint') return 'i-lucide-map-pin'
  if (type == 'Finish') return 'i-lucide-goal'
  if (type == 'Loop') return 'i-lucide-circle-fading-plus'
  if (type == 'Relay') return 'i-lucide-git-pull-request-create-arrow'
  return undefined
}

interface Props {
  items: Checkpoint[]
  modelValue?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0
})

const emit = defineEmits<{
  'select': [index: Checkpoint | undefined],
  'disabled': false
}>()

const handleStepClick = (index: number) => {
  if (props.disabled) return
  emit('select', props.items[index])
}
</script>