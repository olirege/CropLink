<template>
    <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <div class="w-full h-48 object-cover rounded-lg">
            <ImageCarousel :images="ad.resizedImages" v-if="ad.images && ad.images.length > 0"/>
        </div>
        <h3 class="text-xl font-semibold mb-2">
            {{ ad.variety }}
        </h3>
        <p class="text-sm mb-2">
            <strong>Yield Tonnage:</strong> {{ ad.yieldTonnage }}
        </p>
        <p class="text-sm mb-2">
            <strong>Price:</strong> {{ ad.price }}
        </p>
        <div class="w-full flex justify-end">
            <p class="underline" @click="onViewAd((ad.id) as string)">View</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import type { SellerAd } from '@/types';
import { type PropType, ref} from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const emits = defineEmits(['edit'])
const props = defineProps({
    ad: {
        type: Object as PropType<SellerAd>,
        required: true
    },
    showButtons: {
        type: Boolean,
        default: true
    }
})
const onViewAd = (adId:string) => {
    if(!adId) return;
    router.push({name: 'ad', params: {adId: adId},});
}
</script>