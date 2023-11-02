<template>
    <div>
        <h1>User Profile</h1>
        <div v-if="profile">{{ profile  }}</div>
        <div v-else>Loading...</div>
    </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, onMounted} from 'vue';
const { profile } = storeToRefs(useMainStore());
</script>