<template>
     <div class="flex flex-row gap-1 sm:gap-2 h-16 sm:p-4 sm:justify-end items-center sm:hidden">
        <GigCategoryFilterDropdownMenu
            :filters="filters"
            @updateFilters="updateFilters"
        />
    </div>
    <span class="flex flex-row gap-2 relative w-full">
       <div class="w-1/6 py-4 px-2 sticky top-24 h-64 hidden sm:block">
           <h1 class="text-2xl font-bold mb-2 capitalize">Filters</h1>
           <span class="divide-y">
               <div class="py-4">
                   <p class="text-sm mb-2">Salary</p>
                   <div class="flex flex-row gap-2 items-center">
                       <input type="number" class="text-xs border rounded-md p-2 w-1/2" v-model="filters.min" />
                       <p>-</p>
                       <input type="number" class="text-xs border rounded-md p-2 w-1/2" v-model="filters.max"/>
                   </div>
               </div>
           </span>
       </div>
       <div class="grid grid-cols-2 md:grid-cols-3 w-full gap-2 sm:p-2">
           <template v-if="filteredGigs.length > 0 && !isLoadingGigs">
               <GigCard :gig="(liveGig as Gig)" :showButtons="false" v-for="(liveGig,index) of filteredGigs" :key="index"/>
           </template>
           <template v-else-if="isLoadingGigs">
               <div class="h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3">
                   <LoadingSpinner :isLoading="isLoadingGigs"/>
               </div>
           </template>
           <template v-else>
               <div class="h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3">
                   <p class="text-xl font-bold">No Gigs Found</p>
               </div>
           </template>
       </div>
   </span>
</template>
<script setup lang='ts'>
import { ref, onMounted, type Ref, reactive, computed } from 'vue';
import type { Gig } from '@/types';
import { getPaginatedCollectionGroupWhere } from '@/firebase/utils';
import GigCard from '@/components/cards/GigStoreCard.vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import GigCategoryFilterDropdownMenu from '@/components/props/GigCategoryFilterDropdownMenu.vue';
const liveGigs:Ref<Gig[]> = ref([]);
const isLoadingGigs = ref(false);
const filters = reactive({
   min: 0,
   max: 10000,
})
const filteredGigs = computed(() => {
   return liveGigs.value.filter((gig) => {
        const milestoneTotal = gig.milestones.reduce((acc, curr) => {
            return acc + curr.price
        }, 0)
       return milestoneTotal >= filters.min && milestoneTotal <= filters.max
   })
})
const updateFilters = (newFilters) => {
    filters.value = { ...newFilters };
};
onMounted(async() => {
   isLoadingGigs.value = true;
   const paginatedGigs = await getPaginatedCollectionGroupWhere('gigs', 'live', '==', true, ['updatedAt','desc'], 25)
   liveGigs.value = paginatedGigs.docs as Gig[];
   isLoadingGigs.value = false;
})
</script>