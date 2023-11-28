<template>
    <div v-if="ad && !isLoadingAd" class="grid grid-cols-2 gap-x-4 p-5">
        <SellerAdCard :ad="ad" :showButtons="false"/>
        <div v-if="ad.live || ad.status == AD_STATUSES.SOLD" class="p-4">
            <CardButton v-if="(profile?.accountType == ACCOUNT_TYPES.BUYER)" @click="onPlaceBid">Place a bid</CardButton>
            <div v-if="biddingTimeLeft">
                <h3 class="text-xl font-semibold mb-2 capitalize">Time left</h3> 
                <div class="flex flex-row gap-2 items-center justify-center mb-2 rounded-md h-10 border-y">
                    <p class="text-xl">{{ biddingTimeLeft }}</p>
                </div>
            </div>
            <span v-if="!bids || bids.length == 0">
                <p>No bids yet</p>
            </span>
            <span v-if="bids && bids.length > 0">
                <BidCard v-for="bid in bids" :bid="bid" :showViewButton="false" :sellerId="(ad.uid as string)"/>
            </span>
        </div>
        <div v-else>
            <p>Ad not live yet</p>
            <ButtonWithLoading 
                :disabled="ad.live"
                :isLoading="isPostingAd"
                @click="onPostAd(ad.id as string)"
                v-if="!ad.live"
                >
                Post
            </ButtonWithLoading>
        </div>
    </div>
    <div v-if="isLoadingAd">
        <LoadingSpinner :isLoading="isLoadingAd"/>
    </div>
</template>
<script setup lang="ts">
import type { SellerAd, Bid } from '@/types';
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import SellerAdCard from '@/components/cards/SellerAdCard.vue';
import BidCard from '@/components/cards/BidCard.vue';
import CardButton from '@/components/props/CardButton.vue';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { useModalStore } from '@/stores/modals';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { convertTimestampToDate, useQuerySubscription, useFirebaseFunctionCall } from '@/firebase/utils';
const { modals, notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const { profile } = storeToRefs(useMainStore());
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const AD_STATUSES = useMainStore().AD_STATUSES;
const props = defineProps({
    adId: {
        type: String,
        required: true
    }
})

const bids:Ref<Bid[]> = ref([]);
const ad = ref({} as SellerAd);
const isLoadingAd = ref(false);
let unsubscribeToAd: any;
let unsubscribeToBids: any;
const isLoadingBids = ref(false);

const loadBids = async () => {
    const collectionName = import.meta.env.VITE_BIDS_COLLECTION;
    const conditions = [
        ['adId', '==', props.adId],
        ['status', '==', (ad.value.live || ad.value.status != AD_STATUSES.SOLD) ? 'pending' : 'accepted']
    ];
    const order = ['createdAt', 'desc'];
    const { subscribe, unsubscribe } = useQuerySubscription(
        collectionName,
        conditions,
        order,
        (data) => {
            bids.value = data;
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = "Error loading bids, please try again later"
        },
        isLoadingBids, // Assuming you have a loading state for bids
        ()=>{},
        ()=>{},
        ()=>{
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = "A new bid has been placed on your ad"
        },
    );

    unsubscribeToBids = unsubscribe;
    subscribe();
}
const loadAd = async () => {
    const collectionName = import.meta.env.VITE_ADS_COLLECTION;
    const conditions = [
        ['id', '==', props.adId],
    ];
    const order = [];
    const { subscribe, unsubscribe } = useQuerySubscription(
        collectionName,
        conditions,
        order,
        (data) => {
            ad.value = data[0];
            loadBids();
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = "Error loading ad, please try again later"
        },
        isLoadingAd,
    );
    unsubscribeToAd = unsubscribe;
    subscribe();
}
const biddingTimeLeft = ref('');
const calculateTimeLeft = () => {
    if (!ad.value.biddingEndTime) {
        return '';
    }
    const endTime = convertTimestampToDate(ad.value.biddingEndTime);
    const now = Date.now();
    const timeLeft = endTime - now;
    if (timeLeft < 0) {
        biddingTimeLeft.value = 'Bidding has ended';
        clearInterval(interval);
        return;
    }
    // Convert timeLeft from milliseconds to a more readable format
    let seconds = Math.floor((timeLeft / 1000) % 60);
    let minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    let hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    biddingTimeLeft.value = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
};
const interval = setInterval(calculateTimeLeft, 1000);

const onPlaceBid = () => {
    modals.value['addbid'] = true;
}
onMounted(async () => {
    await loadAd();
    await increaseAdViewCount(props.adId);
    calculateTimeLeft();
})
onBeforeUnmount(() => {
    if (unsubscribeToBids) {
        unsubscribeToBids();
    }
    if (unsubscribeToAd) {
        unsubscribeToAd();
    }
    clearInterval(interval);
});
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
const increasingViewCount = ref(false);
const increaseAdViewCount = async (adId:string) => {
    if(!adId) return;
    const { callFunction } = useFirebaseFunctionCall(
            'increaseAdViewCount',
            {adId},
            increasingViewCount,
        );
        await callFunction();
}
</script>