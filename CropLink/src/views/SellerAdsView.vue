<template>
    <div id="seller-ad-banner" class="w-full h-64 relative">
        <img src="" class="bg-slate-500 w-full h-36">
        <div class="absolute bottom-10 left-20 flex flex-row">
            <img src="" class="z-10 border-4 border-white rounded-full w-32 h-32 bg-indigo-500">
            <div class="relative ml-5 p-1">
                <h1 class="absolute bottom-1 text-xl font-bold truncate">
                    {{ props.sellerName }}
                </h1>
            </div>
        </div>
        <div class="absolute bottom-10 right-20">
            <button class="border-2 border p-1 w-32 rounded-md flex flex-row items-center justify-center gap-2" @click="onMessage">
                <EnvelopeIcon class="w-6 h-6"/>
                <p>Message</p>
            </button>
        </div>
    </div>
    <div class="p-5">
        <h2>Job listings</h2>
        <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8" v-if="liveJobs.length > 0 && !isLoadingJobs">
            <JobThumbnailCard :job="(job as Job)" v-for="job in liveJobs"/>
        </div>
        <div v-else-if="liveJobs.length == 0 && !isLoadingJobs">
            <p class="text-center">No jobs to show</p>
        </div>
        <div v-else>
            <LoadingSpinnerVue :isLoading="isLoadingJobs"/>
        </div>
    </div>
    <div class="p-5">
        <h2>Product listings</h2>
        <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8" v-if="liveAds.length > 0 && !isLoadingAds">
            <div v-for="ad in liveAds">
                <template v-if="ad.adType == ACCOUNT_TYPES.SELLER">
                    <SellerAdThumbnailCard :ad="(ad as SellerAd)" :showButtons="false"/>
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
    </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import LoadingSpinnerVue from '@/components/props/LoadingSpinner.vue';
import { ref, onMounted, type Ref } from 'vue';
import type { SellerAd, BuyerAd, Job } from '@/types';
import { getPaginatedCollectionGroupWhereWhere } from '@/firebase/utils';
import { EnvelopeIcon } from '@heroicons/vue/24/outline';
import SellerAdThumbnailCard from '@/components/cards/SellerAdThumbnailCard.vue';
import JobThumbnailCard from '@/components/cards/JobThumbnailCard.vue';
import BuyerAdCard from '@/components/cards/BuyerAdCard.vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const liveAds:Ref<SellerAd[]|BuyerAd[]> = ref([]);
const liveJobs:Ref<Job[]> = ref([]);
const isLoadingAds = ref(false);
const isLoadingJobs = ref(false);
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
const { messaging } = storeToRefs(useModalStore());
const onMessage = async () => {
    messaging.value.show = true;
    messaging.value.to = {
        id: props.id,
        name: props.sellerName
    }
}
onMounted(async() => {
    isLoadingAds.value = true;
    const paginatedAds = await getPaginatedCollectionGroupWhereWhere('ads', 'live', '==', true, 'uid', '==', props.id, ['postedOn','desc'], 25)
    isLoadingAds.value = false;
    isLoadingJobs.value = true;
    const paginatedJobs = await getPaginatedCollectionGroupWhereWhere('jobs', 'live', '==', true, 'posterId', '==', props.id, ['updatedAt','desc'], 25)
    isLoadingJobs.value = false;
    console.log("ads", paginatedAds);
    console.log("jobs", paginatedJobs);
    liveAds.value = paginatedAds.docs as SellerAd[]|BuyerAd[];
    liveJobs.value = paginatedJobs.docs as Job[];
})
</script>
