<template>
    <span class="flex flex-col justify-start sm:block bg-white p-2 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer" v-if="adGroup">
        <span class="flex flex-row gap-2 items-end mb-2" @click="goToSellerAds(adGroup.id, adGroup.companyName)">
            <img :src=adGroup.storeLogoResized class="w-10 h-10 rounded-md object-cover bg-slate-500">
            <span class="flex flex-col">
                <h1 class="text-md font-bold capitalize">{{ `${adGroup.companyName}'s ads` }}</h1>
                <div v-if="adGroup.verifiedSeller" class="flex flex-row gap-1 divide-x">
                    <CheckCircleIcon class="h-4 w-4 text-sky-500"/>
                    <p class="text-xs italic pl-2">Verified</p>
                    <p class="text-xs italic pl-2">{{ amountOfTime }}</p>
                    <p class="text-xs italic pl-2">{{ adGroup.staffNumber }}+ staff</p>
                    <p class="text-xs italic pl-2">{{ adGroup.acreage }}+ acres</p>
                </div>
            </span>
        </span>
        <span class="grid grid-row-3 sm:grid-col-2 md:grid-cols-3 gap-4">
            <span class="flex flex-row sm:p-2 sm:p-0" @click="goToSellerAds(adGroup.id, adGroup.companyName)">
                <div class="flex flex-col gap-1 w-full">
                    <div v-if="adGroup.rating">
                        <p class="italic"><strong>{{ adGroup.rating }}</strong>/5 rating</p>
                    </div>
                    <div v-else>
                        <p>Producer not yet rated.</p>
                    </div>
                    <span class="flex-row justify-between w-full divide-x flex gap-2">
                        <div class="flex flex-col sm:p-2 w-full">
                            <p class="text-md mb-2 font-bold">Shipping</p>
                            <li v-for="method in adGroup.shipping.slice(0,2)" class="flex flex-col p-2">
                                <p class="text-xs">{{ method.type }}</p>
                                <p class="text-xs italic pl-1">Up to {{ method.distance }}KMs</p>
                                <p class="text-xs italic pl-1">Max: {{ method.weight }}KGs</p>
                            </li>
                        </div>
                        <div class="flex flex-col sm:p-2 space-y-2 pl-2 w-full">
                            <p class="text-md mb-2 font-bold">Plant Count</p>
                            <li v-for="plant in adGroup.plants.slice(0,5)" class="flex flex-row justify-between gap-2">
                                <p class="text-xs italic">{{ plant.variety }}</p>
                                <p class="text-xs italic">{{ plant.amount }}</p>         
                            </li>
                        </div>
                    </span>
                </div>
            </span>
            <template v-if="!isLoadingAds && liveAds.length > 0">
                <div class="m-auto inline grid grid-cols-3 gap-2">
                    <SellerAdCarouselCard  v-for="ad in liveAds" :ad="ad" :key="ad.adId"/>
                </div>
            </template>
            <template v-if="adGroup && adGroup.storeImagesResized && adGroup.storeImagesResized.length > 0">
                <div class="m-auto">
                    <div class="sm:w-56">
                        <ImageCarousel :images="adGroup.storeImagesResized" :classes="'sm:h-56 sm:w-56'"/>
                    </div>
                </div>
            </template>
        </span>
    </span>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
import { computed, onMounted, ref } from 'vue';
import ImageCarousel from '../props/ImageCarousel.vue';
import { getPaginatedCollectionGroupWhereWhere } from '@/firebase/utils';
import type { SellerAd, BuyerAd } from '@/types';
import SellerAdCarouselCard from './SellerAdCarouselCard.vue';
const props = defineProps({
    adGroup: {
        type: Object,
        required: true
    }
})
const amountOfTime = computed(() => {
    const now = new Date();
    const joined = new Date(props.adGroup.createdAt.toDate().toString());
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
const router = useRouter();
const goToSellerAds = (sellerId: string, sellerName: string) => {
    console.log("go to seller ads", sellerId)
    router.push({name: 'seller-ads', params: {id: sellerId, sellerName: sellerName},});
}
const liveAds = ref([] as SellerAd[]|BuyerAd[]);
const isLoadingAds = ref(true);
onMounted(async() => {
    isLoadingAds.value = true;
    const promises = [];
    promises.push(getPaginatedCollectionGroupWhereWhere('ads', 'live', '==', true, 'uid', '==', props.adGroup.id, ['postedOn','desc'], 3).then((paginatedAds)=>{
        liveAds.value = paginatedAds.docs as SellerAd[]|BuyerAd[];
        isLoadingAds.value = false;
    }));
    await Promise.all(promises);
})
</script>