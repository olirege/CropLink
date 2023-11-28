<template>
    <template v-if="!open">
        <div class="w-56 rounded rounded-t-md fixed bottom-0 right-4 h-10 bg-white z-10 border-x-2 border-t-2 flex justify-center items-center" @click="onOpen(true)">
            <div class="flex justify-between items-center flex-row gap-4">
                <span class="flex justify-center items-center flex-row gap-4">
                    <EnvelopeIcon class="h-6 w-6" />
                    <h1 class="text-lg font-bold">Messaging</h1>
                </span>
                <ChevronUpIcon class="h-6 w-6" />
            </div>
        </div>
    </template>
    <template v-if="open">
        <div class="w-80 h-96 fixed bottom-0 right-1 bg-white z-10 border-4 rounded-t-md shadow-md">
            <div class="p-4 w-full mx-auto rounded-lg flex flex-col space-y-4">
                <div class="flex justify-between items-center flex-row gap-4 border-b pb-2" @click="onOpen(false)">
                    <h1 class="text-xl font-semibold">Messaging</h1>
                    <ChevronDownIcon class="h-6 w-6"/>
                </div>
                <template v-if="dms && dms.length > 0 && !isLoadingDms" >
                    <div class="flex flex-col overflow-y-auto w-full flex-1 max-h-72">
                        <DirectMessageCard v-for="(dm,index) in dms" :key="index" :dm="dm" @click="onViewDm(dm, true)"/>
                    </div>
                </template>
                <template v-else-if="dms && dms.length == 0 && !isLoadingDms">
                    <p>No direct messages yet</p>
                </template>
                <template v-else>
                        <LoadingSpinner :isLoading ="isLoadingDms"/>
                </template>
            </div>
        </div>
    </template>
    <template v-if="openDm">
        <div class="w-96 h-5/6 fixed bottom-0 right-1 bg-white z-10 border-4 rounded-t-md shadow-md">
            <div class="flex flex-col h-full p-4 w-full mx-auto rounded-lg space-y-4">
                <div class="flex justify-between items-center flex-row gap-4 border-b pb-2" @click="onViewDm('',false)">
                    <h1 class="text-xl font-semibold">Send a Message</h1>
                    <ChevronRightIcon class="h-6 w-6"/>
                </div>
                <div class="flex-grow overflow-y-auto">
                    <div v-if="messages.length > 0 && !isLoadingMessages" class="flex flex-col space-y-2 h-full">
                        <span v-for="(message,index) in messages" class="break-words">
                            <div class="flex justify-between mb-2" v-if="showIfPreviousMessageIsDifferent(index)">
                                <p class="text-sm font-medium" v-if="message.context && message.context.__key != 'invitation'">{{ message.senderId.substring(0,5) }} says:</p>
                                <p v-else-if="message.context && message.context.__key == 'invitation'" class="text-sm font-medium">{{ message.senderId.substring(0,5) }} sends an invitation:</p>
                                <p class="text-sm font-medium">{{ fromNow(message.createdAt) }}</p>
                            </div>
                            <template v-if="message.context && message.context.__key == 'application'">
                                <div v-if="message.context.details" class="grid grid-cols-1">
                                    <JobThumbnailCard :job="message.context.details" v-if="message.context.application.parentType == 'job'"/>
                                    <GigThumbnailCard :gig="message.context.details" v-if="message.context.application.parentType == 'gig'"/>
                                </div>
                            </template>
                            <template v-if="message.context && message.context.__key == 'invitation'">
                                <div class="relative w-full truncate bg-gray-100 rounded-md p-2 max-w-xs md:max-w-md text-xs rounded-md p-1 bg-slate-200">
                                    <p class="text-sm font-medium italic">You have been invited to chat</p>
                                    <p class="ml-2 text-sm font-medium"><span  @click="goToInvite(message.context.invitation)" class="font-bold underline cursor-pointer">Click here</span> to view the invitation</p>
                                </div>
                            </template>
                            <div :class="[message.senderId != user.uid ? 'justify-end' : 'justify-start', 'flex']" v-if="message.text">
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
                <div class="flex flex-col gap-2 w-full">
                    <span class="flex flex-row gap-2">
                        <div class="border rounded-md w-11/12 p-2">
                            <div v-if="Object.keys(directMessageContext).length > 0" class="relative w-full">
                                <XCircleIcon class="h-4 w-4 absolute top-1 right-1" @click="()=> directMessageContext = {}"/>
                                <template v-if="directMessageContext.__key == 'application'">
                                    <div v-if="isLoadingContextDetails">
                                        <LoadingSpinner :isLoading="isLoadingContextDetails"/>
                                    </div>
                                    <div v-if="!isLoadingContextDetails && contextDetails" class="grid grid-cols-1">
                                        <JobThumbnailCard :job="contextDetails" v-if="directMessageContext.application.parentType == 'job'"/>
                                        <GigThumbnailCard :gig="contextDetails" v-if="directMessageContext.application.parentType == 'gig'"/>
                                    </div>
                                </template>
                            </div>
                            <textarea v-model="directMessage" class="w-full resize-none focus:outline-none" placeholder="Type your message here..."></textarea>
                        </div>
                        <div class="h-full flex items-start w-6">
                            <PaperAirplaneIcon @click="onSendMessage" class="h-6 w-6 text-blue-500" />
                        </div>
                    </span>
                </div>        
            </div>
        </div>
    </template>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useQuerySubscription, useCollectionQuerySubscription, useFirebaseFunctionCall, queryForCollectionGroupDocumentById } from '@/firebase/utils';
import { ChevronUpIcon, EnvelopeIcon, ChevronDownIcon, PaperAirplaneIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import JobThumbnailCard from '../cards/JobThumbnailCard.vue';
import GigThumbnailCard from '../cards/GigThumbnailCard.vue';
import { XCircleIcon } from '@heroicons/vue/20/solid';
import { useMainStore } from '@/stores/main';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { Timestamp } from 'firebase/firestore';
import DirectMessageCard from '../cards/DirectMessageCard.vue';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { db } from '@/firebase/main';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
const { user } = storeToRefs(useMainStore());
const { notifications, messaging } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES  = useModalStore().NOTIFICATION_TYPES;
const isLoadingDms = ref(false);
const dms = ref([]);
const MESSAGES_COLLECTION = import.meta.env.VITE_MESSAGES_COLLECTION;
const DMS_COLLECTION = import.meta.env.VITE_DMS_COLLECTION;
const { subscribe: subscribeToConversations, unsubscribe: unsubscribeToConversations } = useQuerySubscription(
    DMS_COLLECTION,
    [[
        'participants',
        'array-contains',
        user.value.uid
    ]],
    [
        ['createdAt', 'desc']
    ],
    (data) => {
        dms.value = data;
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading conversations, please try again later.';
    },
    isLoadingDms,
);
const open = ref(false);
const onOpen = (value:boolean) => {
    open.value = value;
}
const openDm = ref(false);
const dm = ref(null);
const messages = ref([]);
const isLoadingMessages = ref(false);
let unsubscribeToMessages:any;
const directMessage = ref('');
const directMessageContext = ref({});
watch(dm, (value) => {
    if(value && value.dmId) {
        console.log('subscribing to messages')
        const { subscribe: subscribeToMessages, unsubscribe } = useCollectionQuerySubscription(
            `${DMS_COLLECTION}/${value.dmId}/${MESSAGES_COLLECTION}`,
            [],
            ['createdAt', 'asc'],
            (data) => {
                if(data.length === 0) {
                    isInitialMessage.value = true;
                } else {
                    isInitialMessage.value = false;
                }
                messages.value = data ? data : [];
            },
            (error) => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.ERROR;
                notifications.value.message = 'Error loading messages, please try again later.';
            },
            isLoadingMessages,
        );
        unsubscribeToMessages = unsubscribe;
        subscribeToMessages();
    }
});
const isInitialMessage = ref(false);
watch(messaging, async (newVal, oldVal) => {
    console.log('messaging changed', newVal, oldVal);
    if(messages.value.length > 0) {
            messages.value = [];
    }
    if(newVal.show && newVal.to && newVal.to.id) {
        const key = [user.value.uid, newVal.to.id].sort().join('_');
        const { subscribe: subscribeToMessages, unsubscribe } = useQuerySubscription(
            `${DMS_COLLECTION}`,
            [
                [
                    'participantKey',
                    '==',
                    key
                ],
            ],
            [
                ['createdAt', 'desc']
            ],
            (data) => {
                console.log('data', data)
                onViewDm(data[0], true)
            },
            (error) => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.ERROR;
                notifications.value.message = 'Error loading conversations, please try again later.';
            },
            isLoadingDms,
        );
        if(newVal.context) {
            directMessageContext.value = newVal.context;
            if(newVal.context.__key === 'application') {
                let collection;
                if(newVal.context.application.parentType === 'job') {
                    collection = import.meta.env.VITE_JOBS_COLLECTION;
                }
                else if(newVal.context.application.parentType === 'gig') {
                    collection = import.meta.env.VITE_GIGS_COLLECTION;
                }
                contextDetails.value = await onFetchContextDetails(collection, newVal.context.application.parentId, `${newVal.context.application.parentType}Id`);
            }
        }
        unsubscribeToMessages = unsubscribe;
        subscribeToMessages();
    }
}, { deep: true });

const onViewDm = (pickedDm, value) => {
    openDm.value = value;
    dm.value = pickedDm;
    onOpen(!value);
}
watch(openDm, (value) => {
    if(!value) {
        if(messaging.value.show) {
            useModalStore().clearMessaging();
        }
        if(messages.value.length > 0) {
            messages.value = [];
        }
        if(unsubscribeToMessages) {
            unsubscribeToMessages();
        }
        if(directMessage.value.length > 0) {
            directMessage.value = '';
        }
        if(Object.keys(directMessageContext.value).length > 0) {
            directMessageContext.value = {};
        }
        if((Object.keys(contextDetails.value).length > 0)) {
            contextDetails.value = {};
        }
        if(isInitialMessage.value) {
            isInitialMessage.value = false;
        }
    }
});
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
const isSendingMessage = ref(false);
const onSendMessage = async () => {
    if(isInitialMessage.value) {
        console.log('sending initial message')
        if(!messaging.value.to.id) return;
        console.log('messaging', messaging.value)
        const data = {
            senderId: user.value.uid,
            text: directMessage.value,
            context: {...messaging.value.context, details: contextDetails.value},
            participants: [user.value.uid, messaging.value.to.id],
        }
        console.log('data', data)
        const { callFunction } = useFirebaseFunctionCall(
            'initiateDm',
            data,
            isSendingMessage,
            ()=>{console.log("Function call start");},
            (data) => {
                console.log('onData', data)
                dm.value = data;
            },
            ()=> {console.log("Function call end");},
            (error) => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.ERROR;
                notifications.value.message = 'Error sending message, please try again later.';
                }
        );
        await callFunction();
    } else {
        console.log('sending message')
        if(!dm.value) return;
        const messageRef = collection(db, DMS_COLLECTION, dm.value.dmId, MESSAGES_COLLECTION);
        await addDoc(messageRef, {
            text: directMessage.value,
            senderId: user.value.uid,
            createdAt: new Date(),
            context: directMessageContext.value? {...directMessageContext.value, details: contextDetails.value} : null,
        });
    }
    directMessage.value = '';
    directMessageContext.value = {};
    contextDetails.value = {};
}
const contextDetails = ref({});
const isLoadingContextDetails = ref(false);
const onFetchContextDetails = async (collection:string, id:string, idKey:string) => {
    console.log('onFetchContextDetails', collection, id, idKey)
    isLoadingContextDetails.value = true;
    const data = await queryForCollectionGroupDocumentById(collection, id, idKey);
    isLoadingContextDetails.value = false;
    console.log('onFetchContextDetails', data)
    return data ? data : {};
}
const router = useRouter();
const goToInvite = (invite: {adId: string}) => {
    if(!invite.adId) return;
    router.push({
        name: 'messaging',
        params: {
            adId: invite.adId,
        }
    })
} 
onMounted(() => {
    subscribeToConversations();
});
onBeforeUnmount(() => {
    unsubscribeToConversations();
});
</script>