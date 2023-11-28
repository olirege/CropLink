<template>
    <div class="relative bg-white p-4 rounded-xl shadow transition-shadow duration-300 hover:shadow-xl">
        <template v-if="isPostingAd">
            <div class="absolute top-0 left-0 w-full h-full bg-slate-200/50 z-10 flex justify-center items-center">
                <LoadingSpinner :isLoading="isPostingAd" class="z-20"/>
            </div>
        </template>
        <div class="relative w-full h-52 bg-gray-200 rounded-xl overflow-hidden">
            <template v-if="ad.images && ad.images.length > 0">
                <ImageCarousel :images="ad.resizedImages" class="h-full object-cover"/>
            </template>
            <template v-else>
                <div class="flex items-center justify-center h-full">
                    <p class="text-gray-500">No Image Available</p>
                </div>
            </template>
        </div>
        <div class="mt-4">
            <h3 class="text-2xl font-bold">{{ ad.variety }}</h3>
            <div class="flex flex-row justify-between">
            <div class="flex flex-row gap-4 items-center" v-if="ad.live">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <p class="text-sm text-green-500">LIVE</p>
            </div>
            <div class="flex flex-row gap-4 items-center" v-else>
                <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                <p class="text-sm text-red-500">NOT LIVE</p>
            </div>
            <p class="text-sm bg-slate-200/50 p-2 italic rounded-md">{{ isFirestoreTimestamp(ad.createdAt) ? fromNow(ad.createdAt) : gig.createdAt  }}</p>
            </div>
            <div class="flex flex-row justify-between w-full">
                <div class="flex flex-row gap-2 text-sm justify-between gap-2">
                    <p class="font-semibold" v-currency="ad.pricePerTon">/ton</p> 
                </div>
                <div class="flex flex-row gap-2 text-sm justify-between gap-2">
                    <p class="font-semibold">{{ ad.tons }} tons</p>
                </div>
            </div>
            <div class="flex justify-end space-x-4 mt-4">
                <template v-if="showButtons">
                    <ArrowUpTrayIcon class="h-5 w-5 text-cyan-600" v-if="!ad.live" @click="onPostAd(ad.id)" title="Post ad'"/>
                    <ArrowDownTrayIcon class="h-5 w-5 text-cyan-600" v-if="ad.live" @click="onTakedownAd(ad.id)" title="Take down ad"/>
                    <EnvelopeIcon class="h-5 w-5 text-cyan-600" @click="onContactWinner(ad.id)" title="Contact"/>
                    <TrashIcon class="h-5 w-5 text-cyan-600" @click="onRemoveAd(ad.id)" title="Remove"/>
                    <PencilIcon class="h-5 w-5 text-cyan-600" @click="onEditAd(ad.id)" title="Edit"/>
                </template>
                <EyeIcon class="h-5 w-5 text-cyan-600" @click="onViewAd(ad.id)" title="View"/>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import type { SellerAd } from '@/types';
import { type PropType, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useFirebaseFunctionCall, isFirestoreTimestamp } from '@/firebase/utils';
import { ArrowUpTrayIcon, ArrowDownTrayIcon, EnvelopeIcon, TrashIcon, PencilIcon, EyeIcon  } from '@heroicons/vue/24/outline';
import LoadingSpinner from '../props/LoadingSpinner.vue';
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const { modals, notifications } = storeToRefs(useModalStore());
const router = useRouter()
const emits = defineEmits(['edit'])
const props = defineProps({
    ad: {
        type: Object as PropType<SellerAd>,
        required: true
    },
    showButtons: {
        type: Boolean,
        default: true
    }
})
const isPostingAd = ref(false);
const onPostAd = async (adId:string) => {
    if(!adId) return;
    const { callFunction } = useFirebaseFunctionCall(
            'postAd',
            {adId},
            isPostingAd,
            undefined,
            undefined,
            () => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
                notifications.value.message = 'Ad is live!';
            },
            (error) => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.ERROR;
                notifications.value.message = 'Error while posting ad, please try again later';
            },
        );
        await callFunction();
}
const onTakedownAd = async (adId:string) => {
    if(!adId) return;
    const { callFunction } = useFirebaseFunctionCall(
            'takedownAd',
            {adId},
            isPostingAd,
            undefined,
            undefined,
            () => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
                notifications.value.message = 'Ad taken down!';
            },
            (error) => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.ERROR;
                notifications.value.message = 'Error while taken down ad, please try again later';
            },
    );
    await callFunction();
}
const onRemoveAd = async (adId:string) => {
    if(!adId) return;
    console.log("removeAd", adId);
    modals.value['confirmremove'] = true;
    modals.value['context'] = {
        adId: adId,
        __key: 'ad',
    };
}
const onViewAd = (adId:string) => {
    if(!adId) return;
    router.push({name: 'ad', params: {adId: adId},});
}
const onEditAd = async (adId:string) => {
    if(!adId) return;
    console.log("removeAd", adId);
    modals.value['editad'] = true;
    modals.value['context'] = ad;
}
const onContactWinner = (adId:string) => {
    if(!adId) return;
    router.push({name: 'messaging', params: {adId: adId}});
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