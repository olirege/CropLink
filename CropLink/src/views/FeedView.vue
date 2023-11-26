<template>
    <div class="flex items-center justify-center h-64 bg-sky-100/50 rounded-md bg-center">
        <span class="flex flex-row gap-2">
            <h1 class="text-2xl font-bold hover:underline" @click="()=>tab = 0" :class="tab == 0 ? 'text-cyan-600' : ''">Producers</h1>
            <h1 class="text-2xl font-bold hover:underline" @click="()=>tab = 1" :class="tab == 1 ? 'text-cyan-600' : ''">Products</h1>
            <h1 class="text-2xl font-bold hover:underline" @click="()=>tab = 2" :class="tab == 2 ? 'text-cyan-600' : ''">Buyers</h1>
            <h1 class="text-2xl font-bold hover:underline" @click="()=>tab = 3" :class="tab == 3 ? 'text-cyan-600' : ''">Jobs</h1>
            <h1 class="text-2xl font-bold hover:underline" @click="()=>tab = 4" :class="tab == 4 ? 'text-cyan-600' : ''">Gigs</h1>
        </span>
    </div>
    <template v-if="!isLoadingAds">
        <div class="p-6" v-if="tab == 0">
            <GroupedAdsComponent />
        </div>
        <div v-if="tab == 1">
            <SellerCategoryComponent/>
        </div>
        <div v-if="tab == 2" class="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <template v-for="(liveAd,index) of liveBuyerAds" :key="index">
                <BuyerAdCard :ad="(liveAd as BuyerAd)" :showButtons="false"/>
            </template>
        </div>
        <div v-if="tab == 3" class="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <template v-for="(liveJob,index) of liveJobs" :key="index">
                <JobThumbnailCard :job="(liveJob as Job)" :showButtons="false"/>
            </template>
        </div>
        <div v-if="tab == 4" class="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <template v-for="(liveGig,index) of liveGigs" :key="index">
                <GigThumbnailCard :gig="(liveGig as Gig)" :showButtons="false"/>
            </template>
        </div>
    </template>
    <template v-else>
        <div class="h-64 w-full flex items-center justify-center">
            <LoadingSpinnerVue :isLoading="isLoadingAds"/>
        </div>
    </template>
</template>
<script setup lang="ts">
import LoadingSpinnerVue from '@/components/props/LoadingSpinner.vue';
import { ref, onMounted, type Ref } from 'vue';
import type { SellerAd, BuyerAd, Job, Gig } from '@/types';
import { getPaginatedCollectionGroupWhere, getPaginatedCollectionGroupWhereWhere } from '@/firebase/utils';
import GroupedAdsComponent from '@/components/feed_components/GroupedAdsComponent.vue';
import SellerCategoryComponent from '@/components/feed_components/SellerCategoryComponent.vue';
// import SellerAdThumbnailCard from '@/components/cards/SellerAdThumbnailCard.vue';
import BuyerAdCard from '@/components/cards/BuyerAdCard.vue';
import JobThumbnailCard from '@/components/cards/JobThumbnailCard.vue';
import GigThumbnailCard from '@/components/cards/GigThumbnailCard.vue';
const liveSellerAds:Ref<SellerAd[]|BuyerAd[]> = ref([]);
const liveBuyerAds:Ref<SellerAd[]|BuyerAd[]> = ref([]);
const liveJobs:Ref<Job[]> = ref([]);
const liveGigs:Ref<Gig[]> = ref([]);
const isLoadingAds = ref(false);
const tab = ref(0);
onMounted(async() => {
    isLoadingAds.value = true;
    // const paginatedSellerAds = await getPaginatedCollectionGroupWhereWhere('ads', 'live', '==', true,"adType", "==", "seller", ['postedOn','desc'], 25)
    const paginatedBuyerAds = await getPaginatedCollectionGroupWhereWhere('ads', 'live', '==', true,"adType", "==", "buyer", ['postedOn','desc'], 25)
    const paginatedJobs = await getPaginatedCollectionGroupWhere('jobs', 'live', '==', true, ['updatedAt','desc'], 25)
    const paginatedGigs = await getPaginatedCollectionGroupWhere('gigs', 'live', '==', true, ['updatedAt','desc'], 25)
    // liveJobs.value = paginatedJobs.docs as Job[];
    liveGigs.value = paginatedGigs.docs as Gig[];
    // liveSellerAds.value = paginatedSellerAds.docs as SellerAd[]
    liveBuyerAds.value = paginatedBuyerAds.docs as BuyerAd[]
    isLoadingAds.value = false;
})
</script>
