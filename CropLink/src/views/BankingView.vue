<template>
    <div class="grid grid-cols-2 gap-x-4 p-5">
        <SellerAdCard :ad="ad" :showButtons="false" v-if="contract && contract.type == 'sell'"/>
        <GigDetailCard :gig="contract.context" :showButtons="false" v-else-if="contract && contract.type == 'gig'"/>
        <div v-else>
            <p>
                Failed to load ad
            </p>
        </div>
        <BankingComponent :contractId="contractId"/>
    </div>
</template>
<script setup lang="ts">
import SellerAdCard from '@/components/cards/SellerAdCard.vue';
import GigDetailCard from '@/components/cards/GigDetailCard.vue';
import BankingComponent from '@/components/userboard_components/BankingComponent.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { queryForCollectionGroupDocumentById, getDocument } from '@/firebase/utils';
import type { SellerAd, Contract } from '@/types';
const props = defineProps({
    adId: {
        type:String,
        required:true,
    },
    contractId: {
        type:String,
        required:true,
    },
    transactionId: {
        type:String,
        required:true,
    },
})
const ad = ref({} as SellerAd);
const isLoadingAd = ref(false);
let stopSubscription: any;
const loadAd = async () => {
    isLoadingAd.value = true;
    ad.value = await queryForCollectionGroupDocumentById(import.meta.env.VITE_ADS_COLLECTION, props.adId) as SellerAd;
    isLoadingAd.value = false;
}
const contract = ref({} as Contract);
const isLoadingContract = ref(false);
const loadContract = async () => {
    isLoadingContract.value = true;
    contract.value = await getDocument(import.meta.env.VITE_CONTRACTS_COLLECTION, props.contractId) as Contract;
    isLoadingContract.value = false;
}
onMounted(async () => {
    await loadAd();
    await loadContract();
})
onBeforeUnmount(() => {
    if(stopSubscription) stopSubscription();
})
</script>