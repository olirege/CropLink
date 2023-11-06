<template>
    <div v-if="chatRoom && !isLoadingChatRoom" class="p-4 max-w-lg mx-auto bg-white rounded-lg shadow-md flex flex-col space-y-4">
        <h1 class="text-xl font-semibold border-b pb-2">Messaging</h1>
        <div v-if="messages.length > 0" class="flex flex-col space-y-2 overflow-y-auto max-h-96">
            <span v-for="(message,index) in messages" class="break-words">
                <div class="flex justify-between mb-2" v-if="showIfPreviousMessageIsDifferent(index)">
                    <p class="text-sm font-medium">{{ message.senderId.substring(0,5) }} says:</p>
                    <p class="text-sm font-medium">{{ fromNow(message.createdAt) }}</p>
                </div>
                <p :class="
                [message.senderId === user.value.uid ? 'bg-blue-100 ml-auto' : 'bg-gray-100', 'rounded-md p-2 inline-block']
                ">
                {{ message.text }}
            </p>
            </span>
        </div>
        <div v-else class="flex justify-center items-center h-32">
            <p class="text-gray-500">No messages yet</p>
        </div>
        <span class="flex items-end space-x-2">
            <textarea v-model="message.text" class="w-full p-2 border rounded-md resize-none focus:border-blue-500 focus:ring-0" placeholder="Type your message here..." rows="1"></textarea>
            <button @click="onSendMessage" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out">Send</button>
        </span>
    </div>
    <div v-if="isLoadingChatRoom">
        <LoadingSpinner :isLoading="isLoadingChatRoom"/>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, query, orderBy, collection, addDoc, Timestamp } from 'firebase/firestore';
import { convertTimestampToDate, getDocsFromCollectionWhere } from '@/firebase/utils';
import type { ChatRoom, Message } from '@/types';
const props = defineProps({
    adId: {
        type: String,
        required: false
    },
})
const { user, profile } = storeToRefs(useMainStore());
const isLoadingChatRoom = ref(false);
const chatRoom = ref({} as ChatRoom);
const message = ref({} as Message);
const messages = ref([] as Message[])
let stopChatRoomMessagesSubscription:any;
const loadChatroom = async () => {
    // fetch chatroom with adid as adid
    isLoadingChatRoom.value = true;
    const chatroomDocs = await getDocsFromCollectionWhere('chatrooms', 'adId', '==', props.adId);
    const chatroom = chatroomDocs[0];
    if(!chatroom) return;
    chatRoom.value = {
        ...chatroom
    } as ChatRoom;
    isLoadingChatRoom.value = false;
    // subscribe to chatroom messages
    stopChatRoomMessagesSubscription = onSnapshot(query(collection(db, `chatrooms/${chatroom.id}/messages`), orderBy('createdAt','asc')), (snapshot) => {
        messages.value = snapshot.docs.map((doc) => {
            return {
                ...doc.data()
            } as Message;
        })
    })

}
onMounted(async () => {
    await loadChatroom();
})
onBeforeUnmount(()=>{
    if(stopChatRoomMessagesSubscription) stopChatRoomMessagesSubscription()
})
const isSendingMessage = ref(false);
const onSendMessage = async () => {
    isSendingMessage.value = true
    if(!chatRoom.value) return;
    if(!message.value.text) return;
    if(!user.value) return;
    if(!profile.value) return;
    const messageRef = collection(db, 'chatrooms', chatRoom.value.id, 'messages');
    message.value.createdAt = new Date();
    message.value.senderId = user.value.uid;
    await addDoc(messageRef, message.value);
    isSendingMessage.value = false
}
const fromNow = (date:Timestamp) => {
    // return when the message was sent
    // a second ago, a minute ago, x minutes ago, etc..
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
    return false;
} 
</script>
<style scoped>
textarea{
    resize:none;
}
</style>