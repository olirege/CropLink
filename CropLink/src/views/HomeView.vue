<template>
    <h1>HomeView</h1>
    <CardButton @click="displayNotification(NOTIFICATION_TYPES.ERROR)">Error</CardButton>
    <CardButton @click="displayNotification(NOTIFICATION_TYPES.SUCCESS)">Success</CardButton>
    <CardButton @click="displayNotification(NOTIFICATION_TYPES.WARNING)">Warning</CardButton>
    <CardButton @click="displayNotification(NOTIFICATION_TYPES.INFO)">Info</CardButton>
</template>
<script setup lang="ts">
import CardButton from '@/components/props/CardButton.vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
const { dropdowns } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const displayNotification = (state:string) => {
    if(state == NOTIFICATION_TYPES.ERROR) {
        dropdowns.value.show = true;
        dropdowns.value.type = NOTIFICATION_TYPES.ERROR;
        dropdowns.value.message = 'Failed to create escrow account';
    }
    if(state == NOTIFICATION_TYPES.SUCCESS) {
        dropdowns.value.show = true;
        dropdowns.value.type = NOTIFICATION_TYPES.SUCCESS;
        dropdowns.value.message = 'Successfully created escrow account';
    }
    if(state == NOTIFICATION_TYPES.WARNING) {
        dropdowns.value.show = true;
        dropdowns.value.type = NOTIFICATION_TYPES.WARNING;
        dropdowns.value.message = 'Warning: This is a warning';
    }
    if(state == NOTIFICATION_TYPES.INFO) {
        dropdowns.value.show = true;
        dropdowns.value.type = NOTIFICATION_TYPES.INFO;
        dropdowns.value.message = 'Info: This is an info message';
    }
}
</script>

