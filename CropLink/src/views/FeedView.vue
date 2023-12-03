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
                <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 0" :class="tab == 0 ? 'text-purple-500 underline' : ''">Producers</h1>
                <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 1" :class="tab == 1 ? 'text-purple-500 underline' : ''">Products</h1>
                <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 2" :class="tab == 2 ? 'text-purple-500 underline' : ''">Buyers</h1>
                <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 3" :class="tab == 3 ? 'text-purple-500 underline' : ''">Jobs</h1>
                <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 4" :class="tab == 4 ? 'text-purple-500 underline' : ''">Gigs</h1>
            </span>
            <div class="relative w-80">
                <input type="text" class="w-full h-10 rounded-2xl bg-white text-white"/>
                <MagnifyingGlassCircleIcon class="w-6 h-6 absolute top-2 left-2"/>
                <button class="w-24 h-8 rounded-xl bg-blue-600 absolute top-1 right-1">
                    <p class="font-bold text-white">Search</p>
                </button>
            </div>
        </div>
    </div>
    <div class="p-2" v-if="tab == 0">
        <GroupedAdsComponent />
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
import { MagnifyingGlassCircleIcon } from '@heroicons/vue/24/outline';
const tab = ref(0);
const isLoading = ref(true);
onMounted(async () => {
    // wait until background image is loaded
    await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(); isLoading.value = false;
        img.onerror = () => reject(); isLoading.value = false;
        img.src = '@/assets/VineyardBanner1.png';
    })
})
</script>
<style scoped>
#banner {
    background-image: url('@/assets/VineyardBanner1.png');
}
</style>