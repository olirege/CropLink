<template>
    <template v-if="chatrooms.docs && chatrooms.docs.length > 0 && !isLoadingChatRooms" >
        <template v-if="!withThumbnails">
            <div class="grid grid-flow-row space-y-4">
                <ChatRoomCard v-for="(chatroom,index) in chatrooms.docs" :key="index" :chatroom="chatroom"/>
            </div>
        </template>
        <template v-else>
            <div class="flex flex-col overflow-y-auto w-full flex-1 max-h-72">
                <ChatRoomThumbnailCard v-for="(chatroom,index) in chatrooms.docs" :key="index" :chatroom="chatroom"/>
            </div>
        </template>
   </template>
   <template v-else-if="chatrooms.docs && chatrooms.docs.length == 0 && !isLoadingChatRooms">
       <p>No conversations yet</p>
   </template>
   <template v-else>
        <LoadingSpinner :isLoading ="isLoadingChatRooms"/>
    </template>
</template>
<script setup lang="ts">
import type { ChatRoom } from '@/types';
import ChatRoomCard from '../cards/ChatRoomCard.vue';
import ChatRoomThumbnailCard from '../cards/ChatRoomThumbnailCard.vue';
import { type Ref, ref, onMounted, onBeforeUnmount } from 'vue';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { useMainStore } from '@/stores/main';
import { useModalStore } from '@/stores/modals';
import { useQuerySubscription } from '@/firebase/utils';
import { storeToRefs } from 'pinia';
const { user } = storeToRefs(useMainStore());
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const chatrooms: Ref<{lastVisible:ChatRoom, docs:ChatRoom[]}> = ref([]);
const isLoadingChatRooms = ref(false);
const props = defineProps({
    withThumbnails: {
        type: Boolean,
        default: false
    }
})
let buyerChatrooms = [];
let sellerChatrooms = [];
const { subscribe: sellerSub, unsubscribe:sellerUnsub } = useQuerySubscription(
    import.meta.env.VITE_CHATROOMS_COLLECTION,
    [
        ['sellerId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        sellerChatrooms = data as ChatRoom[];
        updateChatrooms(); // Update combined chatrooms
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading chatrooms, please try again later.'       
    },
    isLoadingChatRooms,
)
const { subscribe:buyerSub, unsubscribe:buyerUnsub } = useQuerySubscription(
    import.meta.env.VITE_CHATROOMS_COLLECTION,
    [
        ['buyerId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        buyerChatrooms = data as ChatRoom[];
        updateChatrooms(); // Update combined chatrooms
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading chatrooms, please try again later.'       
    },
    isLoadingChatRooms,
)
const updateChatrooms = () => {
    chatrooms.value.docs = [...buyerChatrooms, ...sellerChatrooms];
};

onMounted(async ()=>{
    sellerSub();
    buyerSub();
})
onBeforeUnmount(()=>{
    sellerUnsub();
    buyerUnsub();
})
</script>