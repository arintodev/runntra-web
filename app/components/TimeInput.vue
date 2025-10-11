<template>
  <div class="space-y-1">
    <UInput
      ref="inputRef"
      v-model="local"
      :placeholder="format"
      :color="isValid ? 'primary' : 'error'"
      icon="i-heroicons-clock"
      @blur="onBlur"
      @keydown.enter.prevent="commit"
      @keydown.esc="revert"
    />

    <!-- Hint or suggestion -->
    <div v-if="!isValid && local !== ''" class="text-xs text-red-500">
      Invalid time
    </div>
    <div v-else-if="local !== formatted && local !== ''" class="text-xs text-gray-500">
      Suggestion: <span class="font-medium">{{ formatted }}</span>
      <UButton
        size="xs"
        color="neutral"
        variant="soft"
        class="ml-2"
        @click="applySuggestion"
      >
        Apply
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { UInput, UButton } from '#components'

const props = defineProps({
  modelValue: { type: String, default: '' },
  format: { type: String, default: 'HH:mm' },
  autocorrect: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'valid'])

const local = ref(props.modelValue || '')
const inputRef = ref<HTMLInputElement | null>(null)

/* ===== Utility ===== */
const pad = (n: number, len = 2) => String(n).padStart(len, '0')

function parseTime(input: string) {
  if (!input) return null
  const s = input.trim()

  // split jika ada : atau .
  if (/[^\d]/.test(s)) {
    const parts = s.split(/\D+/).filter(Boolean).map(Number)
    const [h = 0, m = 0, sec = 0] = parts
    return { h, m, s: sec }
  }

  // hanya angka
  const digits = s.replace(/\D/g, '')
  if (digits.length === 0) return null
  if (digits.length === 1) return { h: +digits, m: 0, s: 0 }
  if (digits.length === 2) return { h: +digits, m: 0, s: 0 }
  if (digits.length === 3) return { h: +digits[0]!, m: +digits.slice(1), s: 0 }
  if (digits.length === 4) return { h: +digits.slice(0, 2), m: +digits.slice(2), s: 0 }
  if (digits.length === 5) return { h: +digits.slice(0, 2), m: +digits.slice(2, 4), s: +digits[4]! }
  if (digits.length >= 6)
    return { h: +digits.slice(0, 2), m: +digits.slice(2, 4), s: +digits.slice(4, 6) }
  return null
}

function normalize({ h, m, s }: any) {
  if (isNaN(h) || isNaN(m) || isNaN(s)) return null
  return {
    h: Math.min(23, Math.max(0, Math.floor(h))),
    m: Math.min(59, Math.max(0, Math.floor(m))),
    s: Math.min(59, Math.max(0, Math.floor(s))),
  }
}

function formatTime({ h, m, s }: any, fmt = 'HH:mm') {
  const hh = pad(h)
  const mm = pad(m)
  const ss = pad(s)
  return fmt === 'HH:mm:ss' ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`
}

/* ===== Computed ===== */
const parsed = computed(() => parseTime(local.value))
const formatted = computed(() => {
  if (!parsed.value) return ''
  const n = normalize(parsed.value)
  if (!n) return ''
  return formatTime(n, props.format)
})
const isValid = computed(() => !!parsed.value && !!normalize(parsed.value))

/* ===== Methods ===== */
function commit() {
  if (!isValid.value) {
    emit('update:modelValue', '')
    emit('valid', false)
    return
  }
  emit('update:modelValue', formatted.value)
  local.value = formatted.value
  emit('valid', true)
}

function revert() {
  local.value = props.modelValue
}

function applySuggestion() {
  local.value = formatted.value
  commit()
  inputRef.value?.focus()
}

function onBlur() {
  if (props.autocorrect && isValid.value) {
    commit()
  }
}

/* ===== Watch ===== */
watch(
  () => props.modelValue,
  (v) => {
    if (v !== local.value) local.value = v || ''
  }
)
</script>