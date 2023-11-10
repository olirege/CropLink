<template>
    <span>
        <CardButton :classes="'w-full'" @click="onCreateJobPost">
            Create a job post
        </CardButton>
        <span class="grid grid-flow-row space-y-4" v-if="jobs.docs && jobs.docs.length > 0 && !isLoadingJobs" >
            <JobCard v-for="(job,index) in jobs.docs" :key="index" :job="job" @edit="onEditJobPost" @remove="onRemoveJobPost"/>
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
import { onMounted, type Ref, ref, onBeforeUnmount } from 'vue';
import CardButton from '../props/CardButton.vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { getPaginatedCollectionGroupWhere } from '@/firebase/utils';
import { useMainStore } from '@/stores/main';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { db } from '@/firebase/main';
import { onSnapshot, collectionGroup, query, where, orderBy } from 'firebase/firestore';
const { user } = storeToRefs(useMainStore());
const { modals } = storeToRefs(useModalStore());
const jobs: Ref<{lastVisible:Job, docs:Job[]}> = ref([]);
const isLoadingJobs = ref(false);
let stopSubscription:Function;
const loadJobs = async () => {
    isLoadingJobs.value = true;
    stopSubscription = onSnapshot(query(collectionGroup(db, 'jobs'), where('posterId', '==', user.value.uid), orderBy('createdAt','desc')), (snapshot) => {
        jobs.value.docs = snapshot.docs.map((doc) => {
            return {
                ...doc.data()
            } as Job;
        })
        jobs.value.lastVisible = jobs.value.docs && jobs.value.docs.length > 0 ? jobs.value.docs[jobs.value.docs.length - 1] : null;
    });
    isLoadingJobs.value = false;
}
const loadMoreJobs = async () => {
    isLoadingJobs.value = true;
    jobs.value = await getPaginatedCollectionGroupWhere('jobs', 'posterId', '==', user.value.uid , ['createdAt','desc'], 10, jobs.value.lastVisible);
    isLoadingJobs.value = false;
}
const onCreateJobPost = () => {
    modals.value['addjob'] = true;
}
const onRemoveJobPost = (jobId:string) => {
    modals.value['confirmremove'] = true;
    modals.value['context'] = {
        __key: 'job',
        jobId: jobId
    }
}
const onEditJobPost = (jobId:string) => {
    modals.value['editjob'] = true;
    const job = jobs.value.docs.find(job => job.jobId == jobId) as Job;
    modals.value['context'] = job;
}

onMounted(async () => {
    await loadJobs();
})
onBeforeUnmount(() => {
    if(stopSubscription) stopSubscription();
})
</script>