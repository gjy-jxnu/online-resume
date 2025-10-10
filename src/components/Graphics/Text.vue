<template>
    <div :style="{ display: type === 'block' ? 'block' : 'inline-block' }">
        <div ref="ceref" v-if="type === 'block'" style="display: block;" class="ce" v-html="content">
        </div>
        <div ref="ceref" v-if="type === 'inline'" style="display: inline-block;" class='ce' v-html="content">
        </div>
    </div>
</template>

<script lang='ts' setup>

import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

const ceref = ref(null)

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

let observer = null


onMounted(() => {
    if (ceref.value) {
        observer = new MutationObserver((mutations) => {
            const newHtml = ceref.value.innerHTML
            emit('change', { content: newHtml })
        })

        observer.observe(ceref.value, {
            childList: true,
            subtree: true,
            characterData: true
        })
    }
})

onUnmounted(() => {
    if (observer) observer.disconnect()
})
</script>

<style lang='less' scoped></style>