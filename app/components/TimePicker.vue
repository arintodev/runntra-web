<template>
  <div class="w-full">
    <!-- Input wrapper -->
    <div class="relative">
      <u-input
        :value="displayTime"
        @click="isOpen = !isOpen"
        readonly
        :placeholder="`Select time (${formatLabel})`"
        trailing-icon="i-lucide-clock"
      />
    </div>

    <!-- Dropdown panel -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg"
    >
      <!-- Dropdowns in row -->
      <div class="px-4 py-4">
        <div class="flex gap-3 items-end">
          <!-- Hours -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Hours</label>
            <div class="relative">
              <u-input
                class="text-center"
                v-model.number="hours"
                @focus="openAutocomplete('hours')"
                @blur="onBlur"
                min="0"
                max="23"
              />
              <div v-if="activeAutocomplete === 'hours'" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                <div
                  v-for="h in 24"
                  :key="h - 1"
                  @click="hours = h - 1; activeAutocomplete = null"
                  class="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                  :class="{ 'bg-blue-100 text-blue-900': hours === h - 1 }"
                >
                  {{ pad(h - 1) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Separator -->
          <div class="text-gray-400 text-lg font-semibold pb-1">:</div>

          <!-- Minutes -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
            <div class="relative">
              <u-input
                class="text-center"
                v-model.number="minutes"
                @focus="openAutocomplete('minutes')"
                @blur="onBlur"
              />
              <div v-if="activeAutocomplete === 'minutes'" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                <div
                  v-for="m in 60"
                  :key="m - 1"
                  @click="minutes = m - 1; activeAutocomplete = null"
                  class="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                  :class="{ 'bg-blue-100 text-blue-900': minutes === m - 1 }"
                >
                  {{ pad(m - 1) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Separator -->
          <div v-if="format === 'hms'" class="text-gray-400 text-lg font-semibold pb-1">:</div>

          <!-- Seconds -->
          <div v-if="format === 'hms'" class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Seconds</label>
            <div class="relative">
              <u-input
                class="text-center"
                v-model.number="seconds"
                @focus="openAutocomplete('seconds')"
                @blur="onBlur"
              />
              <div v-if="activeAutocomplete === 'seconds'" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                <div
                  v-for="s in 60"
                  :key="s - 1"
                  @click="seconds = s - 1; activeAutocomplete = null"
                  class="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                  :class="{ 'bg-blue-100 text-blue-900': seconds === s - 1 }"
                >
                  {{ pad(s - 1) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-gray-200 bg-gray-50 flex gap-2 justify-end">
        <u-button
          @click="cancel"
          color="neutral"
          variant="outline"
          label="Cancel"
          size="sm"
          />
        <u-button
          @click="confirm"
          color="primary"
          label="Confirm"
          size="sm"
          />
      </div>
    </div>

    <!-- Overlay -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-40"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

type TimeFormat = 'hm' | 'hms'

interface Props {
  modelValue?: string
  format?: TimeFormat
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '00:00',
  format: 'hms'
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const format = ref<TimeFormat>(props.format)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const activeAutocomplete = ref<'hours' | 'minutes' | 'seconds' | null>(null)

let blurTimeout: any = null;

const formatLabel = computed(() => {
  return format.value === 'hms' ? 'HH:MM:SS' : 'HH:MM'
})

const displayTime = computed(() => {
  if (format.value === 'hms') {
    return `${pad(hours.value)}:${pad(minutes.value)}:${pad(seconds.value)}`
  }
  return `${pad(hours.value)}:${pad(minutes.value)}`
})

const pad = (num: number): string => {
  return String(num).padStart(2, '0')
}

const parseTime = (time: string, fmt: TimeFormat) => {
  const parts = time.split(':').map(Number)
  return {
    hours: Math.min(23, Math.max(0, parts[0] || 0)),
    minutes: Math.min(59, Math.max(0, parts[1] || 0)),
    seconds: fmt === 'hms' ? Math.min(59, Math.max(0, parts[2] || 0)) : 0
  }
}

const openAutocomplete = (type: 'hours' | 'minutes' | 'seconds') => {
   if (blurTimeout) {
    clearTimeout(blurTimeout);
   }
  activeAutocomplete.value = type
}

const closeAutocomplete = () => {
  activeAutocomplete.value = null
}

const onBlur = () => {
  blurTimeout = setTimeout(() => {
    closeAutocomplete()
  }, 100)
}

const confirm = () => {
  emit('update:modelValue', displayTime.value)
  isOpen.value = false
}

const cancel = () => {
  const { hours: h, minutes: m, seconds: s } = parseTime(props.modelValue, props.format)
  hours.value = h
  minutes.value = m
  seconds.value = s
  format.value = props.format
  isOpen.value = false
}

onMounted(() => {
  const { hours: h, minutes: m, seconds: s } = parseTime(props.modelValue, props.format)
  hours.value = h
  minutes.value = m
  seconds.value = s
  format.value = props.format
})
</script>