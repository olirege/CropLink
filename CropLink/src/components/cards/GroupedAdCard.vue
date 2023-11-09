<template>
    <span class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300" v-if="adGroup">
        <h1 class="font-lg mb-4 underline" @click="goToSellerAds(adGroup.id, adGroup.name)">{{ `${adGroup.name}'s ads` }}</h1>
        <div class="flex flex-wrap flex-row gap-4">
            <span v-for="sample in adGroup.samples">
                <img :src=sample.image :alt=sample.name class="w-20 h-20 object-cover rounded-lg" @click="goToAd(sample.adId)">
            </span>
        </div>
    </span>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const props = defineProps({
    adGroup: {
        type: Object,
        required: true
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