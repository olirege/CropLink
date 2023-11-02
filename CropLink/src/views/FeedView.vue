<template>
    <div v-if="profile">
        <div class="p-4">
            <RouterLink class="hover:underline" to="/userboard">Post an ad</RouterLink>
        </div>
    </div>
    <div v-if="liveAds.length > 0 && !isLoadingAds">
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
import { getPaginatedCollectionGroupWhere } from '@/firebase/utils';
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const {profile} = storeToRefs(useMainStore());
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const liveAds:Ref<SellerAd[]|BuyerAd[]> = ref([]);
const isLoadingAds = ref(false);

onMounted(async() => {
    isLoadingAds.value = true;
    const paginatedAds = await getPaginatedCollectionGroupWhere('ads', 'live', '==', true,'postedOn', 25)
    console.log("ads", paginatedAds);
    liveAds.value = paginatedAds.docs as SellerAd[]|BuyerAd[];
    isLoadingAds.value = false;
})
</script>
