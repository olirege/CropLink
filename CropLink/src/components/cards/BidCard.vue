<template>
    <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4">
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
        <span>
            <div class="flex flex-row space-x-4">
                <label class="block text-sm font-medium text-gray-700">Last updated</label>
                <p class="text-sm">{{ isFirestoreTimestamp(bid.updatedAt) ? convertTimestampToDate(bid.updatedAt) : bid.updatedAt }}</p>
            </div>
        </span>
        <div class="flex justify-end mt-2 space-x-4">
            <ButtonWithLoading 
                :isLoading="isCancellingBid == bid.id" 
                v-if="bid.status === BID_STATUSES.PENDING && bid.buyerId == user?.uid"
                @click="onCancelBid(bid.id as string)">
                Cancel Bid
            </ButtonWithLoading>
            <CardButton
            v-if="showViewButton"
            @click="onViewAd(bid.adId)"
            >
                View
            </CardButton>
            <CardButton @click="onContact(bid.adId)"
            v-if="bid.status == BID_STATUSES.ACCEPTED && (bid.buyerId == user?.uid || sellerId == user?.uid)"
            >
                Contact
            </CardButton>
        </div>
    </div>
</template>
<script setup lang="ts">
import { isFirestoreTimestamp, convertTimestampToDate } from '@/firebase/utils';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { type PropType, ref } from 'vue';
import { useMainStore } from '@/stores/main';
import { useRouter } from 'vue-router';
import type { Bid } from '@/types';
import CardButton from '../props/CardButton.vue';
import { storeToRefs } from 'pinia';
const { user } = storeToRefs(useMainStore());
const props = defineProps({
    bid: {
        type: Object as PropType<Bid>,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
    showViewButton: {
        type: Boolean,
        default: true
    }
})
const BID_STATUSES = useMainStore().BID_STATUSES;
const router = useRouter();
const isCancellingBid = ref("");
const onCancelBid = async (bidId:string) => {
    console.log("Cancelling bid", bidId);
    isCancellingBid.value = bidId;
    await useMainStore().cancelUserBid(bidId);
    isCancellingBid.value = "";
}
const onViewAd = (adId:string) => {
    if(!adId) return;
    router.push({name: 'ad', params: {adId: adId},});
}
const onContact = (adId:string) => {
    if (!adId) return;
    console.log("contactWinner", adId);
    router.push({name: 'messaging', params: {adId: adId}});
}
</script>