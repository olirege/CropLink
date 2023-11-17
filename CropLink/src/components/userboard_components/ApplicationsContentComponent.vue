<template>
    <span>
        <span class="grid grid-flow-row space-y-4" v-if="applications.docs && applications.docs.length > 0 && !isLoadingApplication" >
            <ApplicationCard v-for="(application,index) in applications.docs" :key="index" :application="application" @remove="onRemoveJobPost"/>
        </span>
        <span v-else-if="applications.docs && applications.docs.length == 0 && !isLoadingApplication">
            <p>No application posts</p>
        </span>
        <div v-else="isLoadingApplication">
            <LoadingSpinner :isLoading ="isLoadingApplication"/>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Job } from '@/types';
import ApplicationCard from '../cards/ApplicationCard.vue';
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
const applications: Ref<{lastVisible:Job, docs:Job[]}> = ref([]);
const isLoadingApplication = ref(false);
let stopSubscription:Function;
const loadApplication = async () => {
    isLoadingApplication.value = true;
    stopSubscription = onSnapshot(query(collectionGroup(db, 'applications'), where('ownerId', '==', user.value.uid), orderBy('createdAt','desc')), (snapshot) => {
        applications.value.docs = snapshot.docs.map((doc) => {
            return {
                ...doc.data()
            } as Job;
        })
        applications.value.lastVisible = applications.value.docs && applications.value.docs.length > 0 ? applications.value.docs[applications.value.docs.length - 1] : null;
    });
    isLoadingApplication.value = false;
}
const loadMoreApplication = async () => {
    isLoadingApplication.value = true;
    applications.value = await getPaginatedCollectionGroupWhere('applications', 'ownerId', '==', user.value.uid , ['createdAt','desc'], 10, applications.value.lastVisible);
    isLoadingApplication.value = false;
}
const onRemoveJobPost = (applicationId:string) => {
    modals.value['confirmremove'] = true;
    modals.value['context'] = {
        __key: 'application',
        applicationId: applicationId
    }
}
onMounted(async () => {
    await loadApplication();
})
onBeforeUnmount(() => {
    if(stopSubscription) stopSubscription();
})
</script>