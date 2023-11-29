<template>
    <div class="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4">
        <div class="flex flex-row space-x-4" v-if="bid.status == BID_STATUSES.ACCEPTED ">
            <p class="text-sm text-green-400">{{ bid.status == BID_STATUSES.ACCEPTED ? "Winning Bid" : bid.status  }}</p>
        </div>
        <div class="flex flex-row space-x-4 justify-end h-6">
            <p class="text-xs italic">{{ isFirestoreTimestamp(bid.createdAt) ? fromNow(bid.createdAt) : bid.createdAt  }}</p>
        </div>
        <span class="flex flex-row justify-between h-6 items-center">
            <div class="flex flex-row space-x-4">
                <label class="block text-sm font-medium text-gray-700">Buyer</label>
                <p class="text-sm">{{ bid.buyerId.substring(0,5) }}</p>
            </div>
            <div class="flex flex-row space-x-4">
                <label class="block text-sm font-medium text-gray-700">Offer</label>
                <p class="text-sm font-bold" v-currency="bid.price"></p>
            </div>
        </span>
        <div class="flex justify-end mt-2 space-x-4">
            <ButtonWithLoading 
                :isLoading="isCancellingBid" 
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
import { useModalStore } from '@/stores/modals';
import { useFirebaseFunctionCall } from '@/firebase/utils';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
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
const isCancellingBid = ref(false);
const onCancelBid = async (bidId:string) => {
    if(!bidId) return;
    const { callFunction } = useFirebaseFunctionCall(
            'cancelBid',
            {bidId},
            isCancellingBid,
            undefined,
            undefined,
            () => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
                notifications.value.message = 'Bid cancelled successfully';
            },
            (error) => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.ERROR;
                notifications.value.message = 'Error while cancelling bid, please try again later';
            },
        );
        await callFunction();
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
const fromNow = (date:Timestamp) => {
    const now = new Date();
    const messageDate = date.toDate();
    const diff = now.getTime() - messageDate.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if(days > 0) {
        return `${days} days ago`;
    } else if(hours > 0) {
        return `${hours} hours ago`;
    } else if(minutes > 0) {
        return `${minutes} minutes ago`;
    } else if(seconds > 0) {
        return `${seconds} seconds ago`;
    } else {
        return `just now`;
    }
}
</script>