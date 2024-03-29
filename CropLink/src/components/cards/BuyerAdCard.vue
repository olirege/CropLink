<template>
    <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <h3 class="text-xl font-semibold mb-2">
            {{ ad.type }}
        </h3>
        <p class="text-sm mb-2">
                <strong>Id:</strong> {{ ad.id }}
            </p>
        <p class="text-sm mb-2">
            <span v-currency="ad.minCostPerTon"/>-<span v-currency="ad.maxCostPerTon"/>/ton
        </p>
        <p class="text-sm mb-2">
            <strong>Quantity:</strong> ~ {{ ad.tons }} tons
        </p>
        <div class="flex justify-end mt-2 space-x-4" v-if="showButtons">
        <p class="text-sm mb-2">
            <strong>Request Date:</strong> {{ ad.requestDate }}
        </p>
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
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useFirebaseFunctionCall } from '@/firebase/utils';
const { modals, notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
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
    const { callFunction } = useFirebaseFunctionCall(
        'postAd',
        {adId},
        isPostingAd,
        undefined,
        undefined,
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Ad is live!';
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'Error while posting ad, please try again later';
        },
    );
    await callFunction();
}
const isRemovingAd = ref(false);
const onRemoveAd = async (adId:string) => {
    if(!adId) return;
    const { callFunction } = useFirebaseFunctionCall(
        'removeAd',
        {adId},
        isRemovingAd,
        undefined,
        undefined,
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Ad removed!';
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'Error while removing ad, please try again later';
        },
    );
    await callFunction();
}
const onEditAd = async (adId:string) => {
    if(!adId) return;
    console.log("removeAd", adId);
    modals.value['editad'] = true;
    modals.value['context'] = ads.value.docs.find((ad) => ad.id === adId);
}
</script>