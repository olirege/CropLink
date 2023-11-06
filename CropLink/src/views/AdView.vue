<template>
    <div v-if="ad && !isLoadingAd" class="grid grid-cols-2 gap-x-4 p-5">
        <div>
            <div class="w-full h-48 object-cover rounded-lg">
                <ImageCarousel :images="ad.resizedImages" v-if="ad.images && ad.images.length > 0"/>
            </div>
            <h3 class="text-xl font-semibold mb-2">
                {{ ad.type }}
            </h3>
            <p class="text-sm mb-2">
                <strong>Status:</strong> {{ ad.status }}
            </p>
            <p class="text-sm mb-2">
                <strong>Id:</strong> {{ ad.id }}
            </p>
            <p class="text-sm mb-2">
                <strong>Variety:</strong> {{ ad.variety }}
            </p>
            <p class="text-sm mb-2">
                <strong>Yield Tonnage:</strong> {{ ad.yieldTonnage }}
            </p>
            <p class="text-sm mb-2">
                <strong>Expected Harvest Date:</strong> {{ isFirestoreTimestamp(ad.expectedHarvestDate) ? convertTimestampToDate(ad.expectedHarvestDate) : ad.expectedHarvestDate }}
            </p>
            <p class="text-sm mb-2">
                <strong>Price:</strong> {{ ad.price }}
            </p>
        </div>
        <div v-if="ad.live || ad.status == AD_STATUSES.SOLD">
            <button v-if="(profile?.accountType == ACCOUNT_TYPES.BUYER)" @click="onPlaceBid" class="mt-2 mb-2 w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Place a bid</button>
            <div v-if="biddingTimeLeft">
                Time left for bidding: {{ biddingTimeLeft }}
            </div>
            <span v-if="!bids || bids.length == 0">
                <p>No bids yet</p>
            </span>
            <span v-if="bids && bids.length > 0">
                <div v-for="bid in bids" class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4">
                    <div class="flex flex-row space-x-4" v-if="bid.status == BID_STATUSES.ACCEPTED ">
                        <p class="text-sm text-green-400">{{ bid.status == BID_STATUSES.ACCEPTED ? "Winning Bid" : bid.status  }}</p>
                    </div>
                    <div class="flex flex-row space-x-4">
                        <label class="block text-sm font-medium text-gray-700">Buyer</label>
                        <p class="text-sm">{{ bid.buyerId.substring(0,5) }}</p>
                    </div>
                    <div class="flex flex-row space-x-4">
                        <label class="block text-sm font-medium text-gray-700">Offer</label>
                        <p class="text-sm">{{ bid.price }}</p>
                    </div>
                    <div class="flex flex-row space-x-4">
                        <label class="block text-sm font-medium text-gray-700">Time</label>
                        <p class="text-sm">{{ isFirestoreTimestamp(bid.createdAt) ? convertTimestampToDate(bid.createdAt) : bid.createdAt  }}</p>
                    </div>
                    <div class="flex flex-row justify-end" v-if="bid.status == BID_STATUSES.ACCEPTED">
                        <button @click="onContactWinner" class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Contact</button>
                    </div>
                </div>
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
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { useModalStore } from '@/stores/modals';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, collectionGroup, query, where, orderBy } from 'firebase/firestore';
import { isFirestoreTimestamp, convertTimestampToDate, getPaginatedCollectionGroupWhereWhere } from '@/firebase/utils';
import { useRouter } from 'vue-router';
const { modals } = storeToRefs(useModalStore());
const { profile } = storeToRefs(useMainStore());
const router = useRouter();
const BID_STATUSES = useMainStore().BID_STATUSES;
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
                    id: doc.id,
                    ...doc.data()
                } as Bid;
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
const onContactWinner = (bidId:string) => {
    console.log("contactWinner", bidId);
    router.push({name: 'messaging', params: {adId: ad.value.id}});
}
</script>