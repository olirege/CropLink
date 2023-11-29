<template>
      <div class="h-32 flex flex-row items-center divide-x border-y px-2 grid grid-cols-3">
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Number of Applications</span>
            <p class="text-4xl font-bold text-slate-500">{{ applications.docs ? applications.docs.length : 0 }}</p> 
        </div>
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Number of Gigs Applications</span>
            <p class="text-4xl font-bold text-slate-500">{{ numberOfGigs }}</p>
        </div>
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Number of Jobs Application</span>
            <p class="text-4xl font-bold text-slate-500">{{ numberOfJobs }}</p>
        </div>
    </div>
    <div class="p-4">
        <div class="flex flex-row gap-4 h-6 mb-2 items-center">
            <div class="flex flex-row gap-2 items-center">
                <input type="checkbox" class="w-4 h-4" v-model="filterByGig"/>
                <p class="text-sm font-medium text-slate-300">Gig</p>
            </div>
            <div class="flex flex-row gap-2 items-center">
                <input type="checkbox" class="w-4 h-4" v-model="filterByJob"/>
                <p class="text-sm font-medium text-slate-300">Job</p>
            </div>
        </div>
        <table  v-if="applications.docs && applications.docs.length > 0 && !isLoadingApplication"  class="table-fixed w-full border-collapse">
            <thead class="border-y">
                <tr class="text-left">
                    <th class="py-4">Application ID</th>
                    <th class="py-4">Name</th>
                    <th class="py-4">Email</th>
                    <th class="py-4">For</th>
                    <th class="py-4">Recieved On</th>
                    <th class="py-4">Action</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(application,index) in filteredApplications" :key="index">
                    <tr>
                        <td class="py-2">{{ application.applicationId.substring(0,5) }}</td>
                        <td class="py-2 capitalize truncate">{{ application.name }}</td>
                        <td class="py-2 truncate">{{ application.email }}</td>
                        <td class="py-2">
                            <div class="flex flex-row gap-2 items-center">
                                <div class="rounded-full w-2 h-2 " :class="{
                                    'bg-green-500': application.parentType == 'gig',
                                    'bg-blue-500': application.parentType == 'job',
                                }" />
                                <p class="pb-1 capitalize">{{ application.parentType }}</p>
                            </div>
                        </td>
                        <td class="py-2 italic">
                        {{ isFirestoreTimestamp(application.createdAt) ? fromNow(application.createdAt) : application.createdAt }}
                        </td>
                        <td class="relative">
                            <ApplicationDropdownMenu @remove="onRemove(application.applicationId)" @view="onView(application.applicationId)" @contact="onMessage(application)"/>
                        </td>
                    </tr>
                    <tr v-if="showIframe == application.applicationId">
                        <td colspan="6">
                        <iframe ref="iframeRef" :src="application.resume" width="100%" height="500px" @load="onLoadIframe"></iframe>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <span v-else-if="applications.docs && applications.docs.length == 0 && !isLoadingApplication" class="h-96 p-2 flex items-center justify-center">
            <p class="italic">No application posts</p>
        </span>
        <div v-else="isLoadingApplication">
            <LoadingSpinner :isLoading ="isLoadingApplication"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Application } from '@/types';
import ApplicationDropdownMenu from '../props/ApplicationDropdownMenu.vue';
import { onMounted, type Ref, ref, onBeforeUnmount, computed } from 'vue';
import { useQuerySubscription } from '@/firebase/utils';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { Timestamp } from 'firebase/firestore';
import { isFirestoreTimestamp } from '@/firebase/utils';
const { user } = storeToRefs(useMainStore());
const { modals, notifications, messaging } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const applications: Ref<{lastVisible:Application, docs:Application[]}> = ref([]);
const isLoadingApplication = ref(false);
const { subscribe, unsubscribe } = useQuerySubscription(
    import.meta.env.VITE_APPLICATIONS_COLLECTION,
    [
        ['ownerId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        applications.value.docs = data as Job[];
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading applications, please try again later.'       
    },
    isLoadingApplication,
    ()=>{},
    ()=>{},
    (doc) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
        notifications.value.message = 'A new application has been received.'
    },
    (doc) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
        notifications.value.message = 'Application has been removed.'
    },
)
const onRemove = (applicationId:string) => {
    modals.value['confirmremove'] = true;
    modals.value['context'] = {
        __key: 'application',
        applicationId: applicationId
    }
}
const showIframe = ref('');
const onView = (applicationId:string) => {
    if(showIframe.value === applicationId) {
        showIframe.value = '';
        return;
    }
    showIframe.value = applicationId;
}
const onLoadIframe = () => {
    console.log('loaded');
}
const onMessage = async (application:Application) => {
    console.log("onMessage",application.applicationId);
    messaging.value.show = true;
    messaging.value.to = {
        id: application.applicantId,
        name: application.name
    }
    messaging.value.context = {
        __key: 'application',
        application: application
    }
}
onMounted(async () => {
    subscribe();
})
onBeforeUnmount(() => {
    unsubscribe();
})
const filterByGig = ref(false);
const filterByJob = ref(false);
const filteredApplications = computed(() => {
    if(!applications.value.docs) return [];
    if(filterByGig.value && filterByJob.value) {
        return applications.value.docs;
    } else if(filterByGig.value) {
        return applications.value.docs.filter((application) => application.parentType === 'gig');
    } else if(filterByJob.value) {
        return applications.value.docs.filter((application) => application.parentType === 'job');
    } else {
        return applications.value.docs;
    }
})
const fromNow = (date:Timestamp) => {
    const now = new Date();
    const messageDate = date.toDate();
    const diff = now.getTime() - messageDate.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if(days > 0) {
        return `${days} days ago`;
    } else if(hours > 0) {
        return `${hours} hours ago`;
    } else if(minutes > 0) {
        return `${minutes} minutes ago`;
    } else if(seconds > 0) {
        return `${seconds} seconds ago`;
    } else {
        return `just now`;
    }
}
const numberOfGigs = computed(() => {
    if(!applications.value.docs) return 0;
    return applications.value.docs.filter((application) => application.parentType === 'gig').length;
})
const numberOfJobs = computed(() => {
    if(!applications.value.docs) return 0;
    return applications.value.docs.filter((application) => application.parentType === 'job').length;
})
</script>