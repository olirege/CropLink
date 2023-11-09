<template>
    <button @click="onAddAd" class="mt-2 mb-2 w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Add an ad</button>
    <span class="grid grid-flow-col gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" v-if="ads.docs && ads.docs.length > 0 && !isLoadingAds">
       <SellerAdThumbnailCard v-for="(ad,index) in ads.docs" :key="index" :ad="ad" />
   </span>
    <div v-else-if="isLoadingAds">
        <LoadingSpinner :isLoading ="isLoadingAds"/>
    </div>
    <div v-else>
        <div>No ads found</div>
    </div>
</template>
<script setup lang="ts">
import type { SellerAd } from '@/types';
import SellerAdThumbnailCard from '../cards/SellerAdThumbnailCard.vue';
import { useModalStore } from '@/stores/modals';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, type Ref, onMounted } from 'vue';
import { getPaginatedCollectionGroupWhere } from '@/firebase/utils';
import LoadingSpinner from '../props/LoadingSpinner.vue';
const { user } = storeToRefs(useMainStore());
const { modals } = storeToRefs(useModalStore());
const ads: Ref<{lastVisible:SellerAd, docs:SellerAd[]}> = ref([]);
const isLoadingAds = ref(false);
const loadAds = async () => {
    isLoadingAds.value = true;
    ads.value = await getPaginatedCollectionGroupWhere('ads', 'uid', '==', user.value.uid , ['createdAt','desc'], 10);
    console.log("ads", ads.value);
    isLoadingAds.value = false;
}
onMounted( async ()=>{
    console.log("mounted");
    await loadAds();
})
const onAddAd = () => {
    modals.value['addad'] = true;
}
</script>