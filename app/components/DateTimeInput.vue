<template>
  <UPopover v-model:open="open" :popper="{ placement: 'bottom-start' }">
    <template #anchor>
      <UInput
        ref="inputRef"
        v-model="text"
        :icon="showTime ? 'i-lucide-calendar-clock' : 'i-lucide-calendar'"
        :placeholder="showTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'"
        :color="isValidDateTime ? 'primary' : 'error'"
        @focus="open = true"
        @keydown.enter.prevent="commitDateTime"
        v-bind="$attrs"
      />
    </template>

    <template #content>
      <div class="p-3 space-y-3 min-w-max">
        <!-- Calendar -->
        <div>
          <UCalendar v-model="dateInput" />
        </div>

        <!-- Time Input (if enabled) -->
        <div v-if="showTime" class="border-t pt-3">
          <div class="flex gap-2 items-center">
            <div class="flex-1">
              <UInput
                v-model="timeInput"
                placeholder="HH:mm"
                icon="i-lucide-clock"
                :color="isValidTime ? 'primary' : 'error'"
                @keydown.enter.prevent="commitDateTime"
                @blur="normalizeTime"
              />
            </div>
            <UButton
              size="sm"
              color="primary"
              @click="commitDateTime"
            >
              Ok
            </UButton>
          </div>
        </div>

        <!-- Hint -->
        <div v-if="text && !isValidDateTime" class="text-xs text-red-500 border-t pt-2">
          Invalid date/time format
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { CalendarDate, CalendarDateTime, parseDate, parseDateTime, parseTime, toCalendarDate, today, toTime, type DateValue } from '@internationalized/date'

interface Props {
  timezone?: string
  modelValue?: string | null
  showTime?: boolean
  format?: string
}

const props = withDefaults(defineProps<Props>(), {
  timezone: 'local',
  modelValue: null,
  showTime: false,
  format: 'YYYY-MM-DD HH:mm',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

/* ===== State ===== */
const open = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

// Initialize values from modelValue
const defaultValue = props.modelValue ? isoToCalendarDateTime(props.modelValue) : null;
const text = ref<string | null>(formatDateTime(defaultValue))
const dateInput = ref<any>(defaultValue ? defaultValue : null)
const timeInput = ref<string>(defaultValue ? toTime(defaultValue)?.toString() || '' : '')

/* ===== Utility ===== */
const pad = (n: number, len = 2) => String(n).padStart(len, '0')

function isoToCalendarDateTime(isoString: string) {
  const d = new Date(isoString)

  return new CalendarDateTime(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  )
}

function parseStringTime(input: string) {
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

function normalizeTime(time: any) {
  if (!time) return null
  return {
    hour: Math.min(23, Math.max(0, Math.floor(time.h))),
    minute: Math.min(59, Math.max(0, Math.floor(time.m))),
    second: Math.min(59, Math.max(0, Math.floor(time.s))),
  }
}

/* ===== Computed ===== */
const parsedTime = computed(() => parseStringTime(timeInput.value))
const normalizedTime = computed(() => {
  if (!parsedTime.value) return null
  return normalizeTime(parsedTime.value)
})
const isValidTime = computed(() => !!parsedTime.value && !!normalizedTime.value)
const isValidDateTime = computed(() => {
  if (!dateInput.value) return false
  if (props.showTime) return isValidTime.value
  return true
})

function normalizeTimeInput() {
  if (dateInput.value && timeInput.value && isValidTime.value) {
    timeInput.value = toTime(dateInput.value).toString()
  }
}

function formatDateTime(date: DateValue | null) {
  if (!date) return ''
  return dayjs(date.toString()).format(props.format)
}

function commitDateTime() {
  if (!dateInput.value) return
  if (props.showTime && !isValidTime.value) return

  dateInput.value = dateInput.value.set({
    hour: normalizedTime.value?.hour || 0,
    minute: normalizedTime.value?.minute || 0,
    second: normalizedTime.value?.second || 0,
  })

  text.value = formatDateTime(dateInput.value)

  normalizeTimeInput()
  emit('update:modelValue', dateInput.value.toDate().toISOString())
  open.value = false
}

function setDefaultValue(val: string) {
  const defaultValue = isoToCalendarDateTime(val);
  text.value = formatDateTime(defaultValue)
  dateInput.value = defaultValue ? defaultValue : null
  timeInput.value = defaultValue ? toTime(defaultValue)?.toString() || '' : ''
}

function revertDateTime() {
  setDefaultValue(props.modelValue || '')
}

watch(() => props.modelValue, (newVal) => {
  console.log(newVal)
  setDefaultValue(newVal || '')
})
</script>