<template>
  <UPopover v-model:open="open" :popper="{ placement: 'bottom-start' }">
    <div class="w-fit">
        <UInput
            v-model="text"
            icon="i-lucide-calendar"
            placeholder="YYYY-MM-DD – YYYY-MM-DD"
            @focus="open = true"
            @blur="handleBlur"
            @input="handleInput"
        />
    </div>

    <template #content>
      <div class="p-2">
        <UCalendar
          v-model="range"
          range
          @update:model-value="onSelect"
        />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs from 'dayjs'

const open = ref(false)
const text = ref('')
const range = ref<any>({ start: null, end: null })

const onSelect = (newRange: any) => {
  range.value = newRange
  if (newRange.start && newRange.end) {
    text.value = `${dayjs(newRange.start).format('YYYY-MM-DD')} – ${dayjs(newRange.end).format('YYYY-MM-DD')}`
    open.value = false
  }
}

/**
 * Saat user mengetik manual
 */
function handleInput() {
  // Ganti / atau . jadi -
  text.value = text.value.replace(/[/.]/g, '-')

  const parts = text.value.split(/–|-/).map(p => p.trim())

  if (parts.length >= 2) {
    const start = dayjs(parts[0], ['YYYY-MM-DD', 'YYYY-M-D'], true)
    const end = dayjs(parts[1], ['YYYY-MM-DD', 'YYYY-M-D'], true)

    if (start.isValid() && end.isValid()) {
      if (end.isBefore(start)) return // jangan update kalau terbalik
      range.value = { start: start.toDate(), end: end.toDate() }
    }
  }
}

/**
 * Saat blur (keluar dari input)
 */
function handleBlur() {
  const parts = text.value.split(/–|-/).map(p => p.trim())

  if (parts.length >= 2) {
    const start = dayjs(parts[0], ['YYYY-MM-DD', 'YYYY-M-D'], true)
    const end = dayjs(parts[1], ['YYYY-MM-DD', 'YYYY-M-D'], true)

    if (start.isValid() && end.isValid() && !end.isBefore(start)) {
      text.value = `${start.format('YYYY-MM-DD')} – ${end.format('YYYY-MM-DD')}`
      range.value = { start: start.toDate(), end: end.toDate() }
    } else if (range.value.start && range.value.end) {
      // fallback ke tanggal valid sebelumnya
      text.value = `${dayjs(range.value.start).format('YYYY-MM-DD')} – ${dayjs(range.value.end).format('YYYY-MM-DD')}`
    } else {
      text.value = ''
      range.value = { start: null, end: null }
    }
  }
  open.value = false
}

/**
 * Sinkronisasi text jika range berubah dari luar
 */
watch(range, (val) => {
  if (val.start && val.end) {
    text.value = `${dayjs(val.start).format('YYYY-MM-DD')} – ${dayjs(val.end).format('YYYY-MM-DD')}`
  }
}, { deep: true })
</script>

