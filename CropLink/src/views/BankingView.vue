<template>
    <h1>
        Banking
    </h1>
    <p>
        {{ adId }}
    </p>
</template>
<script setup lang="ts">
const props = defineProps({
    adId: {
        type:String,
        required:true,
    }
})
</script>