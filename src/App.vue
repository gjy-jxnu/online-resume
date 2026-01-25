<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue';
import LeftSidebar from '@/components/LeftSidebar.vue';
import RightSidebar from '@/components/RightSidebar.vue';
import { useRoute } from 'vue-router';
const route = useRoute()

const leftWidth = ref<number>(4)
const centerWidth = computed(() => 24 - leftWidth.value - rightWidth.value)
const rightWidth = ref<number>(4)
const loading = ref(true)
const routeRef = ref(null)

const handleRouterViewLoaded = () => {
    loading.value = false
}

const renderSchema = (schema) => {
    if (routeRef.value && route.path === '/index' && schema) {
        nextTick(() => {
            routeRef.value.pageSchema = schema
            console.log(routeRef.value)
        })
    }
}
</script>

<template>
    <div v-if="loading" style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
        <a-spin size="large" />
    </div>
    <div v-show="!loading" class='content' style="display: flex;">
        <left-sidebar v-if="route.path === '/index'" :style="{ flex: leftWidth }"
            @render-schema="renderSchema"></left-sidebar>
        <router-view :style="{ flex: centerWidth }" @loaded="handleRouterViewLoaded">
            <template #default="{ Component }">
                <component ref="routeRef" :is="Component"></component>
            </template>
        </router-view>
        <right-sidebar v-if="route.path === '/index'" :style="{ flex: rightWidth }"
            @render-schema="renderSchema"></right-sidebar>
    </div>
</template>

<style scoped></style>
