<template>
    <div class='content'>
        <span class="icon" @click.stop="visible = !visible">
            <FontColorsOutlined></FontColorsOutlined>
        </span>

        <div v-if="visible" class="picker">
            <input type="color" :value="color" @input="handleChange" @change="handleConfirm"></input>
        </div>
    </div>
</template>

<script lang='ts' setup>
// 字体颜色选择器
import { ref, reactive, computed, toRefs } from 'vue';
import { FontColorsOutlined } from '@ant-design/icons-vue';

const props = defineProps({
    // 颜色
    color: {
        type: String,
        default: '#000000'
    },
})

const { color } = toRefs(props)

const emit = defineEmits(['change'])

const visible = ref(false)

const handleChange = (e) => {
    color.value = e.target.value
    emit('change', e.target.value)
}

const handleConfirm = (e) => {
    color.value = e.target.value
    emit('change', e.target.value)
}
</script>

<style lang='less' scoped>
.content {
    position: relative;

    .picker {
        position: absolute;
        top: 24px;
        left: 0;
    }
}

.icon {
    cursor: pointer;
}
</style>