<template>
    <span class="grid grid-flow-row space-y-4" v-if="chatrooms.docs && chatrooms.docs.length > 0 && !isLoadingChatRooms" >
       <ChatRoomCard v-for="(chatroom,index) in chatrooms.docs" :key="index" :chatroom="chatroom" />
   </span>
   <span v-else-if="chatrooms.docs && chatrooms.docs.length == 0 && !isLoadingChatRooms">
       <p>No conversations yet</p>
   </span>
   <div v-else>
        <LoadingSpinner :isLoading ="isLoadingChatRooms"/>
    </div>
</template>
<script setup lang="ts">
import type { ChatRoom } from '@/types';
import ChatRoomCard from '../cards/ChatRoomCard.vue';
import { type Ref, ref, onMounted, onBeforeUnmount } from 'vue';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { getPaginatedCollectionGroupWhere }  from '@/firebase/utils';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, collectionGroup, query, where, orderBy } from 'firebase/firestore';
const { user } = storeToRefs(useMainStore());
const chatrooms: Ref<{lastVisible:ChatRoom, docs:ChatRoom[]}> = ref([]);
const isLoadingChatRooms = ref(false);

const loadMoreChatRooms = async () => {
    isLoadingChatRooms.value = true;
    const buyerChatrooms = await getPaginatedCollectionGroupWhere('chatrooms', 'buyerId', '==', user.value.uid , ['createdAt','desc'], 10, chatrooms.value.lastVisible && chatrooms.value.lastVisible.length > 0 ? chatrooms.value.lastVisible[0] : null);
    const sellerChatrooms = await getPaginatedCollectionGroupWhere('chatrooms', 'sellerId', '==', user.value.uid , ['createdAt','desc'], 10, chatrooms.value.lastVisible && chatrooms.value.lastVisible.length > 0 ? chatrooms.value.lastVisible[1] : null );
    chatrooms.value.docs = [...buyerChatrooms.docs as ChatRoom[], ...sellerChatrooms.docs as ChatRoom[]];
    chatrooms.value.lastVisible = [buyerChatrooms.lastVisible as ChatRoom, sellerChatrooms.lastVisible as ChatRoom];
    isLoadingChatRooms.value = false;
}

let stopSubscriptionSeller = null;
let stopSubscriptionBuyer = null;
let buyerChatrooms = [];
let sellerChatrooms = [];

const loadChatRooms = async () => {
    stopSubscriptionSeller = onSnapshot(query(collectionGroup(db, 'chatrooms'), where('sellerId', '==', user.value.uid), orderBy('createdAt', 'desc')), (snapshot) => {
        isLoadingChatRooms.value = true;
        sellerChatrooms = snapshot.docs.map((doc) => ({...doc.data()}));
        updateChatrooms(); // Update combined chatrooms
        isLoadingChatRooms.value = false;
    });
    stopSubscriptionBuyer = onSnapshot(query(collectionGroup(db, 'chatrooms'), where('buyerId', '==', user.value.uid), orderBy('createdAt', 'desc')), (snapshot) => {
        isLoadingChatRooms.value = true;
        buyerChatrooms = snapshot.docs.map((doc) => ({...doc.data()}));
        updateChatrooms(); // Update combined chatrooms
        isLoadingChatRooms.value = false;
    });
};

const updateChatrooms = () => {
    chatrooms.value.docs = [...buyerChatrooms, ...sellerChatrooms];
};

const unsubscribe = () => {
    if (stopSubscriptionSeller) stopSubscriptionSeller();
    if (stopSubscriptionBuyer) stopSubscriptionBuyer();
};

onMounted(async ()=>{
    await loadChatRooms();
})
onBeforeUnmount(()=>{
    unsubscribe();
})
</script>