<template>
    <div v-if="ad && !isLoadingAd" class="grid grid-cols-2 gap-x-4 p-5">
        <SellerAdCard :ad="ad" :showButtons="false"/>
        <div v-if="ad.live || ad.status == AD_STATUSES.SOLD">
            <CardButton v-if="(profile?.accountType == ACCOUNT_TYPES.BUYER)" @click="onPlaceBid">Place a bid</CardButton>
            <div v-if="biddingTimeLeft">
                Time left for bidding: {{ biddingTimeLeft }}
            </div>
            <span v-if="!bids || bids.length == 0">
                <p>No bids yet</p>
            </span>
            <span v-if="bids && bids.length > 0">
                <BidCard v-for="bid in bids" :bid="bid" />
            </span>
        </div>
        <div v-else>
            <p>Ad not live yet</p>
            <ButtonWithLoading 
                :disabled="ad.live"
                :isLoading="isPostingAd"
                @click="onPostAd(ad.id as string)"
                class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
import { queryForCollectionGroupDocumentById } from '@/firebase/utils';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import SellerAdCard from '@/components/cards/SellerAdCard.vue';
import BidCard from '@/components/cards/BidCard.vue';
import CardButton from '@/components/props/CardButton.vue';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { useModalStore } from '@/stores/modals';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, collectionGroup, query, where, orderBy } from 'firebase/firestore';
import { convertTimestampToDate, getPaginatedCollectionGroupWhereWhere } from '@/firebase/utils';
import { useRouter } from 'vue-router';
const { modals } = storeToRefs(useModalStore());
const { profile } = storeToRefs(useMainStore());
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const AD_STATUSES = useMainStore().AD_STATUSES;
const props = defineProps({
    adId: {
        type: String,
        required: true
    }
})

const ad = ref({} as SellerAd);
const bids:Ref<Bid[]> = ref([]);
const isLoadingAd = ref(false);
let stopSubscription: any;
const loadAd = async () => {
    isLoadingAd.value = true;
    ad.value = await queryForCollectionGroupDocumentById('ads', props.adId) as SellerAd;
    if(!ad.value) return;
    if (ad.value.live || ad.value.status != AD_STATUSES.SOLD) {
        bids.value = await getPaginatedCollectionGroupWhereWhere('bids', 'adId', '==', props.adId, 'status', '==', 'pending', ['createdAt','desc'], 10); 
        stopSubscription = onSnapshot(query(collectionGroup(db, 'bids'), where('adId', '==', props.adId), where('status', '==', 'pending'), orderBy('createdAt','desc')), (snapshot) => {
            bids.value = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                } as Bid;
            })
        })
    } else if (!ad.value.live && ad.value.status == AD_STATUSES.SOLD) {
        bids.value = await getPaginatedCollectionGroupWhereWhere('bids', 'adId', '==', props.adId, 'status', '==', 'accepted', ['createdAt','desc'], 10); 
        stopSubscription = onSnapshot(query(collectionGroup(db, 'bids'), where('adId', '==', props.adId), where('status', '==', 'accepted'), orderBy('createdAt','desc')), (snapshot) => {
            bids.value = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                } as Bid;
            })
        })
    } else {
        stopSubscription = onSnapshot(query(collectionGroup(db, 'ads'), where('id', '==', props.adId)), (snapshot) => {
            ad.value = snapshot.docs.map((doc) => {
                console.log("ad changed", doc.data());
                return {
                    ...doc.data()
                } as SellerAd;
            })
        })
    } 
    isLoadingAd.value = false;
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
    calculateTimeLeft();
})
onBeforeUnmount(() => {
    stopSubscription();
    clearInterval(interval);
});
const isPostingAd = ref(false);
const onPostAd = async (adId:string) => {
    if(!adId) return;
    isPostingAd.value = true;
    console.log("postAd", adId);
    await useMainStore().postNewAd(adId);
    isPostingAd.value = false;
}
</script>