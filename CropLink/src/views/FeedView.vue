<template>
    <div class="p-6">
        <GroupedAdsComponent />
    </div>
    <div v-if="liveAds.length > 0 && !isLoadingAds" class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <template v-for="(liveAd,index) of liveAds" :key="index">
            <template v-if="liveAd.adType == ACCOUNT_TYPES.SELLER">
                <SellerAdThumbnailCard :ad="(liveAd as SellerAd)" />
            </template>
            <template v-if="liveAd.adType == ACCOUNT_TYPES.BUYER">
                <BuyerAdCard :ad="(liveAd as BuyerAd)" />
            </template>
        </template>
    </div>
    <div v-if="isLoadingAds">
        <LoadingSpinnerVue :isLoading="isLoadingAds"/>
    </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import LoadingSpinnerVue from '@/components/props/LoadingSpinner.vue';
import { ref, onMounted, type Ref } from 'vue';
import type { SellerAd, BuyerAd } from '@/types';
import { getPaginatedCollectionGroupWhere } from '@/firebase/utils';
import GroupedAdsComponent from '@/components/feed_components/GroupedAdsComponent.vue';
import SellerAdThumbnailCard from '@/components/cards/SellerAdThumbnailCard.vue';
import BuyerAdCard from '@/components/cards/BuyerAdCard.vue';
const {profile} = storeToRefs(useMainStore());
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const liveAds:Ref<SellerAd[]|BuyerAd[]> = ref([]);
const isLoadingAds = ref(false);

onMounted(async() => {
    isLoadingAds.value = true;
    const adType = profile.value?.accountType == ACCOUNT_TYPES.SELLER ? ACCOUNT_TYPES.BUYER : ACCOUNT_TYPES.SELLER;
    // const paginatedAds = await getPaginatedCollectionGroupWhereWhere('ads', 'live', '==', true, 'adType', '==', adType, ['postedOn','desc'], 25)
    const paginatedAds = await getPaginatedCollectionGroupWhere('ads', 'live', '==', true, ['postedOn','desc'], 25)
    console.log("ads", paginatedAds);
    liveAds.value = paginatedAds.docs as SellerAd[]|BuyerAd[];
    isLoadingAds.value = false;
})
</script>
