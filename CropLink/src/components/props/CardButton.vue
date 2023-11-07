<template>
    <button @click="$emit('click')" class="mt-2 mb-2 w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
        <slot></slot>
    </button>
</template>
<script setup lang="ts">
const emits = defineEmits(['click'])
</script>