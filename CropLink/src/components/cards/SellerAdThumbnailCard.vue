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
        <div class="w-full flex justify-end space-x-2" v-if="showButtons">
            <p class="underline" @click="onPostAd((ad.id) as string)" v-if="!ad.live">Post ad</p>
            <p class="underline" @click="onTakedownAd((ad.id) as string)" v-if="ad.live">Take down ad</p>
            <p class="underline" @click="onContactWinner((ad.id) as string)">Contact</p>
            <p class="underline" @click="onRemoveAd((ad.id) as string)">Remove</p>
            <p class="underline" @click="onEditAd((ad.id) as string)">Edit</p>
            <p class="underline" @click="onViewAd((ad.id) as string)">View</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import ImageCarousel from '@/components/props/ImageCarousel.vue';
import type { SellerAd } from '@/types';
import { type PropType, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main';
const { modals } = storeToRefs(useModalStore());
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
const onTakedownAd = async (adId:string) => {
    if(!adId) return;
    isPostingAd.value = true;
    await useMainStore().takedownUserAd(adId);
    isPostingAd.value = false;
}
const onRemoveAd = async (adId:string) => {
    if(!adId) return;
    console.log("removeAd", adId);
    modals.value['confirmremove'] = true;
    modals.value['context'] = {
        adId: adId,
        __key: 'ad',
    };
}
const onViewAd = (adId:string) => {
    if(!adId) return;
    router.push({name: 'ad', params: {adId: adId},});
}
const onEditAd = async (adId:string) => {
    if(!adId) return;
    console.log("removeAd", adId);
    modals.value['editad'] = true;
    modals.value['context'] = ad;
}
const onContactWinner = (adId:string) => {
    if(!adId) return;
    router.push({name: 'messaging', params: {adId: adId}});
}
</script>