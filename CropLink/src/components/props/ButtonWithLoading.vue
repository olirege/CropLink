<template>
    <button :class="classes" :disabled="disabled" @click="handleClick" class="mt-2 mb-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
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
    disabled: {
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