<template>
    <div :style="{ display: type === 'block' ? 'block' : 'inline-block' }">
        <div ref="ceref" v-if="type === 'block'" style="display: block;" class="ce">
        </div>
        <div ref="ceref" v-if="type === 'inline'" style="display: inline-block;" class='ce'>
        </div>
    </div>
</template>

<script lang='ts' setup>

import { ref, onMounted, onUnmounted, watch } from 'vue';
import { debounce } from '@/utils/debounce.js'

const ceref = ref<HTMLElement | null>(null)

const props = defineProps({
    content: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'inline'
    }
})

const emit = defineEmits(['change'])

let observer: MutationObserver | null = null
let ignoreMutations = false

const debounceEmit = debounce((content = '') => {
    emit('change', { content });
}, 300)

onMounted(() => {
    if (ceref.value) {
        ignoreMutations = true
        ceref.value.innerHTML = props.content || ''

        observer = new MutationObserver(() => {
            if (!ceref.value || ignoreMutations) return
            const newHtml = ceref.value.innerHTML
            debounceEmit(newHtml)
        })

        observer.observe(ceref.value, {
            childList: true,
            subtree: true,
            characterData: true
        })

        queueMicrotask(() => {
            ignoreMutations = false
        })
    }
})

watch(
    () => props.content,
    (newVal) => {
        if (!ceref.value) return
        const html = newVal || ''

        if (html === ceref.value.innerHTML) return

        ignoreMutations = true
        ceref.value.innerHTML = html

        queueMicrotask(() => {
            ignoreMutations = false
        })
    }
)

onUnmounted(() => {
    if (observer) observer.disconnect()
})
</script>

<style lang='less' scoped></style>
