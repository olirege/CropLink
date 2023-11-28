<template>
    <div class="bg-white p-4 rounded-xl shadow transition-shadow duration-300 hover:shadow-xl">
        <div v-if="!isLoadingSellerInfo && sellerInfo">
            <span class="flex flex-row gap-2 items-end mb-2 bg-gradient-to-r from-sky-500/50 to-white rounded-md">
                <img :src=sellerInfo.storeLogoResized class="w-10 h-10 rounded-md object-cover bg-slate-500 cursor-pointer" @click="goToSellerAds(sellerInfo.id, sellerInfo.companyName)">
                <span class="flex flex-col">
                    <h1 class="text-md font-bold capitalize cursor-pointer" @click="goToSellerAds(sellerInfo.id, sellerInfo.companyName)">{{ `${sellerInfo.companyName}` }}</h1>
                    <div v-if="sellerInfo.verifiedSeller" class="flex flex-row gap-1">
                        <CheckCircleIcon class="h-4 w-4 text-sky-500"/>
                        <p class="text-xs italic"><span class="text-sky-500 font-bold">v</span>erified</p>
                        <p class="text-xs italic">{{ amountOfTime }}</p>
                    </div>
                </span>
            </span>
        </div>
        <div v-else class="w-full flex items-center justify-center h-24">
            <LoadingSpinner :isLoading="isLoadingSellerInfo"/>
        </div>
        <h3 class="text-xl font-semibold mb-2 capitalize">
            {{ `${ad.variety}` }}
        </h3>
        <div class="w-full h-96 object-cover rounded-lg">
            <template v-if="ad.images && ad.images.length > 0">
                <ImageCarousel :images="ad.resizedImages" :classes="'h-96'"/>
            </template>
            <template v-else>
                <div class="flex items-center justify-center h-full">
                    <p class="text-gray-500">No Image Available</p>
                </div>
            </template>
        </div>
        <div class="overflow-hidden rounded-lg shadow-md mt-4">
            <table class="min-w-full">
                <tbody>
                    <tr>
                        <td class="border px-4 py-2 text-sm font-medium bg-slate-100">Type:</td>
                        <td class="border px-4 py-2 text-sm">{{ ad.type }}</td>
                    </tr>
                    <tr>
                        <td class="border px-4 py-2 text-sm font-medium bg-slate-100">Variety:</td>
                        <td class="border px-4 py-2 text-sm">{{ ad.variety }}</td>
                    </tr>
                    <tr>
                        <td class="border px-4 py-2 text-sm font-medium bg-slate-100">Price per Ton:</td>
                        <td class="border px-4 py-2 text-sm">{{ ad.pricePerTon }}</td>
                    </tr>
                    <tr>
                        <td class="border px-4 py-2 text-sm font-medium bg-slate-100">Quantity:</td>
                        <td class="border px-4 py-2 text-sm">{{ ad.tons }}</td>
                    </tr>
                    <template v-if="showMore">
                        <tr>
                            <td class="border px-4 py-2 text-sm font-medium bg-slate-100">Expected Harvest Date:</td>
                            <td class="border px-4 py-2 text-sm">{{ isFirestoreTimestamp(ad.expectedHarvestDate) ? convertTimestampToDate(ad.expectedHarvestDate) : ad.expectedHarvestDate }}</td>
                        </tr>
                        <tr>
                            <td class="border px-4 py-2 text-sm font-medium bg-slate-100">Bidding End Time:</td>
                            <td class="border px-4 py-2 text-sm">{{ isFirestoreTimestamp(ad.biddingEndTime) ? convertTimestampToDate(ad.biddingEndTime) : ad.biddingEndTime }}</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="2" class="border px-4 py-2 text-sm font-medium">
                                <button class="text-sky-500 hover:underline" @click="showMore = true">Show More</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="flex items-center justify-end mt-2 space-x-4" v-if="showButtons">
                <CardButton 
                @click="onEditAd(ad.id as string)"
                v-if="!ad.live && ad.status != AD_STATUSES.SOLD"
                >
                    Edit
                </CardButton>
                <CardButton
                :classes="'truncate'"
                @click="onContactWinner(ad.id as string)"
                v-if="!ad.live && ad.status == AD_STATUSES.SOLD"
                >
                    Contact Winner
                </CardButton>
                <ButtonWithLoading 
                :disabled="ad.live"
                :isLoading="isPostingAd"
                @click="onPostAd(ad.id as string)"
                v-if="!ad.live && ad.status != AD_STATUSES.SOLD"
                >
                    Post {{ ad.status  }}
                </ButtonWithLoading>
                <CardButton 
                @click="onViewAd(ad.id as string)"
                >
                    View
                </CardButton>
                <ButtonWithLoading 
                :disabled="ad.live"
                :isLoading="isRemovingAd == ad.id"
                v-if="!ad.live && ad.status != AD_STATUSES.SOLD"
               @click="onRemoveAd(ad.id as string)"
               >
                   Remove
               </ButtonWithLoading>
        </div>
    </div>
</template>
<script setup lang="ts">
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import {isFirestoreTimestamp, convertTimestampToDate, useFirebaseFunctionCall, queryForCollectionGroupDocumentById } from '@/firebase/utils';
import type { SellerAd } from '@/types';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { type PropType, ref, computed, onMounted} from 'vue';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import CardButton from '@/components/props/CardButton.vue';
import { useMainStore } from '@/stores/main';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
const { modals, notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const AD_STATUSES = useMainStore().AD_STATUSES;
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
const showMore = ref(false);
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
const isRemovingAd = ref(true);
const onRemoveAd = async (adId:string) => {
    if(!adId) return;
    const { callFunction } = useFirebaseFunctionCall(
        'removeAd',
        {adId},
        isRemovingAd,
        undefined,
        undefined,
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Ad removed!';
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'Error while removing ad, please try again later';
        },
    );
    await callFunction();
}
const onViewAd = (adId:string) => {
    if(!adId) return;
    router.push({name: 'ad', params: {adId: adId},});
}
const onEditAd = async (adId:string) => {
    if(!adId) return;
    console.log("removeAd", adId);
    modals.value['editad'] = true;
    modals.value['context'] = ads.value.docs.find((ad) => ad.id === adId);
}
const onContactWinner = (adId:string) => {
    if(!adId) return;
    router.push({name: 'messaging', params: {adId: adId}});
}
const sellerInfo = ref(null);
const isLoadingSellerInfo = ref(false);
const getSellerInfo = async (sellerId:string) => {
    if(!sellerId) return;
    isLoadingSellerInfo.value = true;
    sellerInfo.value = await queryForCollectionGroupDocumentById(
        import.meta.env.VITE_ADS_COLLECTION,
        sellerId,
    )
    isLoadingSellerInfo.value = false;
}
const amountOfTime = computed(() => {
    // display amount of time since member joined
    if(!sellerInfo.value) return
    const now = new Date();
    const joined = new Date(sellerInfo.value.createdAt.toDate().toString());
    const diff = now.getTime() - joined.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 31);
    const years = Math.floor(months / 12);
    if (years > 0) {
        return `${years} yrs`;
    } else if (months > 0) {
        return `${months} mths`;
    } else {
        return `${days} days`;
    }
})
const goToSellerAds = (sellerId: string, sellerName: string) => {
    console.log("go to seller ads", sellerId)
    router.push({name: 'seller-ads', params: {id: sellerId, sellerName: sellerName},});
}
onMounted(async () => {
    await getSellerInfo(props.ad.uid as string);
})
</script>