<template>
    <div class="grid grid-cols-2 gap-x-4 p-2">
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
                <div v-else-if="messages.length == 0 && !isLoadingMessages" class="flex justify-center items-center h-32">
                    <p class="text-gray-500">No messages yet</p>
                </div>
                <div v-else-if="isLoadingMessages" class="flex justify-center items-center h-32">
                    <LoadingSpinner :isLoading="isLoadingMessages"/>
                </div>
                <span class="flex items-end space-x-2">
                    <div class="border rounded-md w-full p-2">
                        <div v-if="clauseMentionned.id" class="relative w-full truncate bg-gray-100 rounded-md p-2 max-w-xs md:max-w-md text-xs rounded-md p-1 bg-slate-200">
                            <XCircleIcon class="h-4 w-4 absolute top-1 right-1" @click="onRemoveMentionnedClause"/>
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
        <div class="p-4 w-full mx-auto bg-white rounded-lg shadow-md flex flex-col space-y-4" v-if="contract.id && !isLoadingContract">
            <h1 class="text-xl font-semibold border-b pb-2">Contract Draft</h1>
            <div>
                <p>Last Updated: {{ isFirestoreTimestamp(contract.updatedAt) ? convertTimestampToDate(contract.updatedAt) : contract.updatedAt }}</p>
            </div>
            <button @click="onAddClauseDraft" class="w-full border-dashed border-2 border-sky-500 rounded-sm p-1">Add Clause</button>
            <div v-if="!isLoadingClauses" class="flex flex-col space-y-4">
                <span>
                    <span v-if="userClauses && userClauses.length > 0">
                        <label class="text-lg font-semibold border-b pb-2">{{ profile && profile.name ? `${profile.name}'s ` : 'Your ' }}clauses</label>
                        <span class="flex flex-col space-y-2">
                            <div v-for="clause in userClauses" class="relative break-words">
                                <textarea class="w-full p-2 border rounded-md resize-none focus:border-blue-500 focus:ring-0" v-if="clause.draft" v-model="clause.text"></textarea>
                                <p class="w-full p-2 border rounded-md"
                                :class="{
                                    'bg-gray-200': clause.state == CLAUSE_STATUSES.PENDING,
                                    'bg-green-200': clause.state == CLAUSE_STATUSES.ACCEPTED,
                                    'bg-red-200': clause.state == CLAUSE_STATUSES.REJECTED,
                                }"
                                v-else>{{clause.text}}</p>
                                <div class="w-full flex justify-between" v-if="clause.state != CLAUSE_STATUSES.PENDING">
                                    <p class="text-xs underline" @click="onMentionClause(clause)" v-if="!clause.draft">Mention</p>
                                    <p :class="{
                                        'text-green-400 text-xs': clause.state == CLAUSE_STATUSES.ACCEPTED,
                                        'text-red-400 text-xs': clause.state == CLAUSE_STATUSES.REJECTED,
                                    }">{{ clause.state }}</p>
                                </div>
                                <div class="flex items-center space-x-1 absolute top-1 right-1">
                                    <CheckCircleIcon class="h-5 w-5 text-green-400" @click="onConfirmClauseDraft(clause)" v-if="clause.draft"/>
                                    <PencilSquareIcon class="h-5 w-5 text-blue-400" v-else @click="onEditDrafClause(clause.id)"/>
                                    <TrashIcon class="h-5 w-5" @click="onRemoveClause(clause.id)" />
                                </div>
                            </div>
                        </span>
                    </span>
                </span>
                <span>
                    <span v-if="otherClauses && otherClauses.length > 0">
                        <label class="text-lg font-semibold border-b pb-2">{{ user.name == contract.sellerId ? contract.sellerId.substring(0,5) : contract.buyerId.substring(0,5) }}'s clauses</label>
                        <span class="flex flex-col space-y-2">
                            <div v-for="clause in otherClauses" class="relative break-words">
                                <p class="w-full p-2 border rounded-md" :class="{
                                    'bg-gray-200': clause.state == CLAUSE_STATUSES.PENDING,
                                    'bg-green-200': clause.state == CLAUSE_STATUSES.ACCEPTED,
                                    'bg-red-200': clause.state == CLAUSE_STATUSES.REJECTED,
                                    }">{{clause.text}}</p>
                                <div class="w-full flex justify-between">
                                    <a class="text-xs underline" @click="onMentionClause(clause)">Mention</a>
                                    <div class="flex space-x-2">
                                        <a class="text-xs font-semibold text-green-400 underline decoration-green-400" @click="onEditStateClause(clause.id,CLAUSE_STATUSES.ACCEPTED)">Approve</a>
                                        <a class="text-xs font-semibold text-red-400 underline decoration-red-400" @click="onEditStateClause(clause.id,CLAUSE_STATUSES.REJECTED)">Reject</a>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </span>
                </span>
                <div class="w-full flex justify-between">
                    <p v-if="!contract.ready?.includes(contract.sellerId) || !contract.ready?.includes(contract.buyerId)">
                        <span v-if="contract.ready?.includes(contract.sellerId)">{{ contract.sellerId.substring(0,5) }} is ready</span>
                        <span v-if="contract.ready?.includes(contract.buyerId)">{{ contract.buyerId.substring(0,5) }} is ready</span>
                    </p>
                    <button
                        @click="onReadyToProceed"
                        v-if="!contract.ready.includes(user.uid)" 
                        class="bg-blue-500 text-white px-4 h-8 rounded-md hover:bg-blue-400 transition duration-300 ease-in-out"
                        >Ready to Proceed
                    </button>
                    <button
                        @click="onCancelReadyToProceed"
                        v-if="contract.ready.includes(user.uid)"
                        class="bg-red-500 text-white px-4 h-8 rounded-md hover:bg-red-400 transition duration-300 ease-in-out"
                        >Cancel
                    </button>
                </div>
            </div>
            <div v-else>
                <LoadingSpinner :isLoading="isLoadingClauses"/>
            </div>
        </div>
        <div v-else-if="!contract.id && !isLoadingContract">
            <p>No Contract Found</p>
        </div>
        <div v-else>
            <LoadingSpinner :isLoading="isLoadingClauses"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, query, orderBy, collection, addDoc, Timestamp, where, setDoc, doc, deleteDoc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';
import { getDocsFromCollectionWhere } from '@/firebase/utils';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid';
import { PencilSquareIcon, TrashIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline';
import type { ChatRoom, Message, Contract, Clause } from '@/types';
import { convertTimestampToDate, isFirestoreTimestamp } from '@/firebase/utils';
import router from '@/router';
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
const userClauses = ref([] as Clause[]);
const otherClauses = ref([] as Clause[]);
const message = ref({} as Message);
const clauseMentionned = ref({} as Clause);
const messages = ref([] as Message[])
const CLAUSE_STATUSES = useMainStore().CLAUSE_STATUSES;
let stopChatRoomMessagesSubscription:any;
let stopContractSubscription:any;
let stopUserClauses:any;
let stopOtherClauses:any;

const stopContractWatch = watch(contract,(newVal,oldVal) => {
    if(newVal.id) {
        stopUserClauses = onSnapshot(query(collection(db, `${CONTRACTS_COLLECTION}/${contract.value.id}/${CLAUSES_COLLECTION}`), where('authorId','==', user.value.uid), orderBy('createdAt','asc')), (snapshot) => {
        isLoadingClauses.value = true;
        console.log("user clauses changed")
        userClauses.value = snapshot.docs.map((doc) => {
            return {
                ...doc.data()
            } as Clause;
        });
        isLoadingClauses.value = false;
    })
        stopOtherClauses = onSnapshot(query(collection(db, `${CONTRACTS_COLLECTION}/${contract.value.id}/${CLAUSES_COLLECTION}`), where('authorId','!=', user.value.uid),where('draft','==', false)), (snapshot) => {
            isLoadingClauses.value = true;
            console.log("other clauses changed")
            otherClauses.value = snapshot.docs.map((doc) => {
                return {
                    ...doc.data()
                } as Clause;
            });
            isLoadingClauses.value = false;
        })
    }
})

const loadChatroom = async () => {
    // fetch chatroom with adid as adid
    isLoadingChatRoom.value = true;
    const chatroomDocs = await getDocsFromCollectionWhere(CHATROOMS_COLLECTION, 'adId', '==', props.adId);
    const chatroom = chatroomDocs[0];
    if(!chatroom) throw new Error("Chatroom not found");
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
    if(stopContractSubscription) stopContractSubscription();
    if(stopUserClauses) stopUserClauses();
    if(stopOtherClauses) stopOtherClauses();
    stopContractWatch();
})
const isSendingMessage = ref(false);
const onSendMessage = async () => {
    isSendingMessage.value = true
    if(!chatRoom.value) return;
    if(!message.value.text) return;
    if(!user.value) return;
    if(!profile.value) return;
    const messageRef = collection(db, CHATROOMS_COLLECTION, chatRoom.value.id, MESSAGES_COLLECTION);
    message.value.quote = clauseMentionned.value;
    message.value.createdAt = new Date();
    message.value.senderId = user.value.uid;
    await addDoc(messageRef, message.value);
    message.value.text = '';
    clauseMentionned.value = {} as Clause;
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

const onMentionClause = (clause:Clause) => {
    if(!clause || !clause.id || clause.draft) return;
    clauseMentionned.value = clause;
}
const onRemoveMentionnedClause = () => {
    clauseMentionned.value = {} as Clause;
}

const onAddClauseDraft = async () => {
    const clauseRef = collection(db, `${CONTRACTS_COLLECTION}/${contract.value.id}/${CLAUSES_COLLECTION}`);
    const clause = {
        id: Math.random().toString(36).substring(7),
        text: '',
        draft: true,
        state: CLAUSE_STATUSES.PENDING,
        authorId: user.value.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    console.log("onAddClauseDraft", clauseRef, clause.id)
    await setDoc(doc(clauseRef,clause.id), clause);
}
const onRemoveClause = async (id:string) => {
    console.log("onRemoveClause", id)
    if(!id || !contract.value.id) return;
    const clauseRef = collection(db, `${CONTRACTS_COLLECTION}/${contract.value.id}/${CLAUSES_COLLECTION}`);
    await deleteDoc(doc(clauseRef, id));
    if(clauseMentionned.value.id == id) clauseMentionned.value = {} as Clause;
}
const onEditDrafClause = async (id:string) => {
    console.log("onEditClause", id)
    if(!id || !contract.value.id) return;
    const clauseRef = collection(db, `${CONTRACTS_COLLECTION}/${contract.value.id}/${CLAUSES_COLLECTION}`);
    await setDoc(doc(clauseRef, id), {draft:true}, {merge:true})
    if(clauseMentionned.value.id == id) clauseMentionned.value = {} as Clause;
}
const onEditStateClause = async (id:string,state:string) => {
    console.log("onEditClause", id, state)
    if(!id || !contract.value.id) return;
    if(!Object.values(CLAUSE_STATUSES).includes(state)) return;
    const clauseRef = collection(db, `${CONTRACTS_COLLECTION}/${contract.value.id}/${CLAUSES_COLLECTION}`);
    await setDoc(doc(clauseRef, id), {state}, {merge:true})
    if(clauseMentionned.value.id == id) clauseMentionned.value = {} as Clause;
}
const onConfirmClauseDraft = async (clause:Clause) => {
    console.log("onEditClause", clause)
    if(!clause || !contract.value.id) return;
    clause.draft = false;
    const clauseRef = collection(db, `${CONTRACTS_COLLECTION}/${contract.value.id}/${CLAUSES_COLLECTION}`);
    await setDoc(doc(clauseRef, clause.id), clause, {merge:true})
}
const onReadyToProceed = async () => {
    console.log(contract.value)
    if(!contract.value.id || !user.value.uid) return
    if(contract.value && contract.value.ready && contract.value.ready.includes(user.value.uid)) return
    console.log("onReadyToProceed", contract.value.id, user.value.uid)
    const contractRef = collection(db, CONTRACTS_COLLECTION);
    await updateDoc(doc(contractRef,contract.value.id),{ready:arrayUnion(user.value.uid)})
}
const onCancelReadyToProceed = async () => {
    if(!contract.value.id || !user.value.uid) return
    if(contract.value && contract.value.ready && !contract.value.ready.includes(user.value.uid)) return
    console.log("onCancelReadyToProceed", contract.value.id, user.value.uid)
    const contractRef = collection(db, CONTRACTS_COLLECTION);
    await updateDoc(doc(contractRef,contract.value.id),{ready:arrayRemove(user.value.uid)})
}
</script>