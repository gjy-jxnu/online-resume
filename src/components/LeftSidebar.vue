<template>
    <div class='content'>
        <div class="menu-fold-btn" :class="{ fold: collapsed, unfold: !collapsed }">
            <a-button type="text" size="small" @click="changeFold">
                <MenuUnfoldOutlined v-if="collapsed" />
                <MenuFoldOutlined v-else />
            </a-button>
        </div>
        <a-menu v-model:selectedKeys="current" mode="inline" :items="items" :inline-collapsed="collapsed"
            :inlineIndent="24" />
    </div>
</template>

<script lang='ts' setup>

import { ref, reactive, computed, h, toRefs } from 'vue';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons-vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_5028347_fpi21mt7sm.js',
});

const collapsed = ref(false)

const emit = defineEmits(['fold-change'])

const current = ref<string[]>([''])

const items = ref([
    {
        key: 'base',
        label: '基本信息',
        title: '',
        icon: h(IconFont, { type: 'icon-user-base' })
    },
    {
        key: 'education',
        label: '教育背景',
        title: '',
        icon: h(IconFont, { type: 'icon-education' })
    },
    {
        key: 'evaluation',
        label: '自我评价',
        title: '',
        icon: h(IconFont, { type: 'icon-evaluation' })
    },
    {
        key: 'work',
        label: '工作经历',
        title: '',
        icon: h(IconFont, { type: 'icon-work-experience' })
    },
    {
        key: 'project',
        label: '项目经历',
        title: '',
        icon: h(IconFont, { type: 'icon-project' })
    },
    {
        key: 'skills',
        label: '职业技能',
        title: '',
        icon: h(IconFont, { type: 'icon-skills' })
    },
    {
        key: 'certificates',
        label: '资格证书',
        title: '',
        icon: h(IconFont, { type: 'icon-certs' })
    },
])

const changeFold = () => {
    collapsed.value = !collapsed.value
    emit('fold-change', collapsed.value)
}

</script>

<style lang='less' scoped>
.content {
    position: sticky;
    top: 0;
    height: 100vh;
}

.menu-fold-btn {
    margin: 4px;

    &.fold {
        padding: 0 21px;
    }

    &.unfold {
        padding: 0 15px;
    }
}

:deep(.ant-menu) {
    border: none !important;
}
</style>