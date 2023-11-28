<template>
    <div class="h-32 flex flex-row items-center divide-x border-y px-2 grid grid-cols-4">
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Number of Jobs</span>
            <p class="text-4xl font-bold text-slate-500">{{ jobs.docs && jobs.docs.length }}</p> 
        </div>
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Number of live posts</span>
            <p class="text-4xl font-bold text-slate-500">{{ numberOfLiveJobs }}</p>
        </div>
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Total views</span>
            <p class="text-4xl font-bold text-slate-500">{{jobsTotalViewCount}}</p>
            <template v-if="isLoadingJobsViewCount">
                <div class="absolute top-0 left-0 w-full h-full bg-slate-200/50 z-10 flex justify-center items-center">
                    <LoadingSpinner :isLoading="isLoadingJobsViewCount" class="z-20"/>
                </div>
            </template>
        </div>
        <div class="p-2 flex items-center justify-center">
            <CardButton :classes="'w-full'" @click="onCreateJobPost">
                Create a job post
            </CardButton>
        </div>
    </div>
    <span class="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <span class="grid grid-flow-row space-y-4" v-if="jobs.docs && jobs.docs.length > 0 && !isLoadingJobs" >
            <JobCard v-for="(job,index) in jobs.docs" :key="index" :job="job" @edit="onEditJobPost" @remove="onRemoveJobPost"/>
        </span>
        <span v-else-if="jobs.docs && jobs.docs.length == 0 && !isLoadingJobs" class="h-96 p-2 flex items-center justify-center col-span-4">
            <p class="italic">No job posts</p>
        </span>
        <div v-else="isLoadingJobs">
            <LoadingSpinner :isLoading ="isLoadingJobs"/>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Job } from '@/types';
import JobCard from '../cards/JobDashboardCard.vue';
import { onMounted, type Ref, ref, onBeforeUnmount, computed } from 'vue';
import CardButton from '../props/CardButton.vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { useQuerySubscription } from '@/firebase/utils';
const { user } = storeToRefs(useMainStore());
const { modals, notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const jobs: Ref<{lastVisible:Job, docs:Job[]}> = ref([]);
const isLoadingJobs = ref(false);
const { subscribe, unsubscribe } = useQuerySubscription(
    import.meta.env.VITE_JOBS_COLLECTION,
    [
        ['posterId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        jobs.value.docs = data as Job[];
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading jobs, please try again later.'       
    },
    isLoadingJobs,
    ()=>{},
    ()=>{},
    (doc) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
        notifications.value.message = 'Job has been created.'
    },
    (doc) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
        notifications.value.message = 'Job has been removed.'
    },
)
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

const numberOfLiveJobs = computed(() => {
    if(!jobs.value.docs || jobs.value.docs.length === 0) {
        return 0;
    }
    return jobs.value.docs.filter((job) => job.live == true).length;
})
onMounted(async () => {
    subscribe();
    jobsTotalViewCountSub();
})
onBeforeUnmount(() => {
    unsubscribe();
    jobsTotalViewCountUnsub();
})
const jobsTotalViewCount = ref(0);
const isLoadingJobsViewCount = ref(false);
const { subscribe:jobsTotalViewCountSub , unsubscribe:jobsTotalViewCountUnsub} = useQuerySubscription(
    import.meta.env.VITE_ADS_COLLECTION,
    [
        ['posterId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        let totalViewCount = 0;
        data.forEach((job) => {
            totalViewCount += (job.viewCount ? job.viewCount : 0);
        })
        jobsTotalViewCount.value = totalViewCount;
    },
    undefined,
    isLoadingJobsViewCount,
)
</script>