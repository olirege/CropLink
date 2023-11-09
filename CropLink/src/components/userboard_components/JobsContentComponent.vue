<template>
    <span>
        <CardButton :classes="'w-full'" @click="onCreateJobPost">
            Create a job post
        </CardButton>
        <span class="grid grid-flow-row space-y-4" v-if="jobs.docs && jobs.docs.length > 0 && !isLoadingJobs" >
            <JobCard v-for="(job,index) in jobs.docs" :key="index" :job="job" />
        </span>
        <span v-else-if="jobs.docs && jobs.docs.length == 0 && !isLoadingJobs">
            <p>No job posts</p>
        </span>
        <div v-else="isLoadingJobs">
            <LoadingSpinner :isLoading ="isLoadingJobs"/>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Job } from '@/types';
import JobCard from '../cards/JobCard.vue';
import { onMounted, type Ref, ref } from 'vue';
import CardButton from '../props/CardButton.vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { getPaginatedCollectionGroupWhere } from '@/firebase/utils';
import { useMainStore } from '@/stores/main';
import LoadingSpinner from '../props/LoadingSpinner.vue';
const { user } = storeToRefs(useMainStore());
const { modals } = storeToRefs(useModalStore());
const jobs: Ref<{lastVisible:Job, docs:Job[]}> = ref([]);
const isLoadingJobs = ref(false);
const loadJobs = async () => {
    isLoadingJobs.value = true;
    jobs.value = await getPaginatedCollectionGroupWhere('jobs', 'posterId', '==', user.value.uid , ['createdAt','desc'], 10);
    isLoadingJobs.value = false;
}
const onCreateJobPost = () => {
    modals.value['addjob'] = true;
}
onMounted(async () => {
    await loadJobs();
})
</script>