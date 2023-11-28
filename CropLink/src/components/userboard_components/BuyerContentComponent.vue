<template>
 <div class="h-32 flex flex-row items-center divide-x border-y px-2 grid grid-cols-5">
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Number of ads</span>
            <p class="text-4xl font-bold text-slate-500">{{ ads.docs && ads.docs.length }}</p> 
        </div>
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Number of live ads</span>
            <p class="text-4xl font-bold text-slate-500">{{ numberOfLiveAds }}</p>
        </div>
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Total views</span>
            <p class="text-4xl font-bold text-slate-500">0</p>
        </div>
        <div class="p-2 flex items-center justify-center">
            <CardButton @click="onAddAd" :classes="'w-32 p-2'">Create an ad</CardButton>
        </div>
    </div>
    <span class="grid grid-flow-col gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" v-if="ads.docs && ads.docs.length > 0 && !isLoadingAds">
       <BuyerAdCard v-for="(ad,index) in ads.docs" :key="index" :ad="ad" />
   </span>
   <div v-if="ads.docs && ads.docs.length == 0 && !isLoadingAds" class="h-96 p-2 flex items-center justify-center col-span-4">
       <div class="italic">No ads found</div>
    </div>
    <div v-else>
        <LoadingSpinner :isLoading ="isLoadingAds"/>
    </div>
</template>
<script setup lang="ts">
import type { BuyerAd } from '@/types';
import BuyerAdCard from '../cards/BuyerAdCard.vue';
import { useModalStore } from '@/stores/modals';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, type Ref, onMounted, onBeforeUnmount } from 'vue';
import { useQuerySubscription } from '@/firebase/utils';
import CardButton from '../props/CardButton.vue';
import LoadingSpinner from '../props/LoadingSpinner.vue';
const { user } = storeToRefs(useMainStore());
const { modals, notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const ads: Ref<{lastVisible:BuyerAd, docs:BuyerAd[]}> = ref([]);
const isLoadingAds = ref(false);
const { subscribe, unsubscribe } = useQuerySubscription(
    import.meta.env.VITE_ADS_COLLECTION,
    [
        ['uid', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        ads.value.docs = data as BuyerAd[];
        ads.value.lastVisible = ads.value.docs && ads.value.docs.length > 0 ? ads.value.docs[ads.value.docs.length - 1] : {} as BuyerAd;
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
})
onBeforeUnmount(() => {
    unsubscribe();
})
const onAddAd = () => {
    modals.value['addad'] = true;
}
const numberOfLiveAds = computed(() => {
    if(!ads.value.docs || ads.value.docs.length === 0) {
        return 0;
    }
    return ads.value.docs.filter((ad) => ad.live == true).length;
})
</script>