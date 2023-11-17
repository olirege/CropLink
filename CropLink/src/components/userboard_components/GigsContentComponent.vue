<template>
    <span>
        <CardButton :classes="'w-full'" @click="onCreateGigPost">
            Create a gig post
        </CardButton>
        <span class="grid grid-flow-row space-y-4" v-if="gigs.docs && gigs.docs.length > 0 && !isLoadingGigs" >
            <GigCard v-for="(gig,index) in gigs.docs" :key="index" :gig="gig" @edit="onEditGigPost" @remove="onRemoveGigPost"/>
        </span>
        <span v-else-if="gigs.docs && gigs.docs.length == 0 && !isLoadingGigs">
            <p>No gig posts</p>
        </span>
        <div v-else="isLoadingGigs">
            <LoadingSpinner :isLoading ="isLoadingGigs"/>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Gig } from '@/types';
import GigCard from '../cards/GigCard.vue';
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
const gigs: Ref<{lastVisible:Gig, docs:Gig[]}> = ref([]);
const isLoadingGigs = ref(false);
let stopSubscription:Function;
const loadGigs = async () => {
    isLoadingGigs.value = true;
    stopSubscription = onSnapshot(query(collectionGroup(db, 'gigs'), where('posterId', '==', user.value.uid), orderBy('createdAt','desc')), (snapshot) => {
        gigs.value.docs = snapshot.docs.map((doc) => {
            return {
                ...doc.data()
            } as Gig;
        })
        gigs.value.lastVisible = gigs.value.docs && gigs.value.docs.length > 0 ? gigs.value.docs[gigs.value.docs.length - 1] : null;
    });
    isLoadingGigs.value = false;
}
const loadMoreGigs = async () => {
    isLoadingGigs.value = true;
    gigs.value = await getPaginatedCollectionGroupWhere('gigs', 'posterId', '==', user.value.uid , ['createdAt','desc'], 10, gigs.value.lastVisible);
    isLoadingGigs.value = false;
}
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
    await loadGigs();
})
onBeforeUnmount(() => {
    if(stopSubscription) stopSubscription();
})
</script>