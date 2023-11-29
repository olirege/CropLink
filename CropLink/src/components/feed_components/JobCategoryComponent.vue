<template>
    <div class="flex flex-row gap-1 sm:gap-2 h-16 sm:p-4 sm:justify-end items-center sm:hidden">
        <JobCategoryFilterDropdownMenu
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
            <template v-if="filteredJobs.length > 0 && !isLoadingJobs">
                <JobCard :job="(liveJob as Job)" :showButtons="false" v-for="(liveJob,index) of filteredJobs" :key="index"/>
            </template>
            <template v-else-if="isLoadingJobs">
                <div class="h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3">
                    <LoadingSpinner :isLoading="isLoadingJobs"/>
                </div>
            </template>
            <template v-else>
                <div class="h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3">
                    <p class="text-xl font-bold">No Jobs Found</p>
                </div>
            </template>
        </div>
    </span>
</template>
<script setup lang='ts'>
import { ref, onMounted, type Ref, reactive, computed } from 'vue';
import type { Job } from '@/types';
import { getPaginatedCollectionGroupWhere } from '@/firebase/utils';
import JobCard from '@/components/cards/JobStoreCard.vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import JobCategoryFilterDropdownMenu from '@/components/props/JobCategoryFilterDropdownMenu.vue';
const liveJobs:Ref<Job[]> = ref([]);
const isLoadingJobs = ref(false);
const filters = reactive({
    min: 0,
    max: 100000,
})
const filteredJobs = computed(() => {
    return liveJobs.value.filter((job) => {
        return job.salaryMin >= filters.min && job.salaryMax <= filters.max
    })
})
const updateFilters = (newFilters) => {
    filters.value = { ...newFilters };
};
onMounted(async() => {
    isLoadingJobs.value = true;
    const paginatedJobs = await getPaginatedCollectionGroupWhere('jobs', 'live', '==', true, ['updatedAt','desc'], 25)
    liveJobs.value = paginatedJobs.docs as Job[];
    isLoadingJobs.value = false;
})
</script>