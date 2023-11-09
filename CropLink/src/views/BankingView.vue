<template>
    <div class="grid grid-cols-2 gap-x-4 p-5">
        <SellerAdCard :ad="ad" :showButtons="false"/>
        <BankingComponent />
    </div>
</template>
<script setup lang="ts">
import SellerAdCard from '@/components/cards/SellerAdCard.vue';
import BankingComponent from '@/components/userboard_components/BankingComponent.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from "pinia"
import { db } from '@/firebase/main';
import { onSnapshot, query, where, collectionGroup } from 'firebase/firestore';
import { queryForCollectionGroupDocumentById } from '@/firebase/utils';
import type { SellerAd } from '@/types';
const props = defineProps({
    adId: {
        type:String,
        required:true,
    }
})
const { user, profile } = storeToRefs(useMainStore())
const ad = ref({} as SellerAd);
const isLoadingAd = ref(false);
let stopSubscription: any;
const loadAd = async () => {
    isLoadingAd.value = true;
    ad.value = await queryForCollectionGroupDocumentById('ads', props.adId) as SellerAd;
    isLoadingAd.value = false;
}
onMounted(async () => {
    await loadAd();
})
onBeforeUnmount(() => {
    if(stopSubscription) stopSubscription();
})
</script>