<template>
    <span class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4 relative">
        <template v-if="isLoading">
            <div class="absolute top-0 left-0 w-full h-full bg-slate-200/50 z-10 flex justify-center items-center">
                <LoadingSpinner :isLoading="isLoading" class="z-20"/>
            </div>
        </template>
        <div class="flex flex-row border-top">
            <p class="text-xl capitalize my-2 pl-2 sm:pl-4 truncate">{{ gig.title }}</p>
        </div>
        <div class="flex flex-row justify-between p-2 sm:p-4">
            <p class="text-sm bg-slate-200/50 p-2 italic rounded-md">{{ isFirestoreTimestamp(gig.createdAt) ? fromNow(gig.createdAt) : gig.createdAt  }}</p>
        </div>
        <div class="flex flex-row gap-2 mb-2 items-center p-2 sm:p-4">
            <MapPinIcon class="w-5 h-5 text-slate-500"/>
            <p class="text-sm truncate italic text-slate-500">{{ gig.location }}</p>
        </div>
        <div class="flex flex-row gap-4 p-4">
            <p class="text-sm capitalize">{{ gig.description.substring(0,197) + '...' }}</p>
        </div>
        <div class="grid gap-2 px-2 sm:px-4 mb-2 divide-y">
            <div class="flex flex-col p-2 justify-between">
                <p class="text-xs italic">Number of milestones</p>
                <p class="text-sm font-bold">{{ gig.milestones.length }}</p>
            </div>
            <div class="flex flex-col p-2 justify-between">
                <p class="text-xs italic">Total</p>
                <p class="text-sm font-bold" v-currency="milestonesTotal"></p>
            </div>
        </div>
        <div class="w-full flex justify-end gap-4 p-2">
            <EyeIcon @click="onView(gig.gigId)" class="w-5 h-5 cursor-pointer text-cyan-600"/>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Gig } from '@/types';
import { type PropType, ref, computed } from 'vue';
import { isFirestoreTimestamp } from '@/firebase/utils';
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/modals';
import { useFirebaseFunctionCall } from '@/firebase/utils';
import { ArrowUpTrayIcon, ArrowDownTrayIcon, TrashIcon, PencilIcon, EyeIcon, MapPinIcon  } from '@heroicons/vue/24/outline';
import LoadingSpinner from '../props/LoadingSpinner.vue';
const { notifications, modals } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const emits = defineEmits(['edit', 'remove']);
const props = defineProps({
    gig: {
        type: Object as PropType<Gig>,
        required: true
    },
    showButtons: {
        type: Boolean,
        default: true
    }
})
const isLoading = ref(false);
const onPost = async (gigId: string) => {
    const { callFunction } = useFirebaseFunctionCall(
        'postGigPost',
        { gigId },
        isLoading,
        undefined,
        undefined,
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Gig posted successfully';
        },
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'An error occured while posting gig, please try again later';
        }
    )
    await callFunction();
}
const onTakedown = async (gigId: string) => {
    const { callFunction } = useFirebaseFunctionCall(
        'takeDownGigPost',
        { gigId },
        isLoading,
        undefined,
        undefined,
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Gig taken down successfully';
        },
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'An error occured while taking down the gig, please try again later';
        }
    )
    await callFunction();
}
const milestonesTotal = computed(() => {
    if(!props.gig.milestones || props.gig.milestones.length === 0) {
        return 0;
    }
    return props.gig.milestones.reduce((acc, curr) => acc + curr.price, 0);
})
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
const onView = (gigId: string) => {
    if(!gigId) return;
    modals.value['viewgig'] = true;
    modals.value['context'].__key = gigId;
}
const onEdit = (gigId: string) => {
    emits('edit', gigId);
}
const onRemove = (gigId: string) => {
    emits('remove', gigId);
}
</script>