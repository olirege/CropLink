<template>
    <template v-if="chatRoom.id && !isLoadingChatRoom && user && profile">
        <div class="p-4 w-full mx-auto bg-white rounded-lg shadow-md flex flex-col space-y-4">
            <h1 class="text-xl font-semibold border-b pb-2">Messaging</h1>
            <div v-if="messages.length > 0 && !isLoadingMessages" class="flex flex-col space-y-2 overflow-y-auto h-full">
                <span v-for="(message,index) in messages" class="break-words">
                    <div class="flex justify-between mb-2" v-if="showIfPreviousMessageIsDifferent(index)">
                        <p class="text-sm font-medium">{{ message.senderId.substring(0,5) }} says:</p>
                        <p class="text-sm font-medium">{{ fromNow(message.createdAt) }}</p>
                    </div>
                    <div :class="[message.senderId != user.uid ? 'justify-end' : 'justify-start', 'flex']">
                        <div class="flex flex-col space-y-1">
                            <p v-if="message.quote && message.quote.text" 
                            class="truncate bg-gray-100 rounded-md p-2 max-w-xs md:max-w-md text-xs rounded-md p-1 bg-slate-200">
                            <span class="font-bold">clause:</span> <span class="italic">{{ message.quote.text }}</span>
                            </p>
                            <p :class="[message.senderId === user.uid ? 'bg-blue-500 text-white' : 'bg-gray-100', 'rounded-md p-2 max-w-xs md:max-w-md', message.quote ? 'ml-2' : '']">
                                {{ message.text }}
                            </p>
                        </div>
                    </div>
                </span>
            </div>
            <div v-else-if="messages.length == 0 && !isLoadingMessages" class="flex justify-center items-center h-32 flex-grow">
                <p class="text-gray-500">No messages yet</p>
            </div>
            <div v-else-if="isLoadingMessages" class="flex justify-center items-center h-32 flex-grow">
                <LoadingSpinner :isLoading="isLoadingMessages"/>
            </div>
            <span class="flex items-end space-x-2">
                <div class="border rounded-md w-full p-2">
                    <div v-if="clauseMentionned.id" class="relative w-full truncate bg-gray-100 rounded-md p-2 max-w-xs md:max-w-md text-xs rounded-md p-1 bg-slate-200">
                        <XCircleIcon class="h-4 w-4 absolute top-1 right-1" @click="$emit('onRemoveMentionnedClause')"/>
                        <p class="text-sm text-slate-500 truncate"><span class="font-bold">clause: </span><span class="italic">{{ clauseMentionned.text }}</span></p>
                    </div>
                    <textarea v-model="message.text" class="h-full w-full resize-none focus:outline-none" placeholder="Type your message here..."></textarea>
                </div>
                <div class="h-full flex items-start">
                    <PaperAirplaneIcon @click="onSendMessage" class="h-6 w-6 text-blue-500" />
                </div>
            </span>
        </div>
    </template>
    <template v-else-if="!chatRoom.id && !isLoadingChatRoom">
        <div class="flex justify-center items-center h-32">
            <p class="text-gray-500">No chatroom found</p>
        </div>
    </template>
    <template v-else="isLoadingChatRoom">
        <div>
            <LoadingSpinner :isLoading="isLoadingChatRoom"/>
        </div>
    </template>
</template>
<script setup lang="ts">
import type { ChatRoom, Message, Clause } from '@/types'
import { type PropType, ref, onMounted, onBeforeUnmount } from 'vue'
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { collection, addDoc, type Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/main';
import {  XCircleIcon } from '@heroicons/vue/20/solid';
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline';
import { useCollectionQuerySubscription } from '@/firebase/utils';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/modals';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const emits = defineEmits(['onRemoveMentionnedClause']);
const props = defineProps({
    clauseMentionned: {
        type: Object as PropType<Clause>,
        default: {} as Clause
    },
    adId: {
        type: String,
        required: true
    }
})
const { user, profile } = storeToRefs(useMainStore());
const router = useRouter();
const CHATROOMS_COLLECTION = import.meta.env.VITE_CHATROOMS_COLLECTION as string;
const MESSAGES_COLLECTION = import.meta.env.VITE_MESSAGES_COLLECTION as string;
const isLoadingChatRoom = ref(false);
const isLoadingMessages = ref(false);
const chatRoom = ref({} as ChatRoom);
const message = ref({} as Message);
const messages = ref([] as Message[])
let stopChatRoomMessagesSubscription:any;
const loadMessages = async () => {
    const order = [
        ['createdAt', 'asc']
    ];
    const conditions = [];
    const collectionName = `${CHATROOMS_COLLECTION}/${chatRoom.value.id}/${MESSAGES_COLLECTION}`;
    const { subscribe, unsubscribe } = useCollectionQuerySubscription(
        collectionName,
        conditions,
        order,
        (data) => {
            messages.value = data;
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = "Error loading messages, please try again later"
        },
        isLoadingMessages,
    );
    stopChatRoomMessagesSubscription = unsubscribe;
    subscribe();
}
let unsubscribeToChatRoom: any;
const loadChatroom = async () => {
    const collectionName = CHATROOMS_COLLECTION;
    const conditions = [
        ['adId', '==', props.adId],
    ];
    const order = [];
    const { subscribe, unsubscribe } = useCollectionQuerySubscription(
        collectionName,
        conditions,
        order,
        (data) => {
            if(data.length > 0) {
                chatRoom.value = data[0];
                loadMessages();
            }
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = "Error loading chatroom, please try again later"
        },
        isLoadingChatRoom,
    );
    unsubscribeToChatRoom = unsubscribe;
    subscribe();
}
onMounted(async () => {
    try{
        await loadChatroom();
    } catch(e:any) {
        if(e.message == "Chatroom not found") router.push('/')
    }
})
onBeforeUnmount(()=>{
    if(stopChatRoomMessagesSubscription) stopChatRoomMessagesSubscription();
    if(unsubscribeToChatRoom) unsubscribeToChatRoom();
})
const isSendingMessage = ref(false);
const onSendMessage = async () => {
    isSendingMessage.value = true
    if(!chatRoom.value) return;
    if(!message.value.text) return;
    if(!user.value) return;
    if(!profile.value) return;
    const messageRef = collection(db, CHATROOMS_COLLECTION, chatRoom.value.id, MESSAGES_COLLECTION);
    message.value.quote = props.clauseMentionned;
    message.value.createdAt = new Date();
    message.value.senderId = user.value.uid;
    await addDoc(messageRef, message.value);
    message.value.text = '';
    emits('onRemoveMentionnedClause');
    isSendingMessage.value = false
}
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
const showIfPreviousMessageIsDifferent = (index:number) => {
    if(index === 0) return true;
    const previousMessage = messages.value[index - 1];
    const currentMessage = messages.value[index];
    if(previousMessage.senderId !== currentMessage.senderId) return true;
    if(previousMessage.createdAt.toDate().getHours() !== currentMessage.createdAt.toDate().getHours()) return true;
    return false;
}
</script>