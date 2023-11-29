<template>
    <span  class="relative bg-white flex flex-col p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4">
        <div class="flex flex-row justify-between">
            <p class="font-bold text-xl capitalize">{{ application.applicantId?.substring(0,5) }}</p>
            <p class="italic bg-slate-300/50 p-1 rounded-md">{{ isFirestoreTimestamp(application.createdAt) ? fromNow(application.createdAt) : application.createdAt }}</p>
        </div>
        <p>{{ application.parentType }}</p>
        <p>{{ application.name }}</p>
        <p>{{ application.email }}</p>
        <p>{{ application.phone }}</p>
        <div v-if="showIframe && isLoading">
            <LoadingSpinner :isLoading="isLoading"/>
        </div>
        <div class="w-full flex justify-end gap-4 items-center" v-if="showButtons">
            <TrashIcon @click="onRemove(application.applicationId)" class="w-5 h-5 cursor-pointer" />
            <EyeIcon @click="onView()" class="w-5 h-5 cursor-pointer" />
            <EnvelopeIcon @click="onMessage()" class="w-5 h-5 cursor-pointer" />
            <ButtonWithLoading :isLoading="isCreatingRoom" @click="sendInvitation()" :classes="'w-30 truncate'" v-if="application.parentType == 'gig'">Invite to Contract</ButtonWithLoading>
        </div>
        <iframe ref="iframeRef" v-if="showIframe" :src="application.resume" width="100%" height="500px" @load="onLoadIframe"></iframe>
    </span>
</template>
<script setup lang="ts">
import type { Application } from '@/types';
import { type PropType, ref } from 'vue';
import { isFirestoreTimestamp, convertTimestampToDate, useFirebaseFunctionCall } from '@/firebase/utils';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { useMainStore } from '@/stores/main';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { EnvelopeIcon, TrashIcon, EyeIcon } from '@heroicons/vue/24/outline';
const { messaging, notifications } = storeToRefs(useModalStore());
const { user } = storeToRefs(useMainStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const emits = defineEmits(['edit', 'remove']);
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
    messaging.value.context = {
        __key: 'application',
        application: props.application
    }
}
const isCreatingRoom = ref(false);
const sendInvitation = async () => {
    let res;
    const { callFunction } = useFirebaseFunctionCall(
        'initializeChatAndContract',
        {
            adId: props.application.parentId,
            sellerId: props.application.applicantId,
            buyerId: user.value.uid,
            contractType: "gig",
        },
        isCreatingRoom,
        ()=>{},
        (data) => (res = data),
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Invitation sent!';
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'Error sending invitation';
        },
    );
    await callFunction();
}
const fromNow = (date:Timestamp) => {
    const now = new Date();
    const messageDate = date.toDate();
    const diff = now.getTime() - messageDate.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if(days > 1) {
        return `${days} days ago`;
    } else if (days == 1) {
        return `${days} day ago`;
    } else if(hours > 0) {
        return `${hours} hours ago`;
    } else if(minutes > 0) {
        return `${minutes} minutes ago`;
    } else if(seconds > 0) {
        return `${seconds} seconds ago`;
    } else {
        return `just now`;
    }
}
</script>