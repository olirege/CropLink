<template>
    JobView
    <div v-if="job && !isLoadingJob">
        {{ job }}
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