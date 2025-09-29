<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import LeftSidebar from '@/components/LeftSidebar.vue';
import RightSidebar from '@/components/RightSidebar.vue';

const leftWidth = ref<number>(4)
const centerWidth = computed(() => 24 - leftWidth.value - rightWidth.value)
const rightWidth = ref<number>(4)

const leftFoldChange = (collapsed: boolean) => {
    leftWidth.value = collapsed ? 2 : 4
}
</script>

<template>
    <div class='content' style="display: flex;">
        <left-sidebar :style="{ flex: leftWidth }" @fold-change="leftFoldChange"></left-sidebar>
        <router-view :style="{ flex: centerWidth }"></router-view>
        <right-sidebar :style="{ flex: rightWidth }"></right-sidebar>
    </div>
</template>

<style scoped></style>
