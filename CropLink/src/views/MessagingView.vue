<template>
    <div class="grid grid-cols-2 gap-x-4 p-2">
        <template v-if="chatRoom && !isLoadingChatRoom && user && profile">
            <div class="p-4 w-full mx-auto bg-white rounded-lg shadow-md flex flex-col space-y-4">
                <h1 class="text-xl font-semibold border-b pb-2">Messaging</h1>
                <div v-if="messages.length > 0 && !isLoadingMessages" class="flex flex-col space-y-2 overflow-y-auto max-h-96">
                    <span v-for="(message,index) in messages" class="break-words">
                        <div class="flex justify-between mb-2" v-if="showIfPreviousMessageIsDifferent(index)">
                            <p class="text-sm font-medium">{{ message.senderId.substring(0,5) }} says:</p>
                            <p class="text-sm font-medium">{{ fromNow(message.createdAt) }}</p>
                        </div>
                        <div :class="[message.senderId != user.uid ? 'justify-end' : 'justify-start', 'flex']">
                            <p :class="[message.senderId === user.uid ? 'bg-blue-500 text-white' : 'bg-gray-100', 'rounded-md p-2 max-w-xs md:max-w-md']">
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
                <span class="flex items-end space-x-2">
                    <textarea v-model="message.text" class="w-full p-2 border rounded-md resize-none focus:border-blue-500 focus:ring-0" placeholder="Type your message here..." rows="1"></textarea>
                    <button @click="onSendMessage" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out">Send</button>
                </span>
            </div>
        </template>
        <template v-else-if="isLoadingChatRoom">
            <div>
                <LoadingSpinner :isLoading="isLoadingChatRoom"/>
            </div>
        </template>
        <template v-else>
            <div class="flex justify-center items-center h-32">
                <p class="text-gray-500">No chatroom found</p>
            </div>
        </template>
        <div class="p-4 w-full mx-auto bg-white rounded-lg shadow-md flex flex-col space-y-4" v-if="!isLoadingContract">
            <h1 class="text-xl font-semibold border-b pb-2">Contract Draft</h1>
            <div>
                <p>Last Updated: {{ isFirestoreTimestamp(contract.updatedAt) ? convertTimestampToDate(contract.updatedAt) : contract.updatedAt }}</p>
            </div>
            <button @click="onAddClauseDraft" class="w-full border-dashed border-2 border-sky-500 rounded-sm p-1">Add Clause</button>
            <div v-if="contractClauses && contractClauses.length > 0 && !isLoadingClauses">
                <span v-if="sellerContractClauses && sellerContractClauses.length > 0">
                    <label>Seller clauses</label>
                    <div v-for="clause in sellerContractClauses" class="relative break-words">
                        <template v-if="contract.sellerId == user.uid">
                            <textarea class="w-full p-2 border rounded-md resize-none focus:border-blue-500 focus:ring-0" :class="[!clause.draft ? 'bg-gray-200' : '']" :disabled="!clause.draft" v-model="clause.text"></textarea>
                            <div class="flex space-x-1 absolute top-1 right-1">
                                <XCircleIcon class="h-5 w-5 text-red-400" @click="onRemoveClause(clause.id)" />
                                <CheckCircleIcon class="h-5 w-5 text-green-400" @click="onConfirmClauseDraft(clause.id)" v-if="clause.draft"/>
                                <PencilSquareIcon class="h-5 w-5 text-blue-400" v-else @click="onEditClause(clause.id)"/>
                            </div>
                        </template>
                        <template v-else>
                            <p class="w-full p-2 border rounded-md " :class="[!clause.draft ? 'bg-gray-200' : '']"></p>
                        </template>
                    </div>
                </span>
                <span v-if="buyerContractClauses && buyerContractClauses.length > 0">
                    <label>Buyer clauses</label>
                    <div v-for="clause in buyerContractClauses" class="relative break-words">
                        <template v-if="contract.sellerId == user.uid">
                            <textarea class="w-full p-2 border rounded-md resize-none focus:border-blue-500 focus:ring-0" :class="[!clause.draft ? 'bg-gray-200' : '']" :disabled="!clause.draft" v-model="clause.text"></textarea>
                            <div class="flex space-x-1 absolute top-1 right-1">
                                <XCircleIcon class="h-5 w-5 text-red-400" @click="onRemoveClause(clause.id)" />
                                <CheckCircleIcon class="h-5 w-5 text-green-400" @click="onConfirmClauseDraft(clause.id)" v-if="clause.draft"/>
                                <PencilSquareIcon class="h-5 w-5 text-blue-400" v-else @click="onEditClause(clause.id)"/>
                            </div>
                        </template>
                        <template v-else>
                            <p class="w-full p-2 border rounded-md " :class="[!clause.draft ? 'bg-gray-200' : '']"></p>
                        </template>
                    </div>
                </span>
            </div>
            <div v-else-if="contractClauses && contractClauses.length == 0 && !isLoadingClauses">
                <p>No clauses yet</p>
            </div>
            <div v-else>
                <LoadingSpinner :isLoading="isLoadingClauses"/>
            </div>
        </div>
        <div v-else-if="!contract && !isLoadingContract">
            <p>No Contract Found</p>
        </div>
        <div v-else>
            <LoadingSpinner :isLoading="isLoadingClauses"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, query, orderBy, collection, addDoc, Timestamp, where, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { getDocsFromCollectionWhere } from '@/firebase/utils';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import type { ChatRoom, Message, Contract, Clause } from '@/types';
import { convertTimestampToDate, isFirestoreTimestamp } from '@/firebase/utils';
const CHATROOMS_COLLECTION = import.meta.env.VITE_CHATROOMS_COLLECTION as string;
const MESSAGES_COLLECTION = import.meta.env.VITE_MESSAGES_COLLECTION as string;
const CONTRACTS_COLLECTION = import.meta.env.VITE_CONTRACTS_COLLECTION as string;
const CLAUSES_COLLECTION = import.meta.env.VITE_CLAUSES_COLLECTION as string;
const props = defineProps({
    adId: {
        type: String,
        required: false
    },
})
const { user, profile } = storeToRefs(useMainStore());
const isLoadingChatRoom = ref(false);
const isLoadingMessages = ref(false);
const isLoadingContract = ref(false);
const isLoadingClauses = ref(false);
const chatRoom = ref({} as ChatRoom);
const contract = ref({} as Contract);
const contractClauses = ref([] as Clause[]);
const message = ref({} as Message);
const messages = ref([] as Message[])
const CLAUSE_STATUSES = useMainStore().CLAUSE_STATUSES;
let stopChatRoomMessagesSubscription:any;
let stopContractSubscription:any;
let stopContractClauseSubscription:any;
const loadChatroom = async () => {
    // fetch chatroom with adid as adid
    isLoadingChatRoom.value = true;
    const chatroomDocs = await getDocsFromCollectionWhere(CHATROOMS_COLLECTION, 'adId', '==', props.adId);
    const chatroom = chatroomDocs[0];
    if(!chatroom) return;
    chatRoom.value = {
        ...chatroom
    } as ChatRoom;
    isLoadingChatRoom.value = false;
    // subscribe to chatroom messages
    stopChatRoomMessagesSubscription = onSnapshot(query(collection(db, `${CHATROOMS_COLLECTION}/${chatroom.id}/${MESSAGES_COLLECTION}`), orderBy('createdAt','asc')), (snapshot) => {
        isLoadingMessages.value = true;
        messages.value = snapshot.docs.map((doc) => {
            return {
                ...doc.data()
            } as Message;
        })
        isLoadingMessages.value = false;
    })
    stopContractSubscription = onSnapshot(query(collection(db, CONTRACTS_COLLECTION),where('adId','==', props.adId), orderBy('createdAt','asc')), (snapshot) => {
        isLoadingContract.value = true;
        console.log("contract changed")
        contract.value = snapshot.docs[0].data() as Contract;
        isLoadingContract.value = false;
    })
    stopContractClauseSubscription = onSnapshot(query(collection(db, `${CONTRACTS_COLLECTION}/${props.adId}/${CLAUSES_COLLECTION}`), orderBy('createdAt','asc')), (snapshot) => {
        isLoadingClauses.value = true;
        console.log("clauses changed")
        contractClauses.value = snapshot.docs.map((doc) => {
            return {
                ...doc.data()
            } as Clause;
        });
        isLoadingClauses.value = false;
    })
}
onMounted(async () => {
    await loadChatroom();
})
onBeforeUnmount(()=>{
    if(stopChatRoomMessagesSubscription) stopChatRoomMessagesSubscription();
    if(stopContractSubscription) stopContractSubscription();
    if(stopContractClauseSubscription) stopContractClauseSubscription();
})
const isSendingMessage = ref(false);
const onSendMessage = async () => {
    isSendingMessage.value = true
    if(!chatRoom.value) return;
    if(!message.value.text) return;
    if(!user.value) return;
    if(!profile.value) return;
    const messageRef = collection(db, CHATROOMS_COLLECTION, chatRoom.value.id, MESSAGES_COLLECTION);
    message.value.createdAt = new Date();
    message.value.senderId = user.value.uid;
    await addDoc(messageRef, message.value);
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

const onAddClauseDraft = async () => {
    const contractRef = collection(db, `${CONTRACTS_COLLECTION}/${contract.value.id}/${CLAUSES_COLLECTION}`);
    const clause = {
        id: Math.random().toString(36).substring(7),
        text: '',
        draft: true,
        state: CLAUSE_STATUSES.PENDING,
        authorId: user.value.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    console.log("onAddClauseDraft", contractRef, contract.value.id)
    await addDoc(contractRef,clause)
}
const onRemoveClause = async (id:string) => {
    const contractRef = collection(db, `${CONTRACTS_COLLECTION}/${props.adId}/${CLAUSES_COLLECTION}`);
    await deleteDoc(doc(contractRef, contract.value.id));
}
const onEditClause = async (id:string) => {
    console.log("onEditClause", id)
    const contractRef = collection(db, `${CONTRACTS_COLLECTION}/${props.adId}/${CLAUSES_COLLECTION}`);
    await setDoc(doc(contractRef, contract.value.id), {draft:true}, {merge:true})
}
const onConfirmClauseDraft = async (id:string) => {
    console.log("onEditClause", id)
    const contractRef = collection(db, `${CONTRACTS_COLLECTION}/${props.adId}/${CLAUSES_COLLECTION}`);
    await setDoc(doc(contractRef, contract.value.id), {draft:false}, {merge:true})
}
const sellerContractClauses = computed(() => {
    if(!contractClauses.value) return [];
    if(contract.value.sellerId !== user.value.uid) return contractClauses.value.filter((clause) => (clause.authorId === contract.value.sellerId) && !clause.draft); 
    else contractClauses.value.filter((clause) => clause.authorId === contract.value.sellerId);
})
const buyerContractClauses = computed(() => {
    if(!contractClauses.value) return [];
    if(contract.value.buyerId !== user.value.uid) return contractClauses.value.filter((clause) => (clause.authorId === contract.value.buyerId) && !clause.draft); 
    else contractClauses.value.filter((clause) => clause.authorId === contract.value.buyerId);
})
</script>