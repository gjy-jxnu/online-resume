<template>
    <div class="content">
        <div class="ai-content">

            <div class="ai-body">
                <div v-if="aiPreview" ref="aiBodyTextRef" class="ai-body-text">{{ aiPreview }}</div>
            </div>

            <div class="ai-footer">
                <div class="ai-button" @click="handleAiButtonClick">
                    <svg t="1768482701166" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="13898" width="40" height="40">
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
    </div>
</template>

<script lang='ts' setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useStore } from '@/stores';
import { splitString, AIChat } from '@/hooks/ai';
import { message } from 'ant-design-vue';
import { SubmitResult } from 'vue-element-plus-x/types/EditorSender';
import { EditorSender } from 'vue-element-plus-x';

const store = useStore();

const emit = defineEmits(['render-schema']);

const showAiEditor = ref(false);

const senderLoading = ref(false);

const aiPreview = ref('');
const aiBodyTextRef = ref<HTMLElement | null>(null);

const tipText = computed(() => senderLoading.value ? '请耐心等待，正在努力生成中···（预估时间1 ~ 2分钟）' : '');

watch(aiPreview, () => {
    nextTick(() => {
        const el = aiBodyTextRef.value;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    });
});

const handleAiButtonClick = () => {
    showAiEditor.value = !showAiEditor.value;
};

const submitAiInputContent = (payload: SubmitResult) => {
    aiPreview.value = '';

    const handledStr = JSON.stringify(store.pageSchema).replaceAll('&nbsp;', '').replace(/data:.+?;base64,[A-Za-z0-9+/]+={0,2}/g, '');
    const maxSegmentLength = 96 * 1024 - 1;
    const segments = splitString(handledStr, maxSegmentLength);

    senderLoading.value = true;

    const promises = segments.map((segment, index) => {
        const isLast = index === segments.length - 1;

        let prompt = payload.text + '这是我简历目前的pageSchema的一部分：';
        prompt += `（这是第${index + 1}段，共${segments.length}段，请仅处理当前段内容）`;
        prompt += `\n\n${segment}`;

        return AIChat(
            prompt,
            isLast
                ? (delta: string) => {
                    aiPreview.value += delta;
                }
                : undefined
        );
    });

    Promise.all(promises).then((responses) => {
        const responseText = responses[responses.length - 1];
        aiPreview.value = responseText;

        const pattern = /```json\s*([\s\S]*?)\s*```/;
        const match = responseText.match(pattern);
        const jsonText = (match && match[1] ? match[1] : responseText).trim();
        let parsed;
        try {
            parsed = JSON.parse(jsonText);
        } catch (e) {
            message.error('JSON 解析失败 请稍后重试');
            return;
        }
        emit('render-schema', parsed);
        message.success('AI 编辑成功');
    }).catch((err) => {
        message.error(err);
    }).finally(() => {
        senderLoading.value = false;
    });
};
</script>

<style lang='less' scoped>
.content {
    padding: 8px;
    min-width: 300px;
}

.ai-content {
    height: 100%;
}

.ai-body {
    min-height: 80px;
    padding: 8px 0;
}

.ai-body-text {
    padding: 16px;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 12px;
    line-height: 1.6;
    height: 80vh;
    overflow: auto;
    border: 1px solid #ebebeb;
}

.ai-footer {
    position: fixed;
    bottom: 16px;
    display: flex;
}

.ai-button {
    cursor: pointer;
}

.ai-input {
    margin-left: 12px;
    width: 380px;
    position: relative;
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
