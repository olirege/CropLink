<template>
    <span class="grid grid-flow-row space-y-4">
        <div v-for="bid in bids" class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4">
            <div class="flex flex-row">
                <span>
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
                </span>
                <span>
                    <div class="flex flex-row space-x-4">
                        <label class="block text-sm font-medium text-gray-700">Status</label>
                        <p class="text-sm">{{ bid.status }}</p>
                    </div>
                    <div class="flex flex-row space-x-4">
                        <label class="block text-sm font-medium text-gray-700">Last updated</label>
                        <p class="text-sm">{{ isFirestoreTimestamp(bid.updatedAt) ? convertTimestampToDate(bid.updatedAt) : bid.updatedAt }}</p>
                    </div>
                </span>
            </div>
            <div class="flex justify-end">
                <ButtonWithLoading :isLoading="isCancellingBid == bid.id" v-if="bid.status === BID_STATUSES.PENDING" @click="onCancelBid(bid.id as string)" class="mt-2 mb-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Cancel Bid</ButtonWithLoading>
            </div>
        </div>
    </span>
</template>
<script setup lang="ts">
import { isFirestoreTimestamp, convertTimestampToDate } from '@/firebase/utils';
import { useMainStore } from '@/stores/main';
import { ref, type PropType} from 'vue';
import ButtonWithLoading from '../props/ButtonWithLoading.vue';
import type { Bid } from '@/types';
const BID_STATUSES = useMainStore().BID_STATUSES;
const props = defineProps({
    bids: {
        type: Array as PropType<Bid[]>,
        required: true
    }
})
const isCancellingBid = ref("");
const onCancelBid = async (bidId:string) => {
    console.log("Cancelling bid", bidId);
    isCancellingBid.value = bidId;
    await useMainStore().cancelUserBid(bidId);
    isCancellingBid.value = "";
}
</script>