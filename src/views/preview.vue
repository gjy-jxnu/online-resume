<template>
    <div class='content'>
        <img class="preview-img" v-if="previewImgBase64" :src="previewImgBase64"></img>
    </div>
</template>

<script lang='ts' setup>

import { ref, reactive, computed, onMounted } from 'vue';

const emit = defineEmits(['loaded'])

const previewImgBase64 = ref('')

onMounted(() => {
    emit('loaded')
    previewImgBase64.value = localStorage.getItem('previewImgBase64')
})
</script>

<style lang='less' scoped>
.content {
    background-color: #f5f5f5;
    padding: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.preview-img {
    width: 794px;
    min-height: 1123px;
    padding: 30px;
    margin-bottom: 20px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    background: #ffffff;
    box-sizing: border-box;
}
</style>