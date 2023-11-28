<template>
    <template v-if="!isLoading">
        <div class="grid grid-cols-6 h-64 w-full mt-4 shadow border rounded-md overflow-hidden">
            <span v-for="(variety) in produce" class="relative inline-block" @click="()=>{selectedCategory = variety.id; onScrollToTable()}">
                <span class="absolute inset-0 flex items-center justify-center bg-slate-300/20 opacity-0 hover:opacity-100 transform duration-200 ease-in-out">
                    <span class="text-sm font-bold capitalize text-white">{{ variety.id }}</span>
                </span>
                <img :src="variety.imageUrl" class="object-cover h-full w-full"/>
            </span>
        </div>
        <div class="flex flex-row gap-2 h-16 p-4 justify-end">
            <Listbox
            :items="produce"
            v-model="selectedCategory"
            placeholder="Select a Produce"
            itemLabel="id"
            />
            <Listbox
            :items="selectableVariety"
            v-model="selectedVariety"
            placeholder="Select a Variety"
            :disabled="selectableVariety.length === 0"
            />
        </div>
        <span class="flex flex-row gap-2 relative w-full">
            <div class="w-1/6 py-4 px-2 sticky top-24 h-64">
                <h1 class="text-2xl font-bold mb-2 capitalize">Filters</h1>
                <span class="divide-y">
                    <div class="py-4">
                        <p class="text-sm mb-2">Cost per Ton</p>
                        <div class="flex flex-row gap-2 items-center">
                            <input type="number" class="text-xs border rounded-md w-1/2 p-2" v-model="filters.minCostPerTon" min="0"/>
                            <p>-</p>
                            <input type="number" class="text-xs border rounded-md w-1/2 p-2" v-model="filters.maxCostPerTon" min="0"/>
                        </div>
                    </div>
                    <span class="py-4">
                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" id="verifiedseller"/>
                            <label class="text-sm" for="verifiedseller">Verified Buyer</label>
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" id="certifiedOrganic"/>
                            <label class="text-sm" for="certifiedOrganic truncate">Certified Organic</label>
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" id="offersshipping"/>
                            <label class="text-sm" for="offersshipping">Offers shipping</label>
                        </div>
                    </span>
                </span>
            </div>
            <div class="flex flex-col gap-2 w-5/6 min-h-[500px]" v-if="!isLoadingAds && filteredAds.length > 0" id="buyerAds">
                <BuyerStoreAdCard v-for="(ad,index) in filteredAds" :ad="ad" :key="index" :showButtons="false"/>
            </div>
            <div v-if="selectedCategory && isLoadingAds" class="w-full">
                <div class="h-96 w-full flex items-center justify-center w-full">
                    <LoadingSpinner :isLoading="isLoadingAds"/>
                </div>
            </div>
            <div v-if="selectedCategory && !isLoadingAds && filteredAds.length == 0" class="w-full">
                <div class="h-96 w-full flex items-center justify-center w-full">
                    <p class="text-xl font-bold">No Ads Found</p>
                </div>
            </div>
        </span>
    </template>
    <template v-else>
        <div class="h-64 w-full flex items-center justify-center">
            <LoadingSpinner :isLoading="isLoading"/>
        </div>
    </template>
</template>
<script setup lang="ts">
import { ref as vueRef, onMounted, watch, computed, reactive } from 'vue';
import { useMainStore } from '@/stores/main';
import { getStorage, getDownloadURL, ref as firebaseRef } from 'firebase/storage';
import { getPaginatedCollectionGroup } from '@/firebase/utils';
import Listbox from '@/components/props/Listbox.vue';
import BuyerStoreAdCard from '../cards/BuyerStoreAdCard.vue';
import LoadingSpinner from '../props/LoadingSpinner.vue';
const produce = vueRef([]);
const isLoading = vueRef(false);
const selectedCategory = vueRef('');
onMounted(async () => {
    isLoading.value = true;
    try {
        produce.value = await useMainStore().getProduce();
        const storage = getStorage();
        for (let item of produce.value) {
            const pathRef = firebaseRef(storage, item.categoryImage);
            item.imageUrl = await getDownloadURL(pathRef);
        }
        selectedCategory.value = produce.value[0].id;
        await loadAds(selectedCategory.value);
    } catch (error) {
        console.error("Error loading produce:", error);
    }
    isLoading.value = false;
})
const isLoadingAds = vueRef(false);
const ads = vueRef([]);
const filters = reactive({
    minCostPerTon: 0,
    maxCostPerTon: 1000,
    verifiedBuyer: false,
    certifiedOrganic: false,
    offersShipping: false,
})
const filteredAds = computed(() => {
    if (!ads.value.docs || ads.value.docs.length === 0) {
        return [];
    }
    return ads.value.docs.filter(ad => {
        let matchesFilters = true;
        if (ad.minCostPerTon < filters.minCostPerTon || ad.maxCostPerTon > filters.maxCostPerTon) {
            matchesFilters = false;
        }
        if (filters.verifiedBuyer && !ad.verifiedBuyer) {
            matchesFilters = false;
        }
        if (filters.certifiedOrganic && !ad.certifiedOrganic) {
            matchesFilters = false;
        }
        if (filters.offersShipping && !ad.offersShipping) {
            matchesFilters = false;
        }
        return matchesFilters;
    });
});
const loadAds = async (category:string) => {
    isLoadingAds.value = true;
    ads.value = await getPaginatedCollectionGroup(
        import.meta.env.VITE_ADS_COLLECTION,
        [
            ['type', '==', category,],
            ['live', '==', true],
            ['adType', '==', 'buyer']
        ],
        ['postedOn','desc'],
    25);
    console.log("ads:", ads.value);
    isLoadingAds.value = false;
}
watch(selectedCategory, async (newCategory) => {
    if(newCategory) {
        await loadAds(newCategory);
    }
})
const selectedVariety = vueRef('');
const selectableVariety = computed(()=>{
    if(selectedCategory.value === "") {
        return [];
    }
    const produces = produce.value.find((produce)=>produce.id === selectedCategory.value);
    if(produces) {
        return produces.sub;
    }
    return [];
})
const onScrollToTable = () => {
    const table = document.getElementById('buyerAds');
    if(table) {
        table.scrollIntoView({behavior: "smooth"});
    }
}
</script>