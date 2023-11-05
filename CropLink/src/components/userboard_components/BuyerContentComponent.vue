<template>
    <span>
       <div v-for="(ad,index) in ads" :key="index" class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
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
           <div class="flex justify-end mt-2 space-x-4">
                <button 
               @click="onEditAd(ad.id as string)"
               class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
               >
                   Edit
               </button>
                <ButtonWithLoading
                :isLoading="isPostingAd"
                :disabled="ad.live"
                @click="onPostAd(ad.id as string)"
                class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                   Post
               </ButtonWithLoading>
               <ButtonWithLoading
                :isLoading="isRemovingAd == ad.id"
               :disabled="!ad.live"
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
import type { BuyerAd } from '@/types';
import ButtonWithLoading from '../props/ButtonWithLoading.vue';
import { useMainStore } from '@/stores/main';
import { type PropType, ref } from 'vue';
const emits = defineEmits(['edit'])
const props = defineProps({
   ads: {
       type: Array as PropType<BuyerAd[]>,
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
    useMainStore().removeUserAd(adId);
    isRemovingAd.value = "";
}
const onEditAd = (adId:string) => {
    if(!adId) return;
    emits('edit',adId);
}
</script>