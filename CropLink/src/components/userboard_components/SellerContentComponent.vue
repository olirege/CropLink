<template>
    <div class="h-32 flex flex-row items-center divide-x border-y px-2 grid grid-cols-5">
        <div class="p-1 sm:p-2">
            <span class="text-sm font-medium text-slate-300">Created</span>
            <p class="text-4xl font-bold text-slate-500">{{ ads.docs && ads.docs.length }}</p> 
        </div>
        <div class="p-1 sm:p-2">
            <span class="text-sm font-medium text-slate-300">Live</span>
            <p class="text-4xl font-bold text-slate-500">{{ numberOfLiveAds }}</p>
        </div>
        <div class="p-1 sm:p-2 relative">
            <span class="text-sm font-medium text-slate-300">Views</span>
            <p class="text-4xl font-bold text-slate-500">{{ adTotalViewCount }}</p>
            <template v-if="isLoadingAdsViewCount">
                <div class="absolute top-0 left-0 w-full h-full bg-slate-200/50 z-10 flex justify-center items-center">
                    <LoadingSpinner :isLoading="isLoadingAdsViewCount" class="z-20"/>
                </div>
            </template>
        </div>
        <div class="p-1 sm:p-2 relative">
            <span class="text-sm font-medium text-slate-300">Bids</span>
            <p class="text-4xl font-bold text-slate-500">{{ adsTotalBids }}</p>
            <template v-if="isLoadingBidViewCount">
                <div class="absolute top-0 left-0 w-full h-full bg-slate-200/50 z-10 flex justify-center items-center">
                    <LoadingSpinner :isLoading="isLoadingBidViewCount" class="z-20"/>
                </div>
            </template>
        </div>
        <div class="p-1 sm:p-2 flex items-center justify-center">
            <CardButton @click="onAddAd" :classes="'w-full'">Create ad</CardButton>
        </div>
    </div>
    <span class="p-2 sm:p-4 grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4" v-if="ads.docs && ads.docs.length > 0 && !isLoadingAds">
       <SellerAdDashboardCard v-for="(ad,index) in ads.docs" :key="index" :ad="ad" />
   </span>
   <div v-else-if="ads.docs && ads.docs.length == 0 && !isLoadingAds" class="h-96 p-2 flex items-center justify-center col-span-4">
       <div class="italic">No ads found</div>
    </div>
    <div v-else>
        <LoadingSpinner :isLoading ="isLoadingAds"/>
    </div>
</template>
<script setup lang="ts">
import type { SellerAd } from '@/types';
import SellerAdDashboardCard from '../cards/SellerAdDashboardCard.vue';
import { useModalStore } from '@/stores/modals';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, type Ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useQuerySubscription } from '@/firebase/utils';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import CardButton from '../props/CardButton.vue';
const { user } = storeToRefs(useMainStore());
const { modals, notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const ads: Ref<{lastVisible:SellerAd, docs:SellerAd[]}> = ref([]);
const isLoadingAds = ref(false);
const { subscribe, unsubscribe } = useQuerySubscription(
    import.meta.env.VITE_ADS_COLLECTION,
    [
        ['uid', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        ads.value.docs = data as SellerAd[];
        ads.value.lastVisible = ads.value.docs && ads.value.docs.length > 0 ? ads.value.docs[ads.value.docs.length - 1] : {} as SellerAd;
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading ads, please try again later.'       
    },
    isLoadingAds,
    ()=>{},
    ()=>{},
    (doc) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
        notifications.value.message = 'Ad has been created.'
    },
    (doc) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
        notifications.value.message = 'Ad has been removed.'
    },
)
onMounted( async ()=>{
    subscribe();
    adsTotalBidsSub();
    adsTotalViewCountSub();
})
onBeforeUnmount(() => {
    unsubscribe();
    adsTotalBidsUnsub();
    adsTotalViewCountUnsub();
})
const numberOfLiveAds = computed(() => {
    if(!ads.value.docs || ads.value.docs.length === 0) {
        return 0;
    }
    return ads.value.docs.filter((ad) => ad.live == true).length;
})
const onAddAd = () => {
    modals.value['addad'] = true;
}
const adsTotalBids = ref(0);
const isLoadingBidViewCount = ref(false);
const { subscribe:adsTotalBidsSub , unsubscribe:adsTotalBidsUnsub} = useQuerySubscription(
    import.meta.env.VITE_BIDS_COLLECTION,
    [
        ['sellerId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        adsTotalBids.value = data.length;
    },
    undefined,
    isLoadingBidViewCount,
)
const adTotalViewCount = ref(0);
const isLoadingAdsViewCount = ref(false);
const { subscribe:adsTotalViewCountSub , unsubscribe:adsTotalViewCountUnsub} = useQuerySubscription(
    import.meta.env.VITE_ADS_COLLECTION,
    [
        ['uid', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        let totalViewCount = 0;
        data.forEach((ad) => {
            totalViewCount += (ad.viewCount ? ad.viewCount : 0);
        })
        adTotalViewCount.value = totalViewCount;
    },
    undefined,
    isLoadingAdsViewCount,
)
</script>