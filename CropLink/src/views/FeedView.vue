<template>
    <div class="relative flex items-center justify-center h-48 md:h-64 shadow rounded-md p-4">
        <div id="banner" class="absolute top-0 left-0 h-48 md:h-64 w-full bg-cover bg-center rounded-md -z-1 opacity-30"></div>
        <div class="absolute top-0 left-0 h-48 md:h-64 w-full bg-slate-800/80 rounded-md z-1"></div>
        <span class="flex flex-row gap-1 sm:gap-2 z-[7]">
            <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 0" :class="tab == 0 ? 'text-cyan-500 underline' : ''">Producers</h1>
            <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 1" :class="tab == 1 ? 'text-cyan-500 underline' : ''">Products</h1>
            <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 2" :class="tab == 2 ? 'text-cyan-500 underline' : ''">Buyers</h1>
            <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 3" :class="tab == 3 ? 'text-cyan-500 underline' : ''">Jobs</h1>
            <h1 class="text-lg sm:text-2xl md:text-3xl font-bold hover:underline" @click="()=>tab = 4" :class="tab == 4 ? 'text-cyan-500 underline' : ''">Gigs</h1>
        </span>
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
import { ref } from 'vue';
import GroupedAdsComponent from '@/components/feed_components/GroupedAdsComponent.vue';
import SellerCategoryComponent from '@/components/feed_components/SellerCategoryComponent.vue';
import BuyerCategoryComponent from '@/components/feed_components/BuyerCategoryComponent.vue';
import JobCategoryComponent from '@/components/feed_components/JobCategoryComponent.vue';
import GigCategoryComponent from '@/components/feed_components/GigCategoryComponent.vue';
const tab = ref(0);
</script>
<style scoped>
#banner {
    background-image: url('@/assets/VineyardBanner1.png');
}
</style>