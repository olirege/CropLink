<template>
    <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <div class="w-full h-48 object-cover rounded-lg">
            <ImageCarousel :images="ad.resizedImages" v-if="ad.images && ad.images.length > 0"/>
        </div>
        <h3 class="text-xl font-semibold mb-2">
            {{ ad.type }}
        </h3>
        <p class="text-sm mb-2">
            <strong>Status:</strong> {{ ad.status }}
        </p>
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
        <div class="flex items-center justify-end mt-2 space-x-4" v-if="showButtons">
                <CardButton 
                @click="onEditAd(ad.id as string)"
                v-if="!ad.live && ad.status != AD_STATUSES.SOLD"
                >
                    Edit
                </CardButton>
                <CardButton
                :classes="'truncate'"
                @click="onContactWinner(ad.id as string)"
                v-if="!ad.live && ad.status == AD_STATUSES.SOLD"
                >
                    Contact Winner
                </CardButton>
                <ButtonWithLoading 
                :disabled="ad.live"
                :isLoading="isPostingAd"
                @click="onPostAd(ad.id as string)"
                v-if="!ad.live && ad.status != AD_STATUSES.SOLD"
                >
                    Post {{ ad.status  }}
                </ButtonWithLoading>
                <CardButton 
                @click="onViewAd(ad.id as string)"
                >
                    View
                </CardButton>
                <ButtonWithLoading 
                :disabled="ad.live"
                :isLoading="isRemovingAd == ad.id"
                v-if="!ad.live && ad.status != AD_STATUSES.SOLD"
               @click="onRemoveAd(ad.id as string)"
               >
                   Remove
               </ButtonWithLoading>
        </div>
    </div>
</template>
<script setup lang="ts">
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import {isFirestoreTimestamp, convertTimestampToDate } from '@/firebase/utils';
import type { SellerAd } from '@/types';
import { type PropType, ref} from 'vue';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import CardButton from '@/components/props/CardButton.vue';
import { useMainStore } from '@/stores/main';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
const { modals } = storeToRefs(useModalStore());
const AD_STATUSES = useMainStore().AD_STATUSES;
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
const onViewAd = (adId:string) => {
    if(!adId) return;
    router.push({name: 'ad', params: {adId: adId},});
}
const onEditAd = async (adId:string) => {
    if(!adId) return;
    console.log("removeAd", adId);
    modals.value['editad'] = true;
    modals.value['context'] = ads.value.docs.find((ad) => ad.id === adId);
}
const onContactWinner = (adId:string) => {
    if(!adId) return;
    router.push({name: 'messaging', params: {adId: adId}});
}
</script>