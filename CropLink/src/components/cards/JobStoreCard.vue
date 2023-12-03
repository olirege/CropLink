<template>
    <span  class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4 relative">
        <template v-if="isLoading">
            <div class="absolute top-0 left-0 w-full h-full bg-slate-200/50 z-10 flex justify-center items-center">
                <LoadingSpinner :isLoading="isLoading" class="z-20"/>
            </div>
        </template>
        <div class="flex flex-row gap-4">
            <p class="text-xl capitalize my-2 pl-4 truncate">{{ job.title }}</p>
        </div>
        <div class="flex flex-row justify-between p-4">
            <p class="text-sm bg-slate-200/50 p-2 italic rounded-md">{{ isFirestoreTimestamp(job.createdAt) ? fromNow(job.createdAt) : job.createdAt  }}</p>
        </div>
        <div class="flex flex-row gap-1 pl-4 mb-2">
            <MapPinIcon class="w-5 h-5"/>
            <p class="text-sm truncate italic text-slate-500">{{ job.location }}</p>
        </div>
        <div class="flex flex-row gap-4 p-4">
            <p class="text-sm capitalize">{{ job.description.substring(0,197) + '...' }}</p>
        </div>
        <div class="flex flex-col gap-2 sm:gap-4 divide-y sm:px-2 sm:px-4 mb-2 justify-end">
            <div class="flex flex-col p-2">
                <p class="text-xs">
                    Salary Min.
                </p>
                <p class="text-xl" v-currency="job.salaryMin"></p>
            </div>
            <div class="flex flex-col p-2">
                <p class="text-xs">
                    Salary Max.
                </p>
                <p class="text-xl" v-currency="job.salaryMax"></p>
            </div>
        </div>
        <div class="w-full flex justify-end gap-4 pr-4 pb-4">
            <EyeIcon @click="onView(job.jobId)" class="w-5 h-5  cursor-pointer text-cyan-600" />
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Job } from '@/types';
import { type PropType, ref } from 'vue';
import { isFirestoreTimestamp } from '@/firebase/utils';
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/modals';
import { useFirebaseFunctionCall } from '@/firebase/utils';
import { ArrowUpTrayIcon, ArrowDownTrayIcon, TrashIcon, PencilIcon, EyeIcon, MapPinIcon } from '@heroicons/vue/24/outline';
import LoadingSpinner from '../props/LoadingSpinner.vue';
const { notifications, modals } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const emits = defineEmits(['edit', 'remove']);
const props = defineProps({
    job: {
        type: Object as PropType<Job>,
        required: true
    },
    showButtons: {
        type: Boolean,
        default: true
    }
})
const isLoading = ref(false);
const onPost = async (jobId: string) => {
    const { callFunction } = useFirebaseFunctionCall(
        'postJobPost',
        { jobId },
        isLoading,
        undefined,
        undefined,
        ()=> {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Job Posted';
        },
        ()=> {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'An error occured during the process, please try again later';
        },
    );
    await callFunction();
}
const onTakedown = async (jobId: string) => {
    const { callFunction } = useFirebaseFunctionCall(
        'takeDownJobPost',
        { jobId },
        isLoading,
        undefined,
        undefined,
        ()=> {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Job post is now down';
        },
        ()=> {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'An error occured during the process, please try again later';
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
const onView = (jobId: string) => {
    if(!jobId) return;
    modals.value['viewjob'] = true;
    modals.value['context'].__key = jobId;
}
const onEdit = (jobId: string) => {
    emits('edit', jobId);
}
const onRemove = (jobId: string) => {
    emits('remove', jobId);
}
</script>