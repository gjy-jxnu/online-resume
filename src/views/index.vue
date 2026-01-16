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

        <div class="ai-content">
            <div class="ai-button" @click="handleAiButtonClick">
                <svg t="1768482701166" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="13898" width="48" height="48">
                    <path
                        d="M92.330423 512.975238c0 229.595429 185.977905 415.768381 415.548952 416.012191 229.546667 0.24381 415.939048-185.514667 416.426667-415.085715 0.512-229.571048-185.051429-416.158476-414.598095-416.914285A415.548952 415.548952 0 0 0 92.281661 512.999619z"
                        fill="#D5E7FF" p-id="13899"></path>
                    <path
                        d="M511.048899 64.999619c205.531429 4.242286 383.512381 143.11619 436.638476 340.675048a148.675048 148.675048 0 0 1 75.288381 139.751619c0 61.513143-26.89219 114.44419-66.876952 135.923809l-20.577524 60.074667c-40.862476 120.393143-151.893333 204.409905-280.429714 216.941714a45.202286 45.202286 0 0 1-43.52 33.645714 45.372952 45.372952 0 0 1-45.104762-45.665523c0-12.117333 4.754286-23.722667 13.214476-32.280381a44.860952 44.860952 0 0 1 31.890286-13.360762c17.798095 0 33.206857 10.435048 40.521143 25.6 119.832381-11.385905 223.451429-89.624381 261.461333-201.923048l11.53219-33.304381c-2.974476 0.316952-6.022095 0.487619-9.094095 0.487619V421.205333c-47.542857-184.880762-213.138286-315.587048-404.967619-319.683047-191.683048 4.144762-357.083429 134.875429-404.48 319.683047v270.823619C46.44547 691.541333 0.511756 626.249143 0.511756 545.401905a149.138286 149.138286 0 0 1 74.386286-139.751619c53.052952-197.38819 230.790095-336.213333 436.175238-340.675048z"
                        fill="#87B2FF" p-id="13900"></path>
                    <path
                        d="M529.139566 288.572952a600.30781 600.30781 0 0 1 210.724571 30.232381c50.41981 19.358476 92.257524 39.69219 92.257524 77.385143v68.949334c0 43.641905-50.41981 78.872381-111.908571 78.87238H336.042423c-61.513143 0-111.908571-35.230476-111.908572-78.87238V396.190476c0-37.692952 44.373333-55.53981 94.768762-77.360762a569.58781 569.58781 0 0 1 210.236953-30.256762z m-65.706667 28.330667l-55.393524 107.76381-84.772571 12.824381 100.376381 3.632761 39.204571-65.170285 72.070095 132.949333 58.09981-101.351619 28.501333 34.304 85.74781-4.096-75.093334-12.068571-40.71619-64.853334-57.197714 92.550095-70.826667-136.484571z"
                        fill="#87B2FF" p-id="13901"></path>
                </svg>
            </div>

            <div class="ai-input">
                <transition name="ai-loading-fade">
                    <div v-if="senderLoading" class="ai-loading">
                        <div class="ai-loading-icon">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div class="ai-loading-text">
                            {{ tipText || '正在为你润色简历，请稍候…' }}
                        </div>
                    </div>
                </transition>
                <transition name="ai-editor">
                    <EditorSender v-show="showAiEditor" :loading="senderLoading" :disabled="senderLoading"
                        placeholder="Hello！在此输入内容，我可以帮你优化简历哦。" clearable variant="updown"
                        @submit="submitAiInputContent" />
                </transition>
            </div>
        </div>
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
import { splitString, AIChat } from '@/hooks/ai';
import { SubmitResult } from 'vue-element-plus-x/types/EditorSender';
import { EditorSender } from 'vue-element-plus-x';

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
    const editDom: HTMLElement = document.getElementById(component.id)?.querySelector('.ce')
    if (!editDom) return
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
    const editDom: HTMLElement = document.getElementById(component.id)?.querySelector('.ce')
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
    const editDom: HTMLElement = dom?.querySelector('.ce')
    store.currentCheckedID = component.id
    editDom.focus()
}

const uncheckedComponent = (e) => {
    if (!store.currentCheckedID) return
    const dom = document.getElementById(store.currentCheckedID)
    const editDom: HTMLElement = dom?.querySelector('.ce')
    if (e.target !== editDom) {
        store.currentCheckedID = ''
        editDom?.blur()
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

/** 是否显示AI对话框 */
const showAiEditor = ref(false)

const tipText = computed(() => senderLoading.value ? '请耐心等待，正在努力生成中···（预估时间1 ~ 2分钟）' : '')

const senderLoading = ref(false)

const handleAiButtonClick = () => {
    showAiEditor.value = !showAiEditor.value
}

const submitAiInputContent = (payload: SubmitResult) => {
    const handledStr = JSON.stringify(pageSchema.value).replaceAll('&nbsp;', '',).replace(/data:.+?;base64,[A-Za-z0-9+/]+={0,2}/g, '')
    const maxSegmentLength = 96 * 1024 - 1
    const segments = splitString(handledStr, maxSegmentLength)

    senderLoading.value = true

    // 对每一段分别调用AI接口
    const promises = segments.map((segment, index) => {
        // 构建每段的提示信息
        let prompt = payload.text + '这是我简历目前的pageSchema的一部分：'
        prompt += `（这是第${index + 1}段，共${segments.length}段，请仅处理当前段内容）`
        prompt += `\n\n${segment}`

        return AIChat(prompt)
    })

    Promise.all(promises).then((responses) => {

        const responseText = responses[responses.length - 1]

        const pattern = /```json\s*([\s\S]*?)\s*```/
        const match = responseText.match(pattern)
        const jsonText = (match && match[1] ? match[1] : responseText).trim()
        console.log(jsonText)
        let parsed
        try {
            parsed = JSON.parse(jsonText)
        } catch (e) {
            message.error('JSON 解析失败 请稍后重试')
        }
        console.log(parsed)
        pageSchema.value = parsed
        message.success('AI 编辑成功')
    }).catch((err) => {
        message.error(err)
    }).finally(() => {
        senderLoading.value = false
    })
}

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

.ai-content {
    position: fixed;
    bottom: 40px;
    left: 40px;
    display: flex;
    align-items: flex-end;
}

.ai-button {
    cursor: pointer;
}

.ai-input {
    margin-left: 20px;
    width: 600px;
    position: relative;
}

.ai-tip {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 8px;
}

.ai-loading {
    position: absolute;
    inset: 0;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    pointer-events: none;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(56, 189, 248, 0.9));
    border-radius: 8px;
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.25);
    color: #ffffff;
    box-sizing: border-box;
}

.ai-loading-icon {
    display: inline-flex;
    gap: 6px;
    margin-right: 12px;
}

.ai-loading-icon span {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background-color: rgba(255, 255, 255, 0.9);
    animation: ai-bounce 1s infinite ease-in-out;
}

.ai-loading-icon span:nth-child(2) {
    animation-delay: 0.12s;
}

.ai-loading-icon span:nth-child(3) {
    animation-delay: 0.24s;
}

.ai-loading-text {
    font-size: 13px;
    letter-spacing: 0.04em;
}

@keyframes ai-bounce {

    0%,
    80%,
    100% {
        transform: translateY(0);
        opacity: 0.6;
    }

    40% {
        transform: translateY(-6px);
        opacity: 1;
    }
}

.ai-loading-fade-enter-active,
.ai-loading-fade-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.ai-loading-fade-enter-from,
.ai-loading-fade-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.ai-tip {
    padding: 8px;
    font-size: 16px;
    color: #909399;
}

/* AI编辑器过渡动画 */
.ai-editor-enter-active,
.ai-editor-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.ai-editor-enter-from {
    opacity: 0;
    transform: scale(0.95) translateX(-20px);
}

.ai-editor-leave-to {
    opacity: 0;
    transform: scale(0.95) translateX(-20px);
}
</style>
