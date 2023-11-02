<template>
    <button :class="classes" @click="handleClick" style="max-height: 50px; display: flex; align-items: center; justify-content: center;">
        <LoadingSpinner :isLoading="isLoading" :size="'h-5 w-5'"/>
        <slot v-if="!isLoading"></slot>      
    </button>
</template>
<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue';
const emits = defineEmits(["click"]);
const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    },
    classes: {
        type: String,
        default: ""
    }
})
const handleClick = () => {
    emits("click")
}
</script>