<template>
    <span class="grid grid-flow-row space-y-4" v-if="bids.docs && bids.docs.length > 0 && !isLoadingBids" >
        <BidCard v-for="bid in bids.docs" :bid="bid" />
    </span>
    <div v-else-if="isLoadingBids">
        <LoadingSpinner :isLoading ="isLoadingBids"/>
    </div>
    <span v-else class="h-96 p-2 flex items-center justify-center">
        <p class="italic">No bids yet</p>
    </span>
</template>
<script setup lang="ts">
import { type Ref, ref, onMounted} from 'vue';
import type { Bid } from '@/types';
import BidCard from '@/components/cards/BidCard.vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { getPaginatedCollectionGroupWhere } from '@/firebase/utils';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
const { user } = storeToRefs(useMainStore());
const bids: Ref<{lastVisible:Bid, docs:Bid[]}> = ref([]);
const isLoadingBids = ref(false);
const loadBids = async () => {
    isLoadingBids.value = true;
    bids.value = await getPaginatedCollectionGroupWhere('bids', 'buyerId', '==', user.value.uid , ['createdAt','desc'], 10);
    isLoadingBids.value = false;
}
onMounted(async()=>{
    await loadBids();
})
</script>