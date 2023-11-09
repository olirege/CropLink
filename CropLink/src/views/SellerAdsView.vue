<template>
    <h1 class="font-xl">
        {{ props.sellerName }}'s ads
    </h1>
    <div class="grid grid-cols-2" v-if="liveAds.length > 0 && !isLoadingAds">
        <div v-for="ad in liveAds">
            <template v-if="ad.adType == ACCOUNT_TYPES.SELLER">
                <SellerAdCard :ad="(ad as SellerAd)" />
            </template>
            <template v-if="ad.adType == ACCOUNT_TYPES.BUYER">
                <BuyerAdCard :ad="(ad as BuyerAd)" />
            </template>
        </div>
    </div>
    <div v-else-if="liveAds.length == 0 && !isLoadingAds">
        <p class="text-center">No ads to show</p>
    </div>
    <div v-else>
        <LoadingSpinnerVue :isLoading="isLoadingAds"/>
    </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import LoadingSpinnerVue from '@/components/props/LoadingSpinner.vue';
import { ref, onMounted, type Ref } from 'vue';
import type { SellerAd, BuyerAd } from '@/types';
import { getPaginatedCollectionGroupWhereWhere } from '@/firebase/utils';
import SellerAdCard from '@/components/cards/SellerAdCard.vue';
import BuyerAdCard from '@/components/cards/BuyerAdCard.vue';
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const liveAds:Ref<SellerAd[]|BuyerAd[]> = ref([]);
const isLoadingAds = ref(false);
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    sellerName: {
        type: String,
        required: true
    }
})
onMounted(async() => {
    isLoadingAds.value = true;
    const paginatedAds = await getPaginatedCollectionGroupWhereWhere('ads', 'live', '==', true, 'uid', '==', props.id, ['postedOn','desc'], 25)
    console.log("ads", paginatedAds);
    liveAds.value = paginatedAds.docs as SellerAd[]|BuyerAd[];
    isLoadingAds.value = false;
})
</script>
