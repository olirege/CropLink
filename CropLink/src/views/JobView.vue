<template>
    <div v-if="job && !isLoadingJob" class="inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div class="flex flex-col gap-2 justify-start items-start border rounded-md w-96">
                <span class="px-5 pt-5 text-left">
                    <h1 class="text-xl font-bold">{{ job.title  }}</h1>
                    <p class="text-md">{{ job.location }}</p>
                    <p class="text-md">${{ job.salary }}</p>
                    <p class="text-md">{{ job.type }}</p>
                    <CardButton>
                        Apply
                    </CardButton>
                </span>
                <div class="w-full border-t-2 h-64 overflow-y-scroll">
                    <p class="text-md text-left p-5">{{ job.description }}</p>
                </div>
                <div class="w-full flex flex-col gap-2 justify-start items-start px-5 pb-5">
                    <div v-for="task in job.tasks">
                        <p class="text-md">{{ task }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <LoadingSpinner :isLoading="isLoadingJob"/>
    </div>
</template>
<script setup lang="ts">
import { type PropType, ref, onMounted } from 'vue';
import type { Job } from '@/types';
import { queryForCollectionGroupDocumentById } from '@/firebase/utils';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import CardButton from '@/components/props/CardButton.vue';
const props = defineProps({
    jobId: {
        type: String as PropType<string>,
        required: true
    }
})
const job = ref({} as Job);
const isLoadingJob = ref(false);
const loadJob = async () => {
    isLoadingJob.value = true;
    job.value = await queryForCollectionGroupDocumentById('jobs', props.jobId, 'jobId') as Job;
    isLoadingJob.value = false;
}
onMounted(async () => {
    await loadJob();
})
</script>