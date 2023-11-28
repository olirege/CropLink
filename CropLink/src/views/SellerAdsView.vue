<template>
    <div class="p-5 flex flex-col gap-4">
        <span class="rounded-md">
            <div id="seller-ad-banner" class="w-full h-96 relative">
                <img :src="sellerSignature.storeBannerPic" class="bg-slate-500 w-full h-80 object-cover rounded-md" ref="bannerPic" v-if="!isLoadingProfile">
                <div v-else class="bg-slate-500 w-full h-48 animate-pulse"></div>
                <div class="absolute bottom-0 left-20 flex flex-row">
                    <img :src="sellerSignature.storeLogoResized" class="z-9 border-4 border-white rounded-full w-36 h-36 bg-indigo-500" ref="profilePic" v-if="!isLoadingProfile">
                    <div v-else class="z-10 border-4 border-white rounded-full w-36 h-36 bg-indigo-500 animate-pulse"></div>
                    <div class="relative ml-5 p-1">
                        <div class="absolute bottom-1 truncate flex flex-row">
                            <p class="text-4xl font-bold">{{ props.sellerName }}</p>
                        </div>
                    </div>
                </div>
                <div class="absolute bottom-20 right-20">
                    <button class="bg-slate-600/70 px-4 py-2 rounded-md flex flex-row gap-2 items-center"
                        @click="onMessage">
                        <EnvelopeIcon class="w-6 h-6 text-white"/>
                        <p class="text-white font-semibold">Contact</p>
                    </button>                
                </div>
            </div>
        </span>
        <div class="flex flex-row gap-4 pt-6 border-y mt-4 sticky bg-white top-16 h-16 z-[9]">
            <div @click="scrollTo('Information')" :class="tab == 'Information' ? 'text-cyan-500 underline' : ''" class="font-bold hover:underline">
                Information
            </div>
            <div @click="scrollTo('Reviews')" :class="tab == 'Reviews' ? 'text-cyan-500 underline' : ''" class="font-bold hover:underline">
                Reviews
            </div>
            <div @click="scrollTo('Work Opportunities')" :class="tab == 'Work Opportunities' ? 'text-cyan-500 underline' : ''" class="font-bold hover:underline">
                Work Opportunities
            </div>  
            <div @click="scrollTo('Product Listings')" :class="tab == 'Product Listings' ? 'text-cyan-500 underline' : ''" class="font-bold hover:underline">
                Product Listings
            </div>
        </div>
        <span class="border rounded-md shadow">
            <div v-if="!isLoadingProfile" class="flex flex-col gap-2 p-4 rounded-b-md">
                <div class="flex flex-row items-center gap-2">
                    <span class="flex flex-row gap-1 items-center" v-if="sellerSignature.verifiedSeller">
                        <CheckCircleIcon class="h-4 w-4 text-sky-500"/>
                        <p>Verified</p>
                    </span>
                    <p class="p-1 px-2">{{ amountOfTime }}</p>
                    <p class="p-1 px-2">{{ sellerSignature.staffNumber }} staff</p>
                    <p class="p-1 px-2">{{ sellerSignature.acreage }} acres</p>
                </div>
                <div class="flex flex-row gap-2 italic">
                    <MapPinIcon class="w-5 h-5"/>
                    <p>{{ sellerSignature.location }}</p>
                </div>
            </div>
            <span class="grid grid-cols-2 gap-4" id="Information">
                <span class="p-4">
                    <div class="border-b p-4 flex flex-row gap-2 divide-x" v-if="!isLoadingProfile">
                        <div class="flex flex-row gap-2 px-4 py-2">
                            <template v-if="sellerSignature.rating > 0">
                                <p class="font-bold"><span class="text-6xl">{{ sellerSignature.rating }}</span> /5</p>
                                <span class="flex flex-col justify-end">
                                    <p class="font-bold">{{ storeRating }}</p>
                                    <p>({{ sellerSignature.reviewsCount ? sellerSignature.reviewsCount : 0  }} <span class="text-xs text-slate-400">reviews</span>)</p>
                                </span>
                            </template>
                            <template v-else>
                                <p class="font-bold">Not yet rated</p>
                            </template>
                        </div>
                        <span class="flex flex-col justify-center items-center px-4 py-2">
                            <template v-if="sellerSignature.averageResponseTime">
                                <p class="italic text-sm">average response rate</p>
                                <p class="font-bold"> {{"≤" + sellerSignature.averageResponseTime }} hrs</p>
                            </template>
                        </span>
                    </div>
                    <span class="grid grid-cols-4 gap-2 w-full divide-x py-4">
                        <div class="p-4">
                            <p class="text-xl font-bold">Machinery</p>
                            <ul class="list-disc pl-6">
                                <li v-for="machine in sellerSignature.machinery">
                                    <p class="text-xs italic">{{ machine }}</p>
                                </li>
                            </ul>
                        </div>
                        <div class="p-4">
                            <p class="text-xl mb-2 font-bold">Plants</p>
                            <span>
                                <div v-for="plant in sellerSignature.plants" class="flex flex-row gap-1 items-center justify-between w-full space-y-1">
                                    <p class="text-xs truncate ...">{{ plant.variety }}</p>
                                    <p class="text-xs">{{ plant.amount }}</p>
                                </div>
                            </span>
                        </div>
                        <div class="p-4 space-y-2">
                            <p class="text-xl mb-2 font-bold">Shipping</p>
                            <div v-for="method in sellerSignature.shipping" class="flex flex-col">
                                <p>{{ method.type }}</p>
                                <p class="text-xs italic pl-2">Up to {{ method.distance }}KMs</p>
                                <p class="text-xs italic pl-2">Max: {{ method.weight }}KGs</p>
                            </div>
                        </div>
                        <div class="p-4">
                            <p class="text-xl mb-2 font-bold">Capabilities</p>
                            <li v-for="capability in sellerSignature.capabilities" class="text-xs inline space-x-2">
                                <p>{{ capability }}</p>
                            </li>
                        </div>
                    </span>
                </span>
                <div class="grid grid-cols-3 p-4">
                    <template v-if="sellerSignature.storeImagesResized && sellerSignature.storeImagesResized.length > 0 ">
                        <img class="bg-slate-500 rounded-l-md flex col-span-2 object-cover" :src="sellerSignature.storeImagesResized[0]"/>
                        <div>
                            <img class="bg-slate-500 rounded-tr-md object-cover" :src="sellerSignature.storeImagesResized[1]"/>
                            <img class="bg-slate-500 rounded-br-md object-cover" :src="sellerSignature.storeImagesResized[2]"/>
                        </div>
                    </template>
                </div>
            </span>
        </span>
        <span v-if="liveJobs.length > 0 && liveGigs.length > 0" class="border rounded-md shadow p-5" id="Work Opportunities">
            <div class="flex items-center justify-start h-12 bg-gradient-to-r from-sky-500/40 to-white rounded-t-md">
                <h2 class="pl-2 text-white text-2xl font-bold p-1">Work Opportunities</h2>
            </div>
            <div class="flex flex-col gap-6 w-full p-2">
                <div class="relative flex flex-col h-full w-full h-96" v-if="liveJobs.length > 0">
                    <h2 class="text-xl font-bold italic my-2 pl-2">Job Openings</h2>
                    <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8" v-if="liveJobs.length > 0">
                        <JobCard :job="(job as Job)" v-for="job in liveJobs.slice(0,MAX_JOBS)"/>
                    </div>
                    <div v-else-if="liveJobs.length == 0">
                        <p class="text-center">No jobs to show</p>
                    </div>
                    <div v-if="liveJobs.length == 2" class="flex w-full justify-end" @click="onShowMoreJobs">
                        <p class="text-sm underline cursor-pointer">View more jobs</p>
                    </div>
                    <template v-if="isLoadingJobs">
                        <div class="absolute top-0 left-0 w-full h-full bg-slate-200/50 z-8 flex justify-center items-center min-h-96">
                            <LoadingSpinner :isLoading="isLoadingJobs" class="z-9"/>
                        </div>
                    </template>
                </div>
                <div class="flex flex-col h-full w-full relative h-96" v-if="liveGigs.length > 0">
                    <h2 class="text-xl font-bold italic my-2 pl-2">Small Gigs</h2>
                    <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8" v-if="liveGigs.length > 0">
                        <GigCard :gig="(gig as Gig)" v-for="gig in liveGigs.slice(0,MAX_GIGS)"/>
                    </div>
                    <div v-else-if="liveGigs.length == 0">
                        <p class="text-center">No gigs to show</p>
                    </div>
                    <div v-if="liveGigs.length == 2" class="flex w-full justify-end"  @click="onShowMoreGigs">
                        <p class="text-sm underline cursor-pointer">View more gigs</p>
                    </div>
                    <template v-if="isLoadingGigs">
                        <div class="absolute top-0 left-0 w-full h-full bg-slate-200/50 z-8 flex justify-center items-center min-h-96">
                            <LoadingSpinner :isLoading="isLoadingGigs" class="z-9"/>
                        </div>
                    </template>
                </div>
            </div>
        </span>
        <div class="p-5 border rounded-md shadow" v-if="liveAds.length > 0" id="Product Listings">
            <div class="flex items-center justify-start h-12 bg-gradient-to-r from-sky-500/40 to-white rounded-t-md">
                <h2 class="pl-2 text-white text-2xl font-bold p-1">Product listings</h2>
            </div>
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
                <LoadingSpinner :isLoading="isLoadingAds"/>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { ref, onMounted, type Ref, computed } from 'vue';
import type { SellerAd, BuyerAd, Job, Gig } from '@/types';
import { getPaginatedCollectionGroupWhereWhere, getDocument, useFirebaseFunctionCall } from '@/firebase/utils';
import { EnvelopeIcon } from '@heroicons/vue/24/outline';
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
import SellerAdThumbnailCard from '@/components/cards/SellerAdThumbnailCard.vue';
import JobCard from '@/components/cards/JobStoreCard.vue';
import GigCard from '@/components/cards/GigStoreCard.vue';
import BuyerAdCard from '@/components/cards/BuyerAdCard.vue';
import { useModalStore } from '@/stores/modals';
import { MapPinIcon } from '@heroicons/vue/24/solid';
import { storeToRefs } from 'pinia';
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const liveAds:Ref<SellerAd[]|BuyerAd[]> = ref([]);
const liveJobs:Ref<Job[]> = ref([]);
const liveGigs:Ref<Gig[]> = ref([]);
const isLoadingAds = ref(false);
const isLoadingJobs = ref(false);
const isLoadingGigs = ref(false);
const isLoadingProfile = ref(false);
const tab = ref('Information');
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
const scrollTo = (refName:string) => {
    const el = document.getElementById(refName);
    if(!el) return;
    el.scrollIntoView({behavior: 'smooth'});
    tab.value = refName;
}
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
        sellerSignature.value = doc 
        isLoadingProfile.value = false;
    }));
    promises.push(getPaginatedCollectionGroupWhereWhere('ads', 'live', '==', true, 'uid', '==', props.id, ['postedOn','desc'], 25).then((paginatedAds)=>{
        liveAds.value = paginatedAds.docs as SellerAd[]|BuyerAd[];
        isLoadingAds.value = false;
    }));
    promises.push(getPaginatedCollectionGroupWhereWhere('jobs', 'live', '==', true, 'posterId', '==', props.id, ['updatedAt','desc'], 5).then((paginatedJobs)=>{
        liveJobs.value = paginatedJobs.docs as Job[];
        isLoadingJobs.value = false;
    }));
    promises.push(getPaginatedCollectionGroupWhereWhere('gigs', 'live', '==', true, 'posterId', '==', props.id, ['updatedAt','desc'], 5).then((paginatedGigs)=>{
        liveGigs.value = paginatedGigs.docs as Gig[];
        isLoadingGigs.value = false;
    }));
    promises.push(increaseStoreViewCount(props.id));
    await Promise.all(promises);
})
const amountOfTime = computed(() => {
    // display amount of time since member joined
    if(!sellerSignature.value || !sellerSignature.value.createdAt ) return
    const now = new Date();
    const joined = new Date(sellerSignature.value.createdAt.toDate().toString());
    const diff = now.getTime() - joined.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 31);
    const years = Math.floor(months / 12);
    if (years > 0) {
        return `${years} yrs`;
    } else if (months > 0) {
        return `${months} mths`;
    } else {
        return `${days} days`;
    }
})
const storeRating = computed(() => {
    if(!sellerSignature.value || !sellerSignature.value.rating ) return
    const rating = sellerSignature.value.rating;
    if(rating == 0) return 'No ratings yet'
    if (rating > 0 && rating < 1) return 'Poor'
    if (rating >= 1 && rating < 2) return 'Fair'
    if (rating >= 2 && rating < 3) return 'Average'
    if (rating >= 3 && rating < 4) return 'Good'
    if (rating >= 4 && rating < 5) return 'Excellent'
})
const increasingStoreViewCount = ref(false);
const increaseStoreViewCount = async (adId:string) => {
    if(!adId) return;
    const { callFunction } = useFirebaseFunctionCall(
            'increaseStoreViewCount',
            {adId},
            increasingStoreViewCount,
        );
        await callFunction();
}
</script>
