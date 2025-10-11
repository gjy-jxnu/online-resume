<template>
    <div>
        <div class="header-menu">
            <div class="tips">
                <span v-if="lastEditTime">最后编辑时间：{{ dayjs(Number(lastEditTime)).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
            <div class="operation">
                <div class="menu-item" title="清空">
                    <a-popconfirm title="您确定要清空屏幕吗？" ok-text="确定" cancel-text="取消" @confirm="clear">
                        <ClearOutlined></ClearOutlined>
                    </a-popconfirm>
                </div>
                <div class="menu-item" :class="{ disabled: UndoRedoManager.currentIndex <= 0 }" title="撤销"
                    @click="undo">
                    <UndoOutlined></UndoOutlined>
                </div>
                <div class="menu-item" :class="{ disabled: UndoRedoManager.futureStack.length <= 0 }" title="恢复"
                    @click="redo">
                    <RedoOutlined></RedoOutlined>
                </div>
                <div class="menu-item" :class="{ disabled: isExporting }" title="导出" @click="exportPDF">
                    <ExportOutlined></ExportOutlined>
                </div>
            </div>
        </div>
        <div class='content' ref="parentRef">
            <div class="a4-page" :class="{ isDrag: store.currentDragComponent && !store.currentDragComponent.id }"
                @dragenter.prevent="handleCanvasDragEnter" @dragover.prevent @drop.prevent="handleCanvasDrop">

                <template v-if="pageSchema?.children && pageSchema?.children.length">
                    <component :id="component.id" class="draggable-component"
                        v-for="(component, index) in pageSchema?.children" :key="component.id"
                        :is="componentMap[component.componentName]" v-bind="component.props" draggable="true"
                        @mousemove="handleMouseMove($event, component)" @dragstart="handleDragStart($event, component)"
                        @dragend="handleDragEnd($event, component)" @dragenter.prevent="handleComponentDragEnter"
                        @dragover.prevent="handleComponentDragOver" @dragleave.prevent="handleComponentDragLeave"
                        @drop.prevent="handleComponentDrop" @click.stop="checkedComponent(component)"
                        @change="componentChange($event, component.id)">
                    </component>
                </template>
            </div>

            <selection-menu :parentRef="parentRef" :pageSchema="pageSchema"></selection-menu>
        </div>
    </div>
</template>

<script lang='ts' setup>

import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import SelectionMenu from '@/components/SelectionMenu.vue';
import { useStore } from '@/stores';
import { MyComponent } from '@/components/RightSidebar.vue';
import { v4 as uuidv4 } from 'uuid';
import { ClearOutlined, UndoOutlined, RedoOutlined, ExportOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs'
import { throttle } from '@/utils/throttle.js'
import html2pdf from 'html2pdf.js';
import { message } from 'ant-design-vue';

// 导入自定义组件
import Text from '@/components/Graphics/Text.vue';
import Image from '@/components/Graphics/Image.vue';
import Horizon from '@/components/Graphics/Horizon.vue';

const emit = defineEmits(['loaded'])

// 组件映射表
const componentMap = {
    Text,
    Image,
    Horizon
};

const store = useStore()

const parentRef = ref(null);

const overTargetSchema = ref(null)

const pos = ref('')

// 页面JSON配置对象
const pageSchema = ref<MyComponent | null>({
    componentName: 'div',
    props: {},
    children: [],
    id: uuidv4()
})

// 更新组件props
// example：updateComponentProps(component.id, { content: "123", style: { "color": "red" } })
const updateComponentProps = (id: string, newProps: object) => {
    const componentSchema = getComponentById(id)
    componentSchema.props = { ...componentSchema.props, ...newProps }
}

// 在数组的某个元素前或后插入一个元素
const insertBeforeOrAfter = (arr: Array<any>, target: any, el: any, pos: string = 'after') => {
    if (!Array.isArray(arr) || !target || !el || !pos) return []
    const targetIndex = arr.findIndex((item) => item.id === target.id)
    if (targetIndex === -1) return []
    if (pos === 'before') {
        const beforeArr = arr.slice(0, targetIndex)
        const afterArr = arr.slice(targetIndex)
        return [...beforeArr, el, ...afterArr]
    } else if (pos === 'after') {
        const beforeArr = arr.slice(0, targetIndex + 1)
        const afterArr = arr.slice(targetIndex + 1)
        return [...beforeArr, el, ...afterArr]
    }
}

// 树遍历查找指定id的节点schema
const getComponentById = (id: string, root: MyComponent = pageSchema.value) => {
    if (root.id === id) return root
    if (root.children && root.children.length) {
        for (let i = 0; i < root.children.length; i++) {
            const node = getComponentById(id, root.children[i])
            if (node) return node
        }
    }

    return null
}

// 组件变化事件回调
const componentChange = (props, id) => {
    updateComponentProps(id, props)
}

// 拖动进入画布
const handleCanvasDragEnter = (e: DragEvent) => {
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy'; // 显示复制图标
    }
}

// 拖动放置画布
const handleCanvasDrop = (e: DragEvent) => {
    const component = store.currentDragComponent
    if (!component) return
    if (!component.id) {
        component.id = uuidv4()
        pageSchema.value.children.push(component)
    }
    console.log('pageSchema', pageSchema.value)
}

const handleMouseMove = (e: MouseEvent, component: MyComponent) => {
    const editDom: HTMLElement = document.getElementById(component.id).querySelector('.ce')
    const rect = editDom.getBoundingClientRect();
    const style = getComputedStyle(editDom);
    const paddingLeft = parseInt(style.paddingLeft);
    const paddingRight = parseInt(style.paddingRight);
    const x = e.clientX - rect.left;// 相对元素自身的水平坐标

    if (x > paddingLeft && x < (rect.width - paddingRight)) {
        editDom.style.cursor = 'text';
    } else {
        editDom.style.cursor = 'move';
    }
}

// 画布中组件拖动开始
const handleDragStart = (e: DragEvent, component: MyComponent) => {
    const editDom: HTMLElement = document.getElementById(component.id).querySelector('.ce')
    const rect = editDom.getBoundingClientRect();
    const style = getComputedStyle(editDom);
    const paddingLeft = parseInt(style.paddingLeft);
    const paddingRight = parseInt(style.paddingRight);
    const x = e.clientX - rect.left;// 相对元素自身的水平坐标

    // 禁止拖动
    if (x > paddingLeft && x < (rect.width - paddingRight)) {
        e.preventDefault();
        return false;
    }
    store.currentDragComponent = component
}

// 画布中组件拖动结束
const handleDragEnd = (e: DragEvent, component: MyComponent) => {
    store.currentDragComponent = null
}

// 拖动经过组件
const handleComponentDragOver = (e: DragEvent) => {
    const target = (e.target as HTMLElement).closest('.draggable-component');
    const draggingElement = document.getElementById(store.currentDragComponent.id)
    if (!target || target === draggingElement) return;
    overTargetSchema.value = getComponentById(target.id)
    // 获取目标元素的位置信息（基于视口的坐标）
    const rect = target.getBoundingClientRect();
    // 目标元素的中心点 x 坐标
    const centerX = rect.left + rect.width / 2;
    // 拖动事件的当前 x 坐标（鼠标/触摸点位置）
    const dragX = e.clientX;

    // 清除所有高亮类（避免状态残留）
    target.classList.remove('highlight-left', 'highlight-right');

    // 判断左侧/右侧：以目标元素中心为界
    if (dragX < centerX) {
        target.classList.add('highlight-left');
        pos.value = 'before'
    } else {
        target.classList.add('highlight-right');
        pos.value = 'after'
    }
}

// 拖动离开组件
const handleComponentDragLeave = (e: DragEvent) => {
    const target = (e.target as HTMLElement).closest('.draggable-component');
    target.classList.remove('highlight-left', 'highlight-right');
}

// 拖动进入组件
const handleComponentDragEnter = (e: DragEvent) => {
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy'; // 显示复制图标
    }
}

// 拖动放置组件
const handleComponentDrop = (e: DragEvent) => {
    const component = store.currentDragComponent
    const targetId = (e.target as HTMLElement).closest('.draggable-component').id
    if (!component || component?.id === targetId) return
    const componentIndex = pageSchema.value.children.indexOf(component)
    pageSchema.value.children.splice(componentIndex, 1)
    pageSchema.value.children = insertBeforeOrAfter(pageSchema.value.children, overTargetSchema.value, component, pos.value)
    // 清除所有组件的拖动高亮样式
    document.querySelectorAll('.draggable-component').forEach(el => {
        el.classList.remove('highlight-left', 'highlight-right');
    });
    overTargetSchema.value = null
    pos.value = ''
    console.log('pageSchema', pageSchema.value)
}

const checkedComponent = (component) => {
    const dom = document.getElementById(component.id)
    const editDom: HTMLElement = dom.querySelector('.ce')
    store.currentCheckedID = component.id
    editDom.focus()
}

const uncheckedComponent = (e) => {
    if (!store.currentCheckedID) return
    const dom = document.getElementById(store.currentCheckedID)
    const editDom: HTMLElement = dom.querySelector('.ce')
    if (e.target !== editDom) {
        store.currentCheckedID = ''
        editDom.blur()
    }
}

/** 顶部菜单 */
const isExporting = ref(false)

const UndoRedoManager = {
    maxHistory: 50,// 最大历史记录数
    historyStack: [],// 存储已操作的历史状态（用于撤销）
    futureStack: [],// 存储被撤销的状态（用于恢复）
    currentIndex: 0// 当前状态
}

const isUndoRedo = ref(false)

// 保存schema状态快照
const saveState = () => {
    const newHistory = UndoRedoManager.historyStack.slice(0, UndoRedoManager.currentIndex + 1);
    if (!newHistory.includes(JSON.stringify(pageSchema.value))) {
        newHistory.push(JSON.stringify(pageSchema.value));
        if (newHistory.length > UndoRedoManager.maxHistory) {
            newHistory.shift();
        }
        UndoRedoManager.historyStack = newHistory;
        UndoRedoManager.currentIndex = UndoRedoManager.historyStack.length - 1;
        UndoRedoManager.futureStack = [];
    }
}

const throttledSaveState = throttle(saveState, 300)

// 最后编辑时间
const lastEditTime = ref('')

const clear = () => {
    pageSchema.value = {
        componentName: 'div',
        props: {},
        children: [],
        id: uuidv4()
    }
}

const undo = () => {
    if (UndoRedoManager.currentIndex <= 0) return;
    isUndoRedo.value = true
    UndoRedoManager.futureStack.push(UndoRedoManager.historyStack[UndoRedoManager.currentIndex]);
    UndoRedoManager.currentIndex--;
    isUndoRedo.value = false
    pageSchema.value = JSON.parse(UndoRedoManager.historyStack[UndoRedoManager.currentIndex])
}

const redo = () => {
    if (UndoRedoManager.futureStack.length === 0) return;
    isUndoRedo.value = true
    UndoRedoManager.historyStack.push(UndoRedoManager.futureStack.pop());
    UndoRedoManager.currentIndex++;
    isUndoRedo.value = false
    pageSchema.value = JSON.parse(UndoRedoManager.historyStack[UndoRedoManager.currentIndex]);
}

const exportPDF = () => {
    const A4Dom: HTMLElement = document.querySelector('.a4-page')
    const option = {
        margin: 0,
        filename: '我的简历.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    }
    isExporting.value = true
    //@ts-ignore
    html2pdf().from(A4Dom).set(option).save().then(() => {
        message.success('导出成功')
        isExporting.value = false
    }).catch((err) => {
        message.success(err || '导出失败')
        isExporting.value = false
    });
}

// 自动保存
watch(() => pageSchema.value, (newVal) => {
    if (newVal) {
        store.pageSchema = newVal
        localStorage.setItem('pageSchema', JSON.stringify(pageSchema.value))
        localStorage.setItem('lastEditTime', String(Date.now()))
        if (!isUndoRedo.value) {
            throttledSaveState()
        }
    }
}, { deep: true })

onMounted(() => {
    emit('loaded')
    lastEditTime.value = localStorage.getItem('lastEditTime')
    pageSchema.value = JSON.parse(localStorage.getItem('pageSchema'))
    document.addEventListener('click', uncheckedComponent)
});

onUnmounted(() => {
    document.removeEventListener('click', uncheckedComponent);
});
</script>

<style lang='less' scoped>
.header-menu {
    background-color: #ffffff;
    padding: 8px;
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tips {
    font-size: 12px;
    color: #909399;
    opacity: 1;
    transform: translateX(0);
    animation: fade-left 0.5s ease forwards;
    animation-delay: 2s;

    @keyframes fade-left {
        to {
            opacity: 0;
            transform: translateX(-40px);
        }
    }
}

.operation {
    display: flex;
}

.menu-item {
    width: 32px;
    height: 32px;
    border-radius: 2px;
    margin: 0 4px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
        color: #9ca3af;
        pointer-events: none;
    }
}

.menu-item:hover {
    cursor: pointer;
    background-color: #e6e6e6;
}

.content {
    background-color: #f5f5f5;
    padding: 40px;
    display: flex;
    justify-content: center;
}
</style>