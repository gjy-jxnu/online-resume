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
                <div class="struct-list">
                    <div class="struct-item" :class="{ checked: component.id === store.currentCheckedID }"
                        v-for="(component, index) in pageSchema.children" :key="component.id"
                        @click.stop="checkedComponent(component)">
                        <IconFont :type="component.icon"></IconFont>
                        <div style="font-size: 12px; margin-left: 4px;">{{ component.label + '-' + component.id }}</div>
                        <DeleteOutlined @click.stop="deleteComponent(index)"></DeleteOutlined>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang='ts' setup>

import { ref, reactive, computed, watch } from 'vue';
import { FontSizeOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { useStore } from '@/stores';

const store = useStore()

export type MyComponent = {
    componentName: string;
    props?: Record<string, any>;
    children?: MyComponent[];
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

const pageSchema = ref(null)

const handleDragStart = (e: DragEvent, item: graph) => {
    store.currentDragComponent = { ...item }
}

const handleDragEnd = (e: DragEvent) => {
    store.currentDragComponent = null
}

const checkedComponent = (component) => {
    const dom = document.getElementById(component.id)
    const editDom: HTMLElement = dom.querySelector('.ce')
    if (component.id === store.currentCheckedID) {
        store.currentCheckedID = ''
        editDom.blur()
    } else {
        store.currentCheckedID = component.id
        editDom.focus()
    }
}

const deleteComponent = (index) => {
    store.pageSchema.children.splice(index, 1)
}

watch(() => store.pageSchema, (newVal) => {
    if (newVal) {
        pageSchema.value = { ...newVal }
    }
}, {
    deep: true
})
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

.struct-list {
    padding: 10px 5px;
}

.struct-item {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    padding: 0 2px;
    border-radius: 4px;

    &.checked {
        border-radius: 4px;
        background-color: rgba(11, 98, 220, 0.1);
    }
}

.struct-item:hover {
    cursor: pointer;
    background-color: rgba(22, 119, 255, 0.1);
}
</style>