<template>
    <template v-if="!isLoading">
        <div class="grid grid-cols-6 h-64 w-full mt-4 shadow border rounded-md overflow-hidden">
            <span v-for="(variety) in produce" class="relative inline-block" @click="()=>{selectedCategory = variety.id; onScrollToTable()}">
                <span class="absolute inset-0 hidden sm:flex items-center justify-center bg-slate-300/20 opacity-0 hover:opacity-100 transform duration-200 ease-in-out">
                    <span class="text-sm font-bold capitalize text-white">{{ variety.id }}</span>
                </span>
                <img :src="variety.imageUrl" class="object-cover h-full w-full"/>
            </span>
        </div>
        <div class="flex flex-row gap-1 sm:gap-2 h-16 sm:p-4 sm:justify-end items-center">
            <SellerCategoryFilterDropdownMenu
                :filters="filters"
                :selectableVariety="selectableVariety"
                @updateFilters="updateFilters"
            />
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
            <div class="w-1/6 py-4 px-2 sticky top-24 h-64 hidden sm:block">
                <h1 class="text-2xl font-bold mb-2 capitalize">Filters</h1>
                <span class="divide-y">
                    <div class="py-4">
                        <p class="text-sm mb-2">Quantity</p>
                        <div class="flex flex-row gap-2 items-center">
                            <input type="number" class="text-xs border rounded-md p-2 w-1/2" v-model="filters.tons.min" />
                            <p>-</p>
                            <input type="number" class="text-xs border rounded-md p-2 w-1/2" v-model="filters.tons.max"/>
                        </div>
                    </div>
                    <div class="py-4">
                        <p class="text-sm mb-2">Price Per Ton</p>
                        <div class="flex flex-row gap-2 items-center">
                            <input type="number" class="text-xs border rounded-md p-2 w-1/2" v-model="filters.pricePerTon.min" />
                           <p>-</p>
                            <input type="number" class="text-xs border rounded-md p-2 w-1/2" v-model="filters.pricePerTon.max"/>
                        </div>
                    </div>
                    <span class="py-4">
                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" id="verifiedseller"/>
                            <label class="text-sm" for="verifiedseller">Verified Seller</label>
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" id="certifiedOrganic"/>
                            <label class="text-sm" for="verifiedseller">Certified Organic</label>
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" id="offersshipping"/>
                            <label class="text-sm" for="offersshipping">Offers shipping</label>
                        </div>
                    </span>
                </span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 w-full gap-2" v-if="!isLoadingAds && filteredAds.length > 0" id="sellerAds">
                <SellerAdThumbnailCard v-for="(ad,index) in filteredAds" :ad="ad" :key="index" :showButtons="false"/>
            </div>
            <div v-if="selectedCategory && isLoadingAds" class="w-full">
                <div class="h-96 w-full flex items-center justify-center col-span-2 md:col-span-3 lg:col-span-4">
                    <LoadingSpinner :isLoading="isLoadingAds"/>
                </div>
            </div>
            <div v-if="selectedCategory && !isLoadingAds && filteredAds.length == 0" class="w-full">
                <div class="h-96 w-full flex items-center justify-center col-span-2 md:col-span-3 lg:col-span-4">
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
import { ref as vueRef, onMounted, type PropType, watch, computed, ref } from 'vue';
import { useMainStore } from '@/stores/main';
import { getStorage, getDownloadURL, ref as firebaseRef } from 'firebase/storage';
import { getPaginatedCollectionGroup } from '@/firebase/utils';
import Listbox from '@/components/props/Listbox.vue';
import SellerAdThumbnailCard from '../cards/SellerAdThumbnailCard.vue';
import LoadingSpinner from '../props/LoadingSpinner.vue';
// import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
import SellerCategoryFilterDropdownMenu from '../props/SellerCategoryFilterDropdownMenu.vue';
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
const filters = ref({
    pricePerTon: {
        min: 0,
        max: 1000,
    },
    tons: {
        min: 0,
        max: 1000,
    },
    verifiedSeller: false,
    certifiedOrganic: false,
    offersShipping: false,
})
const updateFilters = (newFilters) => {
    filters.value = { ...newFilters };
};
const filteredAds = computed(() => {
    if(!ads.value.docs || ads.value.docs.length === 0) {
        return [];
    }
    const filtered =  ads.value.docs.filter((ad) => {
        const pricePerTon = ad.pricePerTon;
        const tons = ad.tons;
        return pricePerTon >= filters.value.pricePerTon.min && pricePerTon <= filters.value.pricePerTon.max && tons >= filters.value.tons.min && tons <= filters.value.tons.max;
    })
    return filtered;
    // if(!selectedVariety.value) {
    //     return filtered;
    // } else {
    //     return filtered.filter((ad) => {
    //         return ad.variety === selectedVariety.value;
    //     })
    // }
})
const loadAds = async (category:string) => {
    isLoadingAds.value = true;
    ads.value = await getPaginatedCollectionGroup(
        import.meta.env.VITE_ADS_COLLECTION,
        [
            ['type', '==', category,],
            ['live', '==', true],
            ['adType', '==', 'seller']
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
    const table = document.getElementById('sellerAds');
    if(table) {
        table.scrollIntoView({behavior: "smooth"});
    }
}
</script>