<template>
     <span class="grid grid-flow-col space-x-4">
        <div v-for="(ad,index) in ads" :key="index" class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div class="w-full h-48 object-cover rounded-lg">
                <ImageCarousel :images="ad.resizedImages" />
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
                <strong>Expected Harvest Date:</strong> {{ isFirestoreTimestamp(ad.expectedHarvestDate) ? convertTimestampToDate(ad.expectedHarvestDate) : ad.expectedHarvestDate }}
            </p>
            <p class="text-sm mb-2">
                <strong>Price:</strong> {{ ad.price }}
            </p>
            <p class="text-sm mb-2">
                <strong>bidding End time:</strong> {{ isFirestoreTimestamp(ad.biddingEndTime) ? convertTimestampToDate(ad.biddingEndTime) : ad.biddingEndTime }}
            </p>
            <div class="flex justify-end mt-2 space-x-4">
                <button 
                @click="onEditAd(ad.id as string)"
                class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                    Edit
                </button>
                <ButtonWithLoading 
                :disabled="ad.live"
                :isLoading="isPostingAd"
                @click="onPostAd(ad.id as string)"
                class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                v-if="!ad.live"
                >
                    Post
                </ButtonWithLoading>
                <button 
                @click="onViewAd(ad.id as string)"
                class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                    View
                </button>
                <ButtonWithLoading 
                :disabled="ad.live"
                :isLoading="isRemovingAd == ad.id"
               @click="onRemoveAd(ad.id as string)"
               class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
               >
                   Remove
               </ButtonWithLoading>
            </div>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { SellerAd } from '@/types';
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import { ref, type PropType } from 'vue';
import { useMainStore } from '@/stores/main';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { useRouter } from 'vue-router';
import { convertTimestampToDate, isFirestoreTimestamp } from '@/firebase/utils';
const router = useRouter()
const emits = defineEmits(['edit'])
const props = defineProps({
    ads: {
        type: Array as PropType<SellerAd[]>,
        required: true
    }
})
const isPostingAd = ref(false);
const onPostAd = async (adId:string) => {
    if(!adId) return;
    isPostingAd.value = true;
    await useMainStore().postNewAd(adId);
    isPostingAd.value = false;
}
const isRemovingAd = ref("");
const onRemoveAd = async (adId:string) => {
    if(!adId) return;
    isRemovingAd.value = adId;
    console.log("removeAd", adId);
    await useMainStore().removeUserAd(adId);
    isRemovingAd.value = "";
}
const onEditAd = (adId:string) => {
    if(!adId) return;
    emits('edit', adId);
}

const onViewAd = (adId:string) => {
    if(!adId) return;
    router.push({name: 'ad', params: {adId: adId},});
}
</script>