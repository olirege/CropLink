<template>
     <span class="flex flex-row gap-2 relative w-full">
        <div class="w-1/6 py-4 px-2 sticky top-24 h-64">
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
        <div class="p-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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
onMounted(async() => {
    isLoadingJobs.value = true;
    const paginatedJobs = await getPaginatedCollectionGroupWhere('jobs', 'live', '==', true, ['updatedAt','desc'], 25)
    liveJobs.value = paginatedJobs.docs as Job[];
    isLoadingJobs.value = false;
})
</script>