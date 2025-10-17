<template>
    <div class=''>
        <div ref="ceref" class="ce" style="display: block;">
            <hr>
            </hr>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { ref, reactive, computed, onMounted } from 'vue';

const ceref = ref(null)

onMounted(() => {
    if (ceref.value) {
        const originalContent = ceref.value.innerHTML;
        ceref.value.style.caretColor = 'transparent'

        ceref.value.addEventListener('keydown', (e) => {
            e.preventDefault();
        });

        ceref.value.addEventListener('input', (e) => {
            setTimeout(() => {
                if (ceref.value.innerHTML !== originalContent) {
                    ceref.value.innerHTML = originalContent;
                }
            }, 0);
        });
    }
})
</script>

<style lang='less' scoped></style>