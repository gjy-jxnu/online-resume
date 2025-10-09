<template>
  <div class='menu' ref="menuRef" :class="{ show: visible, hide: !visible }"
    :style="{ top: `${top}px`, left: `${left}px` }">

    <!-- 菜单项 -->
    <div :class="{ active: item?.active }" class="menu-item" v-for="(item, index) in menuItems.filter((i) => i.visible)"
      :key="index">
      <component v-if="iconComponents[item.icon]" :title="item.label" :is="iconComponents[item.icon]"
        @click.stop="handleMenuItemClick(item)"></component>

      <font-size-selector v-if="item.icon === 'FontSizeSelector'"
        @change="fontSizeChange($event, item)"></font-size-selector>

      <font-color-selector v-if="item.icon === 'FontColorSelector'"
        @change="fontColorChange($event, item)"></font-color-selector>
    </div>

  </div>
</template>

<script lang='ts' setup>
import FontSizeSelector from './FontSizeSelector.vue';
import FontColorSelector from './FontColorSelector.vue';
import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { CopyOutlined, ScissorOutlined, SnippetsOutlined, BoldOutlined, ItalicOutlined, UnderlineOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined } from '@ant-design/icons-vue';

// 图标类型的简单组件
const iconComponents = {
  CopyOutlined,
  ScissorOutlined,
  SnippetsOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined
}

// 自定义组件
const extraComponent = {
  FontSizeSelector,
  FontColorSelector
}

type menuItem = {
  label: string,
  value: string,
  icon: string,
  visible: boolean,
  active?: boolean
}

const props = defineProps({
  // 父组件
  parentRef: {
    type: Object,
    default: null
  }
})

// 菜单项
const menuItems = ref<menuItem[]>([
  { label: '复制', value: 'copy', icon: 'CopyOutlined', visible: true },
  { label: '剪切', value: 'cut', icon: 'ScissorOutlined', visible: true },
  { label: '粘贴', value: 'paste', icon: 'SnippetsOutlined', visible: true },
  { label: '加粗', value: 'bold', icon: 'BoldOutlined', visible: true, active: false },
  { label: '斜体', value: 'italic', icon: 'ItalicOutlined', visible: true, active: false },
  { label: '下划线', value: 'underline', icon: 'UnderlineOutlined', visible: true, active: false },
  { label: '字体颜色', value: 'foreColor', icon: 'FontColorSelector', visible: true },
  { label: '字体大小', value: 'fontSize', icon: 'FontSizeSelector', visible: true },
  { label: '左对齐', value: 'justifyLeft', icon: 'AlignLeftOutlined', visible: false, active: false },
  { label: '居中', value: 'justifyCenter', icon: 'AlignCenterOutlined', visible: false, active: false },
  { label: '右对齐', value: 'justifyRight', icon: 'AlignRightOutlined', visible: false, active: false },
])

const emit = defineEmits(['visible-change', 'action'])

// 当前目标元素
const target = ref(null)

// 当前selection对象
let currentSelection = ref(null)

// 菜单是否可见
const visible = ref(false)

// 菜单DOM引用
const menuRef = ref(null)

// 菜单位置
const top = ref(0)
const left = ref(0)

// 处理选择事件
function handleSelection() {
  const selection = window.getSelection();
  currentSelection.value = selection

  // 检查是否有有效选择
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    // 检查选择是否非空
    if (!range.collapsed) {
      // 初始化菜单状态
      initMenuStatus(selection)
      // 定位菜单
      positionMenu(range);
      showMenu();
      return true;
    }
  }
  // 无有效选择，隐藏菜单
  hideMenu();
  return false;
}

// 定位菜单到选择区域附近
function positionMenu(range) {
  if (!menuRef.value) return;

  // 获取选择区域的边界信息
  const rect = range.getBoundingClientRect();
  const menuHeight = menuRef.value.offsetHeight;
  const menuWidth = menuRef.value.offsetWidth;

  // 计算基础位置（选择区域上方居中）
  let calculatedTop = window.scrollY + rect.top - menuHeight - 5;
  let calculatedLeft = window.scrollX + rect.left + (rect.width / 2) - (menuWidth / 2);

  // 防止菜单超出视口顶部
  if (calculatedTop < window.scrollY) {
    calculatedTop = window.scrollY + rect.bottom + 5;
  }

  // 防止菜单超出视口左侧
  if (calculatedLeft < window.scrollX) {
    calculatedLeft = window.scrollX + 10;
  }

  // 防止菜单超出视口右侧
  if (calculatedLeft + menuWidth > window.scrollX + window.innerWidth) {
    calculatedLeft = window.scrollX + window.innerWidth - menuWidth - 10;
  }

  // 设置最终位置
  top.value = calculatedTop;
  left.value = calculatedLeft;
}

// 显示菜单
function showMenu() {
  if (!visible.value && menuRef.value) {
    visible.value = true;
    emit('visible-change', true);
  }
}

// 隐藏菜单
function hideMenu() {
  if (visible.value && menuRef.value) {
    visible.value = false;
    emit('visible-change', false);
  }
}

function initMenuStatus(selection: Selection) {
  const parent: HTMLElement = selection.focusNode.parentElement

  menuItems.value.filter((item) => typeof item?.active === 'boolean').forEach((item) => {
    if (['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight'].includes(item.value)) {
      item.active = document.queryCommandState(item.value) ? true : false
    }

    if (['justifyLeft', 'justifyCenter', 'justifyRight'].includes(item.value)) {
      const editableDom = parent.closest('.ce')
      item.visible = editableDom && window.getComputedStyle(editableDom).display === 'block'
    }

  })
}

// 处理菜单项点击
function handleMenuItemClick(item: menuItem, extraParams: any = {}) {
  if (typeof item?.active === 'boolean') {
    item.active = !item.active
  }

  const selection = window.getSelection();
  const parent = selection.focusNode.parentElement

  // 执行默认操作
  switch (item.value) {
    case 'copy':
      document.execCommand('copy');
      break;
    case 'cut':
      document.execCommand('cut');
      break;
    case 'paste':
      document.execCommand('paste');
      break;
    case 'bold':
      document.execCommand('bold', false, null);
      break;
    case 'italic':
      document.execCommand('italic', false, null);
      break;
    case 'underline':
      document.execCommand('underline', false, null);
      break;
    case 'foreColor':
      const { color = '#000000' } = extraParams
      document.execCommand('foreColor', false, color)
      break;
    case 'fontSize':
      const { no = '3' } = extraParams
      document.execCommand('fontSize', false, no);
      break;
    case 'justifyLeft':
      document.execCommand('justifyLeft');
      break;
    case 'justifyCenter':
      document.execCommand('justifyCenter');
      break;
    case 'justifyRight':
      document.execCommand('justifyRight');
      break;
  }

  initMenuStatus(selection)

  // 触发事件，允许父组件处理自定义逻辑
  emit('action', {
    action: item.value,
    selection,
    range: selection.rangeCount > 0 ? selection.getRangeAt(0) : null
  });

}

// 事件监听处理函数
function handleMouseUp(e) {
  target.value = e.target
  handleSelection();
}

function handleKeyUp(e) {
  // 处理键盘选择（如Shift+箭头）
  target.value = e.target
  if (['Shift', 'Control'].includes(e.key)) {
    handleSelection();
  }
}

function handleClickOutside(e) {
  // 点击菜单外部时隐藏
  target.value = e.target
  if (visible.value && menuRef.value && !menuRef.value.contains(e.target) && target.value !== e.target) {
    hideMenu();
  }
}

const fontSizeChange = (no, item) => {
  handleMenuItemClick(item, { no })
}

const fontColorChange = (color, item) => {
  handleMenuItemClick(item, { color })
}

// 注册事件监听
watch(() => props.parentRef, () => {
  // 防止全局监听导致事件污染
  if (props.parentRef) {
    props.parentRef.addEventListener('mouseup', handleMouseUp);
    props.parentRef.addEventListener('keyup', handleKeyUp);
    props.parentRef.addEventListener('click', handleClickOutside);
  }
})

onMounted(() => {

});

// 清理事件监听
onUnmounted(() => {
  props.parentRef.removeEventListener('mouseup', handleMouseUp);
  props.parentRef.removeEventListener('keyup', handleKeyUp);
  props.parentRef.removeEventListener('click', handleClickOutside);
});

// 这里只是对文本的监听
watch(() => '' + currentSelection.value, (newText, oldText) => {
  if (!newText) {
    showMenu()
  }
})

</script>

<style lang='less' scoped>
.menu {
  width: 160px;
  position: fixed;
  z-index: 99;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s;
  display: flex;
  flex-wrap: wrap;

  &.show {
    opacity: 1;
    pointer-events: auto;
  }

  &.hide {
    opacity: 0;
    pointer-events: none;
  }
}

.menu-item {
  user-select: none;
  padding: 2px;

  &.active {
    background-color: #e6f7ff;
    color: #1890ff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

.menu-item:hover {
  cursor: pointer;
  background-color: rgba(22, 119, 255, 0.1);
}

.menu-item:focus {
  outline: none;
}
</style>