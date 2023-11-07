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
        <div class="flex flex-row justify-end" v-if="bid.status == BID_STATUSES.ACCEPTED">
            <button @click="onContactWinner(bid.adId)" class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Contact</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { isFirestoreTimestamp, convertTimestampToDate } from '@/firebase/utils';
import { type PropType } from 'vue';
import { useMainStore} from '@/stores/main';
import { useRouter } from 'vue-router';
import type { Bid } from '@/types';
const props = defineProps({
    bid: {
        type: Object as PropType<Bid>,
        required: true
    }
})
const BID_STATUSES = useMainStore().BID_STATUSES;
const router = useRouter();
const onContactWinner = (adId:string) => {
    console.log("contactWinner", adId);
    router.push({name: 'messaging', params: {adId: adId}});
}
</script>