<template>
    <div class="h-32 flex flex-row items-center divide-x border-y px-2 grid grid-cols-5">
        <div class="p-2 h-16">
            <span class="text-sm font-medium text-slate-300">Number of Gigs</span>
            <p class="text-2xl font-bold text-slate-500">{{ gigs.docs && gigs.docs.length }}</p> 
        </div>
        <div class="p-2 h-16">
            <span class="text-sm font-medium text-slate-300">Number of live posts</span>
            <p class="text-2xl font-bold text-slate-500">{{ numberOfLiveGigs }}</p>
        </div>
        <div class="p-2 h-16">
            <span class="text-sm font-medium text-slate-300">Total views</span>
            <p class="text-2xl font-bold text-slate-500">{{ gigsTotalViewCount }}</p>
            <template v-if="isLoadingGigsViewCount">
                <div class="absolute top-0 left-0 w-full h-full bg-slate-200/50 z-10 flex justify-center items-center">
                    <LoadingSpinner :isLoading="isLoadingGigsViewCount" class="z-20"/>
                </div>
            </template>
        </div>
        <div class="p-2 flex flex-col justify-between h-16">
            <span class="text-sm font-medium text-slate-300">Milestones Total</span>
            <p class="text-2xl font-bold text-slate-500" v-currency="milestonesTotal"></p>
        </div>
        <div class="p-2 flex items-center justify-center">
            <CardButton :classes="'w-full'" @click="onCreateGigPost">
            Create a gig post
            </CardButton>
        </div>
    </div>
    <span class="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <span class="grid grid-flow-row space-y-4" v-if="gigs.docs && gigs.docs.length > 0 && !isLoadingGigs" >
            <GigCard v-for="(gig,index) in gigs.docs" :key="index" :gig="gig" @edit="onEditGigPost" @remove="onRemoveGigPost"/>
        </span>
        <span v-else-if="gigs.docs && gigs.docs.length == 0 && !isLoadingGigs" class="h-96 p-2 flex items-center justify-center col-span-4">
            <p class="italic">No gig posts</p>
        </span>
        <div v-else="isLoadingGigs">
            <LoadingSpinner :isLoading ="isLoadingGigs"/>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Gig } from '@/types';
import GigCard from '../cards/GigDashboardCard.vue';
import { onMounted, type Ref, ref, onBeforeUnmount, computed } from 'vue';
import CardButton from '../props/CardButton.vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main';
import { useQuerySubscription } from '@/firebase/utils';
import LoadingSpinner from '../props/LoadingSpinner.vue';
const { user } = storeToRefs(useMainStore());
const { modals, notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const gigs: Ref<{lastVisible:Gig, docs:Gig[]}> = ref([]);
const isLoadingGigs = ref(false);
const { subscribe, unsubscribe } = useQuerySubscription(
    import.meta.env.VITE_GIGS_COLLECTION,
    [
        ['posterId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        gigs.value.docs = data as Gig[];
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading gigs, please try again later.'       
    },
    isLoadingGigs,
    ()=>{},
    ()=>{},
    (doc) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
        notifications.value.message = 'Gig has been created.'
    },
    (doc) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
        notifications.value.message = 'Gig has been removed.'
    },
)
const onCreateGigPost = () => {
    modals.value['addgig'] = true;
}
const onRemoveGigPost = (gigId:string) => {
    modals.value['confirmremove'] = true;
    modals.value['context'] = {
        __key: 'gig',
        gigId: gigId
    }
}
const onEditGigPost = (gigId:string) => {
    modals.value['editgig'] = true;
    const gig = gigs.value.docs.find(gig => gig.gigId == gigId) as Gig;
    modals.value['context'] = gig;
}

onMounted(async () => {
    subscribe();
    gigsTotalViewCountSub();
})
onBeforeUnmount(() => {
    unsubscribe();
    gigsTotalViewCountUnsub();
})
const milestonesTotal = computed(() => {
    if(!gigs.value.docs || gigs.value.docs.length === 0) {
        return 0;
    }
    return gigs.value.docs.reduce((acc, gig) => {
        if(gig.milestones) {
            return acc + gig.milestones.reduce((acc, milestone) => {
                return acc + milestone.price;
            }, 0)
        }
        return acc;
    }, 0)
})
const numberOfLiveGigs = computed(() => {
    if(!gigs.value.docs || gigs.value.docs.length === 0) {
        return 0;
    }
    return gigs.value.docs.filter((gig) => gig.live == true).length;
})
const gigsTotalViewCount = ref(0);
const isLoadingGigsViewCount = ref(false);
const { subscribe:gigsTotalViewCountSub , unsubscribe:gigsTotalViewCountUnsub} = useQuerySubscription(
    import.meta.env.VITE_ADS_COLLECTION,
    [
        ['posterId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        let totalViewCount = 0;
        data.forEach((gig) => {
            totalViewCount += (gig.viewCount ? gig.viewCount : 0);
        })
        gigsTotalViewCount.value = totalViewCount;
    },
    undefined,
    isLoadingGigsViewCount,
)
</script>