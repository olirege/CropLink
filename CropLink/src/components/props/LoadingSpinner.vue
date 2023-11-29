<template>
    <div v-if="isLoading">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200" :class="[size]"></div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    isLoading: {
    type: Boolean,
    default: false
    },
    size: {
    type: String,
    default: "h-12 w-12"
    }
})
</script>
<style scoped>
.loader {
    border-top-color: #3498db;
    -webkit-animation: spinner 1.5s linear infinite;
    animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
}

@keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
