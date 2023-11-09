<template>
    <span class="grid grid-flow-row space-y-4" v-if="chatrooms.docs && chatrooms.docs.length > 0 && !isLoadingChatRooms" >
       <ChatRoomCard v-for="(chatroom,index) in chatrooms.docs" :key="index" :chatroom="chatroom" />
   </span>
   <div v-else-if="isLoadingChatRooms">
        <LoadingSpinner :isLoading ="isLoadingChatRooms"/>
    </div>
    <span v-else>
        <p>No conversations yet</p>
    </span>
</template>
<script setup lang="ts">
import type { ChatRoom } from '@/types';
import ChatRoomCard from '../cards/ChatRoomCard.vue';
import { type Ref, ref, onMounted } from 'vue';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { getPaginatedCollectionGroupWhere }  from '@/firebase/utils';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
const { user } = storeToRefs(useMainStore());
const chatrooms: Ref<{lastVisible:ChatRoom, docs:ChatRoom[]}> = ref([]);
const isLoadingChatRooms = ref(false);
const loadChatRooms = async () => {
    isLoadingChatRooms.value = true;
    const buyerChatrooms = await getPaginatedCollectionGroupWhere('chatrooms', 'sellerId', '==', user.value.uid , ['createdAt','desc'], 10);
    const sellerChatrooms = await getPaginatedCollectionGroupWhere('chatrooms', 'buyerId', '==', user.value.uid , ['createdAt','desc'], 10);
    chatrooms.value.docs = [...buyerChatrooms.docs as ChatRoom[], ...sellerChatrooms.docs as ChatRoom[]];
    chatrooms.value.lastVisible = [buyerChatrooms.lastVisible as ChatRoom, sellerChatrooms.lastVisible as ChatRoom];
    isLoadingChatRooms.value = false;
}
onMounted(async ()=>{
    await loadChatRooms();
})
</script>