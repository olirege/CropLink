<template>
    <div v-if="profile">
        <div class="p-4">
            <RouterLink class="hover:underline" to="/userboard">Post an ad</RouterLink>
        </div>
    </div>
    <div v-if="liveAds.length > 0 && !isLoadingAds" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(liveAd,index) of liveAds" :key="index" class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <template v-if="liveAd.adType == ACCOUNT_TYPES.SELLER">
                <div class="w-full h-48 object-cover rounded-lg">
                    <ImageCarousel :images="liveAd.images" />
                </div>
                <h3 class="text-xl font-semibold mb-2">
                    {{ liveAd.type }}
                </h3>
                <p class="text-sm mb-2">
                    <strong>Id:</strong> {{ liveAd.id }}
                </p>
                <p class="text-sm mb-2">
                    <strong>Variety:</strong> {{ liveAd.variety }}
                </p>
                <p class="text-sm mb-2">
                    <strong>Yield Tonnage:</strong> {{ liveAd.yieldTonnage }}
                </p>
                <p class="text-sm mb-2">
                    <strong>Expected Harvest Date:</strong> {{ liveAd.expectedHarvestDate }}
                </p>
                <p class="text-sm mb-2">
                    <strong>Price:</strong> {{ liveAd.price }}
                </p>
                <div class="flex justify-end">
                    <button 
                    @click="onPlaceBid(liveAd.id as string)"
                    class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                    Bid
                    </button>
                </div>
            </template>
            <template v-if="liveAd.adType == ACCOUNT_TYPES.BUYER">
                <h3 class="text-xl font-semibold mb-2">
                    {{ liveAd.type }}
                </h3>
                <p class="text-sm mb-2">
                        <strong>Id:</strong> {{ liveAd.id }}
                    </p>
                <p class="text-sm mb-2">
                    <strong>Yield Tonnage:</strong> {{ liveAd.yieldTonnage }}
                </p>
                <p class="text-sm mb-2">
                    <strong>Request Date:</strong> {{ liveAd.requestDate }}
                </p>
                <p class="text-sm mb-2">
                    <strong>Price:</strong> {{ liveAd.price }}
                </p>
            </template>
        </div>
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
import { getPaginatedCollectionGroupWhereWhere } from '@/firebase/utils';
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const {profile} = storeToRefs(useMainStore());
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const liveAds:Ref<SellerAd[]|BuyerAd[]> = ref([]);
const isLoadingAds = ref(false);

onMounted(async() => {
    isLoadingAds.value = true;
    const adType = profile.value?.accountType == ACCOUNT_TYPES.SELLER ? ACCOUNT_TYPES.BUYER : ACCOUNT_TYPES.SELLER;
    const paginatedAds = await getPaginatedCollectionGroupWhereWhere('ads', 'live', '==', true, 'adType', '==', adType, ['postedOn','desc'], 25)
    console.log("ads", paginatedAds);
    liveAds.value = paginatedAds.docs as SellerAd[]|BuyerAd[];
    isLoadingAds.value = false;
})

const onPlaceBid = (adId:string) => {
    if(!adId) return;
    router.push({name: 'ad', params: {adId: adId},});
}
</script>
