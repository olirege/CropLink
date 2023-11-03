<template>
    <div v-if="ad && !isLoadingAd" class="grid grid-cols-2 gap-x-4 p-5">
        <div>
            <div class="w-full h-48 object-cover rounded-lg">
                <ImageCarousel :images="ad.images" v-if="ad.images && ad.images.length > 0"/>
            </div>
            <h3 class="text-xl font-semibold mb-2">
                {{ ad.type }}
            </h3>
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
                <strong>Expected Harvest Date:</strong> {{ ad.expectedHarvestDate }}
            </p>
            <p class="text-sm mb-2">
                <strong>Price:</strong> {{ ad.price }}
            </p>
        </div>
        <div>
            <button @click="onPlaceBid" class="mt-2 mb-2 w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Place a bid</button>
            <span v-if="!bids || bids.length == 0">
                <p>No bids yet</p>
            </span>
            <span v-if="bids && bids.length > 0">
                <div v-for="bid in bids" class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4">
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
                </div>
            </span>
        </div>
    </div>
    <div v-if="isLoadingAd">
        <LoadingSpinner :isLoading="isLoadingAd"/>
    </div>
</template>
<script setup lang="ts">
import type { SellerAd, Bid } from '@/types';
import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import { queryForCollectionGroupDocumentById } from '@/firebase/utils';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, collectionGroup, query, where, orderBy } from 'firebase/firestore';
import { isFirestoreTimestamp, convertTimestampToDate, getPaginatedCollectionGroupWhereWhere } from '@/firebase/utils';
const { modals } = storeToRefs(useModalStore());
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
    bids.value = await getPaginatedCollectionGroupWhereWhere('bids', 'adId', '==', props.adId, 'status', '==', 'pending', ['createdAt','desc'], 10); 
    isLoadingAd.value = false;
    stopSubscription = onSnapshot(query(collectionGroup(db, 'bids'), where('adId', '==', props.adId), where('status', '==', 'pending'), orderBy('createdAt','desc')), (snapshot) => {
        bids.value = snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            } as Bid;
        })
    })
}
const onPlaceBid = () => {
    modals.value['addbid'] = true;
}
onMounted(async () => {
    await loadAd();
})
onUnmounted(() => {
    stopSubscription();
})
</script>