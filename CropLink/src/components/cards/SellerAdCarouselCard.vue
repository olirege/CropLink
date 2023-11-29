<template>
    <div class="relative bg-white rounded-xl flex flex-col gap-2" @click="onViewAd(ad.adId)">
        <div class="relative w-full max-h-32 rounded-xl overflow-hidden">
            <template v-if="ad.images && ad.images.length > 0">
                <ImageCarousel :images="ad.resizedImages" :classes="'max-h-32 w-32'"/>
            </template>
            <template v-else>
                <div class="flex items-center justify-center h-full">
                    <p class="text-gray-500">No Image Available</p>
                </div>
            </template>
        </div>
        <div class="max-h-32">
            <h3 class="text-1xl font-bold">{{ ad.variety }}</h3>
            <div class="flex flex-row gap-2 text-sm justify-between">
                <p class="font-semibold" v-currency="ad.pricePerTon">/tons</p> 
            </div>
            <div class="flex flex-row gap-2 text-sm">
                <p>{{ ad.tons }}</p>tons
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import type { SellerAd } from '@/types';
import { type PropType} from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const emits = defineEmits(['edit'])
const props = defineProps({
    ad: {
        type: Object as PropType<SellerAd>,
        required: true
    },
})
const onViewAd = (adId:string) => {
    if(!adId) return;
    router.push({name: 'ad', params: {adId: adId},});
}
</script>