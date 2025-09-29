<template>
    <div v-if="type === 'block'" style="display: block;" class="ce">
        {{ content }}
    </div>
    <span v-if="type === 'inline'" style="display: inline;" class='ce'>
        {{ content }}
    </span>
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