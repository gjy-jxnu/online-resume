<template>
    <div style="display: inline-block;">
        <div v-if="!src" class="ce">
            <input type="file" accept="image/*" @change="fileChange">
        </div>

        <div v-else class="ce">
            <img title="双击调整大小" :src="src" :style="{ width: width + 'px', height: height + 'px' }"
                @dblclick.stop.prevent="openEdit"></img>
        </div>

        <a-modal v-model:open="open" title="编辑尺寸" cancelText="取消" okText="确定" @ok="handleOk">
            <a-form ref="formRef" :model="formModel" :rules="rules">
                <a-form-item label="宽度" name="width">
                    <a-input v-model:value="formModel.width" type="number"></a-input>
                </a-form-item>
                <a-form-item label="高度" name="height">
                    <a-input v-model:value="formModel.height" type="number"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang='ts' setup>
import { ref, reactive, computed, toRefs } from 'vue';

const props = defineProps({
    src: {
        type: String,
        default: ''
    },
    width: {
        type: [Number],
        default: ''
    },
    height: {
        type: [Number],
        default: ''
    }
})

let src = ref(props.src)

let width = ref(props.width)

let height = ref(props.height)

const formRef = ref(null)

const formModel = ref({
    width: 0,
    height: 0
})

const validatePass = async (_rule, value: number) => {
    if (value < 32 || value > 600) {
        return Promise.reject('限制32-600');
    } else {
        return Promise.resolve();
    }
};

const rules = ref({
    width: [
        { required: true, message: '必填', trigger: 'change' },
        { required: true, validator: validatePass, trigger: 'change' }
    ],
    height: [
        { required: true, message: '必填', trigger: 'change' },
        { required: true, validator: validatePass, trigger: 'change' }
    ]
})

const open = ref(false)

const emit = defineEmits(['change'])

const openEdit = () => {
    formModel.value.width = width.value
    formModel.value.height = height.value
    open.value = true
}

const handleOk = async () => {
    try {
        const valid = await formRef.value.validate()
        if (valid) {
            width.value = formModel.value.width
            height.value = formModel.value.height
            open.value = false
            emit('change', {
                src: src.value,
                width: width.value,
                height: height.value
            })
        }
    } catch (e) {

    }
}

// 处理图片上传
const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            // 计算合适的初始尺寸
            const maxWidth = 600;
            const maxHeight = 400;
            let w = img.width;
            let h = img.height;

            if (w > maxWidth) {
                h = (w / maxWidth) * h;
                w = maxWidth;
            }

            if (h > maxHeight) {
                w = (h / maxHeight) * w;
                h = maxHeight;
            }

            console.log(imageUrl, w, h)
            src.value = imageUrl
            width.value = w
            height.value = h

            emit('change', {
                src: imageUrl,
                width: w,
                height: h
            })
        };
    };

    reader.readAsDataURL(file);
};

const fileChange = (e) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        handleImageUpload(file);
    }

    if (target) target.value = '';
}
</script>

<style lang='less' scoped></style>