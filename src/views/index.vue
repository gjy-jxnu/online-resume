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
                <div class="menu-item">
                    <a-dropdown>
                        <div><span style="margin-right: 4px;">操作</span>
                            <DownOutlined></DownOutlined>
                        </div>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item style="font-size: 12px; color: #165dff;" @click="preview">
                                    预览
                                </a-menu-item>
                                <a-menu-item style="font-size: 12px; color: #165dff;" @click="exportPDF">
                                    导出PDF
                                </a-menu-item>
                                <a-menu-item style="font-size: 12px; color: #165dff;" @click="exportJSON">
                                    导出JSON
                                </a-menu-item>
                                <a-menu-item style="font-size: 12px; color: #165dff;" @click="importJSON">
                                    导入JSON
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
                <div class="menu-item">
                    <a href="https://github.com/gjy-jxnu/online-resume" target="_blank">
                        <svg t="1760714113841" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="4538" width="24" height="24">
                            <path
                                d="M960 512c0 97.76-28.704 185.216-85.664 263.264-56.96 78.016-130.496 131.84-220.64 161.856-10.304 1.824-18.368 0.448-22.848-4.032a22.4 22.4 0 0 1-7.2-17.504v-122.88c0-37.632-10.304-65.44-30.464-82.912a409.856 409.856 0 0 0 59.616-10.368 222.752 222.752 0 0 0 54.72-22.816c18.848-10.784 34.528-23.36 47.104-38.592 12.544-15.232 22.848-35.904 30.912-61.44 8.096-25.568 12.128-54.688 12.128-87.904 0-47.072-15.232-86.976-46.208-120.16 14.368-35.456 13.024-74.912-4.48-118.848-10.752-3.616-26.432-1.344-47.072 6.272s-38.56 16.16-53.824 25.568l-21.984 13.888c-36.32-10.304-73.536-15.232-112.096-15.232s-75.776 4.928-112.096 15.232a444.48 444.48 0 0 0-24.672-15.68c-10.336-6.272-26.464-13.888-48.896-22.432-21.952-8.96-39.008-11.232-50.24-8.064-17.024 43.936-18.368 83.424-4.032 118.848-30.496 33.632-46.176 73.536-46.176 120.608 0 33.216 4.032 62.336 12.128 87.456 8.032 25.12 18.368 45.76 30.496 61.44 12.544 15.68 28.224 28.704 47.072 39.04 18.848 10.304 37.216 17.92 54.72 22.816a409.6 409.6 0 0 0 59.648 10.368c-15.712 13.856-25.12 34.048-28.704 60.064a99.744 99.744 0 0 1-26.464 8.512 178.208 178.208 0 0 1-33.184 2.688c-13.024 0-25.568-4.032-38.144-12.544-12.544-8.512-23.296-20.64-32.256-36.32a97.472 97.472 0 0 0-28.256-30.496c-11.232-8.064-21.088-12.576-28.704-13.92l-11.648-1.792c-8.096 0-13.92 0.928-17.056 2.688-3.136 1.792-4.032 4.032-2.688 6.72s3.136 5.408 5.376 8.096 4.928 4.928 7.616 7.168l4.032 2.688c8.544 4.032 17.056 11.232 25.568 21.984 8.544 10.752 14.368 20.64 18.4 29.6l5.824 13.44c4.928 14.816 13.44 26.912 25.568 35.872 12.096 8.992 25.088 14.816 39.008 17.504 13.888 2.688 27.36 4.032 40.352 4.032s23.776-0.448 32.288-2.24l13.472-2.24c0 14.784 0 32.288 0.416 52.032 0 19.744 0.48 30.496 0.48 31.392a22.624 22.624 0 0 1-7.648 17.472c-4.928 4.48-12.992 5.824-23.296 4.032-90.144-30.048-163.68-83.84-220.64-161.888C92.256 697.216 64 609.312 64 512c0-81.152 20.192-156.064 60.096-224.672s94.176-122.88 163.232-163.232C355.936 84.192 430.816 64 512 64s156.064 20.192 224.672 60.096 122.88 94.176 163.232 163.232C939.808 355.488 960 430.848 960 512"
                                fill="#000000" p-id="4539"></path>
                        </svg>
                    </a>
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

        <input ref="jsonFileInput" style="display: none;" type="file" accept=".json" @change="handleJsonFileChange" />
    </div>
</template>

<script lang='ts' setup>

import { ref, reactive, computed, watch, onMounted, onUnmounted, defineExpose } from 'vue';
import SelectionMenu from '@/components/SelectionMenu.vue';
import { useStore } from '@/stores';
import { MyComponent } from '@/components/RightSidebar.vue';
import { v4 as uuidv4 } from 'uuid';
import { ClearOutlined, UndoOutlined, RedoOutlined, DownOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs'
import { throttle } from '@/utils/throttle.js'
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
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
        console.log(pageSchema.value)
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
    if (component?.id) {
        const componentIndex = pageSchema.value.children.indexOf(component)
        pageSchema.value.children.splice(componentIndex, 1)
    } else {
        component.id = uuidv4()
    }
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
const jsonFileInput = ref(null)

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

const preview = () => {
    const A4Dom: HTMLElement = document.querySelector('.a4-page')
    html2canvas(A4Dom, {
        scale: 2,
        useCORS: true,
        logging: false
    }).then(canvas => {
        localStorage.setItem('previewImgBase64', canvas.toDataURL('image/png', 0.8))
        const url = new URL('/online-resume/preview', window.location.origin);
        window.open(url.toString(), '_blank');
    }).catch((err) => {
        message.error(err || '预览失败')
    });
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
    //@ts-ignore
    html2pdf().from(A4Dom).set(option).save().then(() => {
        message.success('导出成功')
    }).catch((err) => {
        message.error(err || '导出失败')
    });
}

const exportJSON = () => {
    try {
        const jsonStr = JSON.stringify(pageSchema.value, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pageSchema.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        message.error(err || '导出失败')
    }
}

const importJSON = () => {
    jsonFileInput.value.click()
}

const handleJsonFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
        message.warning('请选择 JSON 格式的文件');
        jsonFileInput.value = ''
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            //@ts-ignore
            const jsonData = JSON.parse(event.target.result);
            pageSchema.value = jsonData;
            message.success('导入成功');

        } catch (error) {
            console.error('JSON 解析失败：', error);
            message.error('文件格式错误，无法解析为 JSON');
        }
        jsonFileInput.value = ''
    };

    reader.readAsText(file);
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
    const schema = JSON.parse(localStorage.getItem('pageSchema'))
    if (schema) {
        pageSchema.value = schema
    }
    document.addEventListener('click', uncheckedComponent)
});

onUnmounted(() => {
    document.removeEventListener('click', uncheckedComponent);
});

defineExpose({
    pageSchema
})
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
    min-width: 32px;
    height: 32px;
    border-radius: 2px;
    margin: 0 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #165dff;

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