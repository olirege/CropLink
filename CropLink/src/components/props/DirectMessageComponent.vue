<template>
    <span class="duration-300 transition transform ease-in-out">
        <div class="w-56 rounded rounded-t-md fixed bottom-0 right-1 h-10 bg-white z-10 border-x-4 border-t-4 flex justify-center items-center" @click="onOpen(true)" v-if="!open">
            <div class="flex justify-between items-center flex-row gap-4">
                <span class="flex justify-center items-center flex-row gap-4">
                    <EnvelopeIcon class="h-6 w-6" />
                    <h1 class="text-lg font-bold">Messaging</h1>
                </span>
                <ChevronUpIcon class="h-6 w-6" />
            </div>
        </div>
        <div class="w-80 h-96 fixed bottom-0 right-1 bg-white z-10 border-4 rounded-t-md shadow-md" v-if="open && !messaging.show">
            <div class="p-4 w-full mx-auto rounded-lg flex flex-col space-y-4">
                <div class="flex justify-between items-center flex-row gap-4 border-b pb-2" @click="onOpen(false)">
                    <h1 class="text-xl font-semibold">Messaging</h1>
                    <ChevronDownIcon class="h-6 w-6"/>
                </div>
                <DirectMessagingContentComponent @view="onViewDm"/>
            </div>
        </div>
        <div class="w-96 h-96 fixed bottom-0 right-1 bg-white z-10 border-4 rounded-t-md shadow-md" v-if="messaging.show">
            <div class="flex flex-col h-full p-4 w-full mx-auto rounded-lg space-y-4">
                <h1 class="text-xl font-semibold border-b pb-2" @click="onOpenDm(false)">Send a Message</h1>
                <div class="flex-grow overflow-hidden">
                    <div v-if="messages.length > 0 && !isLoadingMessages" class="flex flex-col space-y-2 overflow-y-auto h-full">
                        <span v-for="(message,index) in messages" class="break-words">
                            <div class="flex justify-between mb-2" v-if="showIfPreviousMessageIsDifferent(index)">
                                <p class="text-sm font-medium">{{ message.senderId.substring(0,5) }} says:</p>
                                <p class="text-sm font-medium">{{ fromNow(message.createdAt) }}</p>
                            </div>
                            <div :class="[message.senderId != user.uid ? 'justify-end' : 'justify-start', 'flex']">
                                <p :class="[message.senderId === user.uid ? 'bg-blue-500 text-white' : 'bg-gray-100', 'rounded-md p-2 max-w-xs md:max-w-md', message.quote ? 'ml-2' : '']">
                                    {{ message.text }}
                                </p>
                            </div>
                        </span>
                    </div>
                    <div v-else-if="messages.length == 0 && !isLoadingMessages" class="flex justify-center items-center h-32">
                        <p class="text-gray-500">No messages yet</p>
                    </div>
                    <div v-else-if="isLoadingMessages" class="flex justify-center items-center h-32">
                        <LoadingSpinner :isLoading="isLoadingMessages"/>
                    </div>
                </div>
                <div class="flex flex-row gap-2">
                    <div class="border rounded-md w-full p-2">
                        <textarea v-model="directMessage" class="h-full w-full resize-none focus:outline-none" placeholder="Type your message here..."></textarea>
                    </div>
                    <div class="h-full flex items-start">
                        <PaperAirplaneIcon @click="onSendMessage" class="h-6 w-6 text-blue-500" />
                    </div>
                </div>        
            </div>
        </div>
    </span>
</template>
<script setup lang="ts">
import { ChevronUpIcon, EnvelopeIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
import { ref, onBeforeUnmount } from 'vue';
import DirectMessagingContentComponent from '../userboard_components/DirectMessagingContentComponent.vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline';
import { db } from '@/firebase/main';
import { useMainStore } from '@/stores/main';
import type { Message } from '@/types';
import { onSnapshot, query, collection, orderBy, Timestamp } from 'firebase/firestore';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
const DMS_COLLECTION = import.meta.env.VITE_DMS_COLLECTION as string;
const MESSAGES_COLLECTION = import.meta.env.VITE_MESSAGES_COLLECTION as string;
const { user, profile } = storeToRefs(useMainStore());
const { messaging } = storeToRefs(useModalStore());
const open = ref(false);
const onOpen = (value:boolean) => {
    open.value = value;
}
const onOpenDm = (value:boolean) => {
    messaging.value.show = value;
    messaging.value.to = null;
}
const onViewDm = async (dmId:string) => {
    console.log('onViewDm', dmId);
    messaging.value.show = true;
    messaging.value.to = {
        id: dmId,
        name: 'No one',
    }
    await loadMessages(dmId);
}
const directMessage = ref('');
const messages = ref([]);
const isLoadingMessages = ref(false);
let stopSubscription:any;
const loadMessages = async (dmId:string) => {
    stopSubscription = onSnapshot(query(collection(db, `${DMS_COLLECTION}/${dmId}/${MESSAGES_COLLECTION}`), orderBy('createdAt','asc')), (snapshot) => {
        isLoadingMessages.value = true;
        messages.value = snapshot.docs.map((doc) => {
            return {
                ...doc.data()
            } as Message;
        })
        isLoadingMessages.value = false;
    });
}
const isSendingMessage = ref(false);
const onSendMessage = async () => {
    if(!directMessage.value) return;
    if(!user.value) return;
    if(!profile.value) return;
    if(user.value.uid == messaging.value.to?.id) return;
    isSendingMessage.value = true;
    await useMainStore().sendDm({
        text: directMessage.value,
        senderId: user.value.uid,
        receiverId: messaging.value.to?.id as string,
    });
    directMessage.value = '';
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
    return false;
}
onBeforeUnmount(()=>{
    if(stopSubscription) stopSubscription();
})
</script>