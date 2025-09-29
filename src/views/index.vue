<template>
    <div class='content' ref="parentRef">
        <div class="a4-page" :class="{ isDrag: store.currentDragComponent }" @dragenter.prevent="handleDragEnter"
            @dragover.prevent @drop.prevent="handleDrop">
            <Text type="inline"></Text>
            <Text type="block"></Text>

        </div>

        <selection-menu :parentRef="parentRef"></selection-menu>
    </div>
</template>

<script lang='ts' setup>

import { ref, reactive, computed } from 'vue';
import SelectionMenu from '@/components/SelectionMenu.vue';
import Text from '@/components/Graphics/Text.vue';

import { useStore } from '@/stores';
import { MyComponent } from '@/components/RightSidebar.vue';

const store = useStore()

const parentRef = ref(null);

// 页面JSON配置对象
const pageSchema = ref<MyComponent | null>(null)

const handleDragEnter = (e: DragEvent) => {
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy'; // 显示复制图标
    }
    console.log(store.currentDragComponent)
}

const handleDrop = (e: DragEvent) => {
    console.log(store.currentDragComponent)
}
</script>

<style lang='less' scoped>
.content {
    background-color: #f5f5f5;
    padding: 40px;
    display: flex;
    justify-content: center;
}
</style>