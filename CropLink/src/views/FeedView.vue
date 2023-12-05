<template>
    <div v-if="isLoading">
        <div class="h-96 w-full flex items-center justify-center col-span-2 md:col-span-3 lg:col-span-4">
            <LoadingSpinner :isLoading="isLoading"/>
        </div>
    </div>
    <div v-else class="relative flex items-center justify-center h-48 md:h-64 shadow rounded-md p-4">
        <div id="banner" class="absolute top-0 left-0 h-48 md:h-64 w-full bg-cover bg-center rounded-md -z-1 opacity-30"></div>
        <div class="absolute top-0 left-0 h-48 md:h-64 w-full bg-slate-800/80 rounded-md z-1"></div>
        <div class="z-[7] flex items-center flex-col gap-4">
            <span class="flex flex-row gap-1 sm:gap-2 ">
                <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 0" :class="tab == 0 ? 'text-blue-500 underline' : ''">Producers</h1>
                <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 1" :class="tab == 1 ? 'text-blue-500 underline' : ''">Products</h1>
                <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 2" :class="tab == 2 ? 'text-blue-500 underline' : ''">Buyers</h1>
                <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 3" :class="tab == 3 ? 'text-blue-500 underline' : ''">Jobs</h1>
                <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 4" :class="tab == 4 ? 'text-blue-500 underline' : ''">Gigs</h1>
            </span>
            <div class="relative w-80 h-10 rounded-2xl bg-white flex flex-row gap-2 items-center p-1">
                <MagnifyingGlassCircleIcon class="h-8 w-8"/>
                <input type="text" class="w-full focus:outline-none" v-model="searchInput"/>
                <XMarkIcon class="h-8 w-8 cursor-pointer" @click="()=>{searchInput= ''; filterBy = ''}" v-if="searchInput || filterBy"/>
                <ButtonWithLoading :isLoading="isSearching" class="w-24 h-8 rounded-xl bg-blue-600 items-center" @click="onSearch">
                    <p class="font-bold text-white">Search</p>
                </ButtonWithLoading>
                <div v-if="searchResults.length > 0" class="p-2 absolute top-12 left-0 w-full max-h-64 overflow-y-scroll flex flex-col bg-white rounded-md">
                    <div v-for="result in searchResults">
                        <template v-if="result.companyName">
                            <div class="flex flex-row items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer" @click="()=>filterCompaniesBy(result.companyName)">
                                <img :src="result.storeLogoResized" class="h-8 w-8 rounded-full"/>
                                <p class="capitalize">{{result.companyName}}</p>
                            </div>   
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="p-2" v-if="tab == 0">
        <GroupedAdsComponent :filterBy="filterBy"/>
    </div>
    <div v-if="tab == 1">
        <SellerCategoryComponent/>
    </div>
    <div v-if="tab == 2">
        <BuyerCategoryComponent />
    </div>
    <div v-if="tab == 3">
        <JobCategoryComponent />
    </div>
    <div v-if="tab == 4">
        <GigCategoryComponent />
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GroupedAdsComponent from '@/components/feed_components/GroupedAdsComponent.vue';
import SellerCategoryComponent from '@/components/feed_components/SellerCategoryComponent.vue';
import BuyerCategoryComponent from '@/components/feed_components/BuyerCategoryComponent.vue';
import JobCategoryComponent from '@/components/feed_components/JobCategoryComponent.vue';
import GigCategoryComponent from '@/components/feed_components/GigCategoryComponent.vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { MagnifyingGlassCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useFirebaseFunctionCall } from '@/firebase/utils';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';

const searchResults = ref([]);
const tab = ref(0);
const isLoading = ref(true);
const searchInput = ref('');
const filterBy = ref('');
const filterCompaniesBy = (choice: string) => {
    searchInput.value = choice;
    searchResults.value = [];
    filterBy.value = choice;
}
onMounted(async () => {
    await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(); isLoading.value = false;
        img.onerror = () => reject(); isLoading.value = false;
        img.src = '@/assets/VineyardBanner1.png';
    })
})
const isSearching = ref(false);
const onSearch =  async () => {
    if (!searchInput.value) return;
    const { callFunction } = useFirebaseFunctionCall(
        'searchQuery',
        { query: searchInput.value },
        isSearching,
        undefined,
        (res) => {
            searchResults.value = res.data;
        }
        );
    await callFunction();
}
</script>
<style scoped>
#banner {
    background-image: url('@/assets/VineyardBanner1.png');
}
</style>