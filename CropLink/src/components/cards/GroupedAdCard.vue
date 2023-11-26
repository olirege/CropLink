<template>
    <span class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300" v-if="adGroup">
        <span class="grid grid-cols-2 gap-2">
            <span>
                <div class="flex flex-row justify-between">
                    <span class="flex flex-row gap-2 items-end mb-2">
                        <img :src=adGroup.profilePicResized class="w-10 h-10 rounded-md object-cover bg-slate-500" @click="goToSellerAds(adGroup.id, adGroup.name)">
                        <span class="flex flex-col">
                            <h1 class="text-md font-bold capitalize" @click="goToSellerAds(adGroup.id, adGroup.name)">{{ `${adGroup.name}'s ads` }}</h1>
                            <div v-if="adGroup.verifiedSeller" class="flex flex-row gap-1 divide-x">
                                <CheckCircleIcon class="h-4 w-4 text-sky-500"/>
                                <p class="text-xs italic pl-2">Verified</p>
                                <p class="text-xs italic pl-2">{{ amountOfTime }}</p>
                                <p class="text-xs italic pl-2">{{ adGroup.staffNumber }}+ staff</p>
                                <p class="text-xs italic pl-2">{{ adGroup.acreage }}+ acres</p>
                            </div>
                        </span>
                    </span>
                </div>
                <div v-if="adGroup.rating">
                    <p class="italic"><strong>{{ adGroup.rating }}</strong>/5 rating</p>
                </div>
                <span class="grid grid-cols-3 gap-2 w-full divide-x">
                    <div class="p-2">
                        <p class="text-xl text-slate-400 mb-2 font-bold">Machinery</p>
                        <ul class="list-disc pl-6">
                            <li v-for="machine in adGroup.machinery">
                                <p class="text-xs italic">{{ machine }}</p>
                            </li>
                        </ul>
                    </div>
                    <div class="p-2">
                        <p class="text-xl text-slate-400 mb-2 font-bold">Plants</p>
                        <span>
                            <div v-for="plant in adGroup.plants" class="flex flex-row gap-1 items-center justify-between w-full space-y-1">
                                <p class="text-xs truncate ...">{{ plant.variety }}</p>
                                <p class="text-xs">{{ plant.quantity }}</p>
                            </div>
                        </span>
                    </div>
                    <div class="p-2">
                        <p class="text-xl text-slate-400 mb-2 font-bold">Shipping</p>
                        <li v-for="method in adGroup.shipping" class="inline space-x-2">
                            <p>{{ method.type }}</p>
                            <p class="text-xs italic">Up to {{ method.distance }}KMs</p>
                            <p class="text-xs italic">Max: {{ method.weight }}KGs</p>
                        </li>
                    </div>
                </span>
            </span>
            <div class="flex flex-wrap">
                <span v-for="sample in adGroup.samples">
                    <img :src=sample.image :alt=sample.name class="w-32 h-32 object-cover" @click="goToAd(sample.adId)">
                </span>
            </div>
        </span>
    </span>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
import { computed } from 'vue';
const props = defineProps({
    adGroup: {
        type: Object,
        required: true
    }
})
const amountOfTime = computed(() => {
    // display amount of time since member joined
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
const goToAd = (adId: string) => {
    console.log("go to ad", adId)
    router.push({name: 'ad', params: {adId: adId},});
}
</script>