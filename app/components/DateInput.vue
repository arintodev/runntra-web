<template>
    <UPopover v-model:open="open" :popper="{ placement: 'bottom-start' }">
        <template #anchor>
            <UInput ref="inputRef" v-model="text" icon="i-lucide-calendar" placeholder="YYYY-MM-DD"
                @focus="open = true" v-bind="$attrs"/>
        </template>
        <template #content>
            <div class="p-2">
                <UCalendar v-model="selected" @update:model-value="onSelect" />
            </div>
        </template>
    </UPopover>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs from 'dayjs'

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void
}>()

const open = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const text = ref<string | null>(null)
const selected = ref<any>(null)

const onSelect = (date: any) => {
    const value = date?.toDate() || null;
    text.value = dayjs(value).format('YYYY-MM-DD')
    emit('update:modelValue', text.value)
    open.value = false
}


/**
 * Sinkronisasi text jika tanggal diubah dari luar
 */
watch(selected, (val) => {
    if (val) text.value = dayjs(val).format('YYYY-MM-DD')
})
</script>
