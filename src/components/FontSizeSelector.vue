<template>
    <div class='content'>
        <span class="icon" @click.stop="visible = !visible">
            <FontSizeOutlined></FontSizeOutlined>
        </span>

        <div v-if="visible" class="dropdown">
            <div class="option" :style="{ fontSize: noFontSizeMap[index + 1] }" v-for="(item, index) in 7" :key="index"
                @click.stop="handleChange(index + 1)">
                {{ text }}
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
// 字体大小选择器
import { ref, reactive, computed } from 'vue';
import { FontSizeOutlined } from '@ant-design/icons-vue';

const noFontSizeMap = {
    '1': '9px',
    '2': '12px',
    '3': '16px',
    '4': '18px',
    '5': '20px',
    '6': '24px',
    '7': '32px'
}

const props = defineProps({
    // 文本
    text: {
        type: String,
        default: '示例'
    },
    // 字号
    no: {
        type: [String, Number],
        default: 3
    }
})

const emit = defineEmits(['change'])

const visible = ref(false)

const handleChange = (no: string | number) => {
    visible.value = false
    emit('change', no)
}
</script>

<style lang='less' scoped>
.content {
    position: relative;

    .dropdown {
        position: absolute;
        top: 24px;
        left: 0;
    }
}

.icon {
    cursor: pointer;
}

.option {
    width: 80px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.option:hover {
    background-color: #bae0ff;
    cursor: pointer;
}
</style>