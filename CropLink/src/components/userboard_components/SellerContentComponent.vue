<template>
     <span>
        <div v-for="(ad,index) in ads" :key="index" class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div class="w-full h-48 object-cover rounded-lg">
                <ImageCarousel :images="ad.images" />
            </div>
            <h3 class="text-xl font-semibold mb-2">
                {{ ad.type }}
            </h3>
            <p class="text-sm mb-2">
                <strong>Id:</strong> {{ ad.id }}
            </p>
            <p class="text-sm mb-2">
                <strong>Variety:</strong> {{ ad.variety }}
            </p>
            <p class="text-sm mb-2">
                <strong>Yield Tonnage:</strong> {{ ad.yieldTonnage }}
            </p>
            <p class="text-sm mb-2">
                <strong>Expected Harvest Date:</strong> {{ ad.expectedHarvestDate }}
            </p>
            <p class="text-sm mb-2">
                <strong>Price:</strong> {{ ad.price }}
            </p>
            <div class="flex justify-end mt-2 space-x-4">
                <button 
                :disabled="ad.live"
                @click="onPostAd(ad.id as string)"
                class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                    Post
                </button>
                <button 
               :disabled="!ad.live"
               @click="removeAd(ad.id as string)"
               class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
               >
                   Remove
               </button>
            </div>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { SellerAd } from '@/types';
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import { type PropType } from 'vue';
const emits = defineEmits(['post','remove'])
const props = defineProps({
    ads: {
        type: Array as PropType<SellerAd[]>,
        required: true
    }
})
const onPostAd = (adId:string) => {
    if(!adId) return;
    emits('post', adId);
}
const removeAd = (adId:string) => {
    if(!adId) return;
    emits('remove', adId);
}
</script>