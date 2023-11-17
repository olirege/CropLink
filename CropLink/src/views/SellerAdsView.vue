<template>
    <div id="seller-ad-banner" class="w-full h-64 relative">
        <img :src="sellerSignature.bannerPic" class="bg-slate-500 w-full h-48 object-cover" ref="bannerPic" v-if="!isLoadingProfile">
        <div v-else class="bg-slate-500 w-full h-48 animate-pulse"></div>
        <div class="absolute bottom-5 left-20 flex flex-row">
            <img :src="sellerSignature.profilePicResized" class="z-10 border-4 border-white rounded-full w-32 h-32 bg-indigo-500" ref="profilePic" v-if="!isLoadingProfile">
            <div v-else class="z-10 border-4 border-white rounded-full w-32 h-32 bg-indigo-500 animate-pulse"></div>
            <div class="relative ml-5 p-1">
                <h1 class="absolute bottom-1 text-xl font-bold truncate">
                    {{ props.sellerName }}
                </h1>
            </div>
        </div>
        <div class="absolute bottom-5 right-20">
            <button class="border-2 border p-1 w-32 rounded-md flex flex-row items-center justify-center gap-2 bg-white" @click="onMessage">
                <EnvelopeIcon class="w-6 h-6"/>
                <p>Message</p>
            </button>
        </div>
    </div>
    <div class="flex flex-row gap-6 w-full p-5">
        <div class="relative flex flex-col h-full w-full">
            <h2>Job Openings</h2>
            <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8" v-if="liveJobs.length > 0 && !isLoadingJobs">
                <JobThumbnailCard :job="(job as Job)" v-for="job in liveJobs.slice(0,MAX_JOBS)"/>
            </div>
            <div v-else-if="liveJobs.length == 0 && !isLoadingJobs">
                <p class="text-center">No jobs to show</p>
            </div>
            <div v-else>
                <LoadingSpinnerVue :isLoading="isLoadingJobs"/>
            </div>
            <div v-if="liveJobs.length == 2 && !isLoadingJobs" class="flex w-full justify-end" @click="onShowMoreJobs">
                <p class="text-sm underline cursor-pointer">View more jobs</p>
            </div>
        </div>
        <div class="flex flex-col h-full w-full relative">
            <h2>Small Gigs</h2>
            <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8" v-if="liveGigs.length > 0 && !isLoadingGigs">
                <GigThumbnailCard :gig="(gig as Gig)" v-for="gig in liveGigs.slice(0,MAX_GIGS)"/>
            </div>
            <div v-else-if="liveGigs.length == 0 && !isLoadingGigs">
                <p class="text-center">No gigs to show</p>
            </div>
            <div v-else>
                <LoadingSpinnerVue :isLoading="isLoadingGigs"/>
            </div>
            <div v-if="liveGigs.length == 2 && !isLoadingGigs" class="flex w-full justify-end"  @click="onShowMoreGigs">
                <p class="text-sm underline cursor-pointer">View more gigs</p>
            </div>
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
import type { SellerAd, BuyerAd, Job, Gig } from '@/types';
import { getPaginatedCollectionGroupWhereWhere, getDocument } from '@/firebase/utils';
import { EnvelopeIcon } from '@heroicons/vue/24/outline';
import SellerAdThumbnailCard from '@/components/cards/SellerAdThumbnailCard.vue';
import JobThumbnailCard from '@/components/cards/JobThumbnailCard.vue';
import GigThumbnailCard from '@/components/cards/GigThumbnailCard.vue';
import BuyerAdCard from '@/components/cards/BuyerAdCard.vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const liveAds:Ref<SellerAd[]|BuyerAd[]> = ref([]);
const liveJobs:Ref<Job[]> = ref([]);
const liveGigs:Ref<Gig[]> = ref([]);
const isLoadingAds = ref(false);
const isLoadingJobs = ref(false);
const isLoadingGigs = ref(false);
const isLoadingProfile = ref(false);
const MAX_JOBS = ref(2);
const MAX_GIGS = ref(2);
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
const sellerSignature = ref({
    name: '',
    profilePicResized: '',
    bannerPic: ''
})
const onShowMoreGigs = async () => {
    isLoadingGigs.value = true;
    const lastVisible = liveGigs.value[liveGigs.value.length - 1];
    const newGigs = await getPaginatedCollectionGroupWhereWhere('gigs', 'live', '==', true, 'posterId', '==', props.id, ['updatedAt','desc'], 10, lastVisible);
    liveGigs.value = [...liveGigs.value, ...newGigs.docs] as Gig[];
    isLoadingGigs.value = false;
    MAX_GIGS.value = MAX_GIGS.value + 10;
}
const onShowMoreJobs = async () => {
    isLoadingJobs.value = true;
    const lastVisible = liveJobs.value[liveJobs.value.length - 1];
    const newJobs = await getPaginatedCollectionGroupWhereWhere('jobs', 'live', '==', true, 'posterId', '==', props.id, ['updatedAt','desc'], 10, lastVisible);
    liveJobs.value = [...liveJobs.value, ...newJobs.docs] as Job[];
    isLoadingJobs.value = false;
    MAX_JOBS.value = MAX_JOBS.value + 10;
}
onMounted(async() => {
    isLoadingProfile.value = true;
    isLoadingAds.value = true;
    isLoadingJobs.value = true;
    isLoadingGigs.value = true;
    const promises = [];
    promises.push(getDocument(import.meta.env.VITE_ADS_COLLECTION, props.id).then((doc)=>{
        sellerSignature.value.name = doc.name;
        sellerSignature.value.profilePicResized = doc.profilePicResized;
        sellerSignature.value.bannerPic = doc.bannerPic;
        isLoadingProfile.value = false;
    }));
    promises.push(getPaginatedCollectionGroupWhereWhere('ads', 'live', '==', true, 'uid', '==', props.id, ['postedOn','desc'], 25).then((paginatedAds)=>{
        liveAds.value = paginatedAds.docs as SellerAd[]|BuyerAd[];
        isLoadingAds.value = false;
    }));
    promises.push(getPaginatedCollectionGroupWhereWhere('jobs', 'live', '==', true, 'posterId', '==', props.id, ['updatedAt','desc'], 2).then((paginatedJobs)=>{
        liveJobs.value = paginatedJobs.docs as Job[];
        isLoadingJobs.value = false;
    }));
    promises.push(getPaginatedCollectionGroupWhereWhere('gigs', 'live', '==', true, 'posterId', '==', props.id, ['updatedAt','desc'], 2).then((paginatedGigs)=>{
        liveGigs.value = paginatedGigs.docs as Gig[];
        isLoadingGigs.value = false;
    }));
    await Promise.all(promises);
})
</script>
