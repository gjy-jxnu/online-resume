<template>
    <div class='content'>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="graph" tab="图形">
                <div class="graph-list">
                    <div class="graph-item" v-for="(item, index) in graphList" :key="index" draggable="true"
                        @dragstart="handleDragStart($event, item)" @dragend="handleDragEnd">
                        <IconFont :type="item.icon"></IconFont>
                        <div style="margin-top: 12px;">{{ item.label }}</div>
                    </div>
                </div>
            </a-tab-pane>

            <a-tab-pane key="structure" tab="结构">

            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang='ts' setup>

import { ref, reactive, computed } from 'vue';
import { FontSizeOutlined } from '@ant-design/icons-vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { useStore } from '@/stores';

const store = useStore()

export type MyComponent = {
    componentName: string;
    props?: Record<string, any>;
    children?: graph[];
    id: string;
}

export type graph = MyComponent & {
    label: string;
    icon: string
}

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_5028347_fpi21mt7sm.js',
});

const activeKey = ref('graph')

const graphList = ref<Array<graph>>([
    { componentName: 'Text', props: { type: 'inline' }, id: '', label: '行内文本', icon: 'icon-text' },
    { componentName: 'Text', props: { type: 'block' }, id: '', label: '单行文本', icon: 'icon-text' },
    { componentName: 'Image', props: {}, id: '', label: '图片', icon: 'icon-image' },
    { componentName: 'Horizon', props: {}, id: '', label: '分割线', icon: 'icon-horizon' },
])

const handleDragStart = (e: DragEvent, item: graph) => {
    store.currentDragComponent = item
}

const handleDragEnd = (e: DragEvent) => {
    store.currentDragComponent = null
}

</script>

<style lang='less' scoped>
.content {
    min-width: 120px;
    padding: 0 10px;
}

.graph-list {
    display: flex;
    flex-wrap: wrap;
}

.graph-item {
    width: 64px;
    height: 64px;
    margin: 4px;
    border-radius: 4px;
    font-size: 12px;
    text-align: center;
}

.graph-item:hover {
    cursor: pointer;
    background-color: rgba(22, 119, 255, 0.1);
}
</style>