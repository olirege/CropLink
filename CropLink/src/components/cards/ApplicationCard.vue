<template>
    <span  class="relative bg-white flex flex-col p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4">
        <p>{{ isFirestoreTimestamp(application.createdAt) ? convertTimestampToDate(application.createdAt) : application.createdAt }}</p>
        <p>{{ application.parentType }}</p>
        <p>{{ application.name }}</p>
        <p>{{ application.email }}</p>
        <p>{{ application.phone }}</p>
        <iframe ref="iframeRef" v-if="showIframe" :src="application.resume" width="100%" height="500px" @load="onLoadIframe"></iframe>
        <div v-if="showIframe && isLoading">
            <LoadingSpinner :isLoading="isLoading"/>
        </div>
        <div class="w-full flex justify-end gap-4" v-if="showButtons">
            <CardButton @click="onRemove(application.applicationId)" :classes="'w-20'">Remove</CardButton>
            <CardButton @click="onView()" :classes="'w-30 truncate'">View Resume</CardButton>
            <CardButton @click="onMessage()" :classes="'w-20'">Message</CardButton>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Application } from '@/types';
import { type PropType, ref } from 'vue';
import { isFirestoreTimestamp, convertTimestampToDate } from '@/firebase/utils';
import CardButton from '@/components/props/CardButton.vue';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import LoadingSpinner from '../props/LoadingSpinner.vue';
const { messaging } = storeToRefs(useModalStore());
const emits = defineEmits(['edit', 'remove']);
const router = useRouter();
const props = defineProps({
    application: {
        type: Object as PropType<Application>,
        required: true
    },
    showButtons: {
        type: Boolean,
        default: true
    }
})
const isLoading = ref(true);
const onLoadIframe = () => {
    isLoading.value = false;
    console.log('loaded');
}
const onRemove = (applicationId: string) => {
    emits('remove', applicationId);
}
const showIframe = ref(false);
const onView = () => {
    showIframe.value = !showIframe.value ;
}
const onMessage = async () => {
    messaging.value.show = true;
    messaging.value.to = {
        id: props.application.applicantId,
        name: props.application.name
    }
}
</script>