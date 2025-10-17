<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import LeftSidebar from '@/components/LeftSidebar.vue';
import RightSidebar from '@/components/RightSidebar.vue';
import { useRoute } from 'vue-router';
const route = useRoute()

const leftWidth = ref<number>(4)
const centerWidth = computed(() => 24 - leftWidth.value - rightWidth.value)
const rightWidth = ref<number>(4)
const loading = ref(true)

const leftFoldChange = (collapsed: boolean) => {
    leftWidth.value = collapsed ? 2 : 4
}

const handleRouterViewLoaded = () => {
    loading.value = false
}
</script>

<template>
    <div v-if="loading" style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
        <a-spin size="large" />
    </div>
    <div v-show="!loading" class='content' style="display: flex;">
        <!--         <left-sidebar v-if="route.path === '/index'" :style="{ flex: leftWidth }"
            @fold-change="leftFoldChange"></left-sidebar> -->
        <router-view :style="{ flex: centerWidth }" @loaded="handleRouterViewLoaded"></router-view>
        <right-sidebar v-if="route.path === '/index'" :style="{ flex: rightWidth }"></right-sidebar>
    </div>
</template>

<style scoped></style>
