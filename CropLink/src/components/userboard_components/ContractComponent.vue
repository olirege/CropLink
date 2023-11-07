<template>
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
                                <p class="text-xs underline" @click="$emit('onMentionClause',clause)" v-if="!clause.draft">Mention</p>
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
                                <a class="text-xs underline" @click="$emit('onMentionClause',clause)">Mention</a>
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
                <div>
                    <p class="text-xs" v-if="contract.ready?.includes(contract.sellerId)">{{ contract.sellerId.substring(0,5) }} is ready</p>
                    <p class="text-xs" v-if="contract.ready?.includes(contract.buyerId)">{{ contract.buyerId.substring(0,5) }} is ready</p>
                </div>
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
            <button
                @click="onProceed"
                v-if="contract.ready?.includes(contract.sellerId) && contract.ready?.includes(contract.buyerId)"
                class="bg-yellow-500 text-white px-4 h-8 rounded-md hover:bg-yellow-400 transition duration-300 ease-in-out"
                >Proceed
            </button>
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
</template>
<script setup lang="ts">
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, query, orderBy, collection, where, setDoc, doc, deleteDoc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Contract, Clause } from '@/types';
import { convertTimestampToDate, isFirestoreTimestamp } from '@/firebase/utils';
import router from '@/router';
const emits = defineEmits(['onMentionClause']);
const props = defineProps({
    adId: {
        type: String,
        required: true,
    },
})
const CONTRACTS_COLLECTION = import.meta.env.VITE_CONTRACTS_COLLECTION as string;
const CLAUSES_COLLECTION = import.meta.env.VITE_CLAUSES_COLLECTION as string;
const { user, profile } = storeToRefs(useMainStore());
const isLoadingContract = ref(false);
const isLoadingClauses = ref(false);
const contract = ref({} as Contract);
const userClauses = ref([] as Clause[]);
const otherClauses = ref([] as Clause[]);
const clauseMentionned = ref({} as Clause);
const CLAUSE_STATUSES = useMainStore().CLAUSE_STATUSES;
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
const onProceed = () => {
    if(!props.adId) return
    router.push({name:'banking',params:{adId:props.adId}})
}
onMounted(async () => {
    stopContractSubscription = onSnapshot(query(collection(db, CONTRACTS_COLLECTION),where('adId','==', props.adId), orderBy('createdAt','asc')), (snapshot) => {
        isLoadingContract.value = true;
        console.log("contract changed")
        contract.value = snapshot.docs[0].data() as Contract;
        isLoadingContract.value = false;
    })
})
onBeforeUnmount(()=>{
    if(stopContractSubscription) stopContractSubscription();
    if(stopUserClauses) stopUserClauses();
    if(stopOtherClauses) stopOtherClauses();
    stopContractWatch();
})
</script>