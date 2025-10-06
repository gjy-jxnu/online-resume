<template>
    <div :style="{ display: type === 'block' ? 'block' : 'inline-block' }">
        <div v-if="type === 'block'" style="display: block;" class="ce">
            {{ content }}
        </div>
        <div v-if="type === 'inline'" style="display: inline-block;" class='ce'>
            {{ content }}
        </div>
    </div>
</template>

<script lang='ts' setup>

import { ref, reactive, computed } from 'vue';

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

</script>

<style lang='less' scoped></style>