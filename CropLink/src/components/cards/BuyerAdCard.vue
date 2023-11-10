<template>
    <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <h3 class="text-xl font-semibold mb-2">
            {{ ad.type }}
        </h3>
        <p class="text-sm mb-2">
                <strong>Id:</strong> {{ ad.id }}
            </p>
        <p class="text-sm mb-2">
            <strong>Yield Tonnage:</strong> {{ ad.yieldTonnage }}
        </p>
        <p class="text-sm mb-2">
            <strong>Request Date:</strong> {{ ad.requestDate }}
        </p>
        <p class="text-sm mb-2">
            <strong>Price:</strong> {{ ad.price }}
        </p>
        <div class="flex justify-end mt-2 space-x-4" v-if="showButtons">
                <CardButton 
                @click="onEditAd(ad.id as string)"
                >
                   Edit
                </CardButton>
                <ButtonWithLoading
                :isLoading="isPostingAd"
                :disabled="ad.live"
                @click="onPostAd(ad.id as string)"
                >
                   Post
               </ButtonWithLoading>
               <ButtonWithLoading
                :isLoading="isRemovingAd == ad.id"
               :disabled="!ad.live"
               @click="onRemoveAd(ad.id as string)"
               >
                   Remove
               </ButtonWithLoading>
           </div>
    </div>
</template>
<script setup lang="ts">
import { ref, type PropType } from 'vue';
import type { BuyerAd } from '@/types';
import ButtonWithLoading from '../props/ButtonWithLoading.vue';
import CardButton from '../props/CardButton.vue';
import { useMainStore } from '@/stores/main';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
const { modals } = storeToRefs(useModalStore());
const props = defineProps({
    ad: {
        type: Object as PropType<BuyerAd>,
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
    useMainStore().removeUserAd(adId);
    isRemovingAd.value = "";
}
const onEditAd = async (adId:string) => {
    if(!adId) return;
    console.log("removeAd", adId);
    modals.value['editad'] = true;
    modals.value['context'] = ads.value.docs.find((ad) => ad.id === adId);
}
</script>