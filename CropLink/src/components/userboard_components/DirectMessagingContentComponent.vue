<template>
    <template v-if="dms.docs && dms.docs.length > 0 && !isLoadingDms" >
        <div class="flex flex-col overflow-y-auto w-full flex-1 max-h-72">
            <DirectMessageCard v-for="(dm,index) in dms.docs" :key="index" :dm="dm" @click="onView(dm.dmId)"/>
        </div>
   </template>
   <template v-else-if="dms.docs && dms.docs.length == 0 && !isLoadingDms">
       <p>No direct messages yet</p>
   </template>
   <template v-else>
        <LoadingSpinner :isLoading ="isLoadingDms"/>
    </template>
</template>
<script setup lang="ts">
import type { ChatRoom } from '@/types';
import DirectMessageCard from '../cards/DirectMessageCard.vue';
import { type Ref, ref, onMounted, onBeforeUnmount } from 'vue';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { getPaginatedCollectionGroupWhere }  from '@/firebase/utils';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, collectionGroup, query, where, orderBy } from 'firebase/firestore';
const { user } = storeToRefs(useMainStore());
const emits = defineEmits(['view']);
const dms: Ref<{lastVisible:ChatRoom, docs:ChatRoom[]}> = ref({lastVisible: null, docs: [] });
const isLoadingDms = ref(false);
const loadMoreDms = async () => {
    isLoadingDms.value = true;
    dms.value = await getPaginatedCollectionGroupWhere('dms', 'sellerId', '==', user.value.uid , ['createdAt','desc'], 10, dms.value.lastVisible && dms.value.lastVisible.length > 0 ? dms.value.lastVisible[0] : null);
    isLoadingDms.value = false;
}

let stopSubscription = null;
let dmsBuffer = [];

const loadDms = async () => {
    stopSubscription = onSnapshot(query(collectionGroup(db, 'dms'), where('sellerId', '==', user.value.uid), orderBy('createdAt', 'desc')), (snapshot) => {
        isLoadingDms.value = true;
        dmsBuffer = snapshot.docs.map((doc) => ({...doc.data()}));
        updateChatrooms(); // Update combined chatrooms
        isLoadingDms.value = false;
    });
};

const updateChatrooms = () => {
    dms.value.docs = dmsBuffer;
};

const unsubscribe = () => {
    if (stopSubscription) stopSubscription();
};
const onView = (dmId:string) => {
    emits('view', dmId);
}
onMounted(async ()=>{
    await loadDms();
})
onBeforeUnmount(()=>{
    unsubscribe();
})
</script>