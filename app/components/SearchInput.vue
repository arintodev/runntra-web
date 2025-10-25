<script setup lang="ts">
import { ref, watch } from 'vue'
import { UInput, UButton } from '#components'

const props = defineProps<{
  modelValue: string | null
  debounce?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

// Internal state (isolated)
const innerValue = ref(props.modelValue ?? '')

// Debounce time
const debounceTime = props.debounce ?? 300

// Sync parent → child
watch(
  () => props.modelValue,
  (val) => {
    if (val !== innerValue.value) {
      innerValue.value = val ?? ''
    }
  }
)

let timer: NodeJS.Timeout | null = null
const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value

  if (timer) clearTimeout(timer)

  timer = setTimeout(() => {
    emit('update:modelValue', value)
    emit('search', value)
  }, debounceTime)
}

const clear = () => {
  innerValue.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<template>
  <UInput
    v-model="innerValue"
    v-bind="$attrs"
    @input="handleInput"
    :placeholder="$attrs.placeholder as string ?? 'Search...'"
  >
    <!-- ✅ Leading search icon -->
    <template #leading>
      <UIcon name="i-lucide-search" class="opacity-50" />
    </template>

    <!-- ✅ Clear button on trailing -->
    <template #trailing>
      <UButton
        v-if="innerValue?.length"
        color="neutral"
        variant="link"
        size="sm"
        icon="i-lucide-circle-x"
        @click="clear"
      />
    </template>
  </UInput>
</template>
