<template>
    <div class="h-32 flex flex-row items-center divide-x border-y px-2 grid grid-cols-3">
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Pending</span>
            <p class="text-4xl font-bold text-slate-500">{{ numberOfPendingContracts }}</p> 
        </div>
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Accepted</span>
            <p class="text-4xl text-4xl font-bold text-slate-500">{{ numberOfAcceptedContracts }}</p>
        </div>
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Rejected</span>
            <p class="text-4xl text-4xl font-bold text-slate-500">{{ numberOfRejectedContracts }}</p>
        </div>
    </div>
    <div class="sm:p-4">
        <table  v-if="contracts.docs && contracts.docs.length > 0 && !isLoadingContracts" class="table-fixed w-full border-collapse">
            <thead class="border-b">
                <tr class="text-left">
                    <th class="p-2 sm:pb-4 hidden sm:table-cell">Contract ID</th>
                    <th class="p-2 sm:pb-4">User</th>
                    <th class="p-2 sm:pb-4 hidden sm:table-cell">Ad ID</th>
                    <th class="p-2 sm:pb-4">Status</th>
                    <th class="p-2 sm:pb-4">Updated</th>
                    <th class="p-2 sm:pb-4 hidden sm:table-cell">Created</th>
                    <th class="p-2 sm:pb-4">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(contract,index) in contracts.docs" :key="index">
                    <td class="py-2 hidden sm:table-cell">{{ contract.id.substring(0,5) }}</td>
                    <td class="py-2">
                        <div class="flex flex-row justify-start items-center">
                            <img :src="contract.userSignature.profilePic" class="w-8 h-8 rounded-full"/>
                            <p class="pl-2 truncate">{{ contract.userSignature.name }}</p>
                        </div>
                    </td>
                    <td class="py-2 hidden sm:table-cell"> {{ contract.adId.substring(0,5) }}</td>
                    <td class="py-2">
                        <span class="flex flex-row sm:w-3/4 gap-1 sm:gap-2 items-center justify-start px-1">
                            <span 
                            class="w-3 h-3 rounded-full"
                            :class="{
                                'bg-green-500': contract.status == 'accepted',
                                'bg-red-500': contract.status == 'rejected',
                                'bg-yellow-500': contract.status == 'pending',
                            }"
                            />
                            <p class="italic capitalize">
                                {{ contract.status }}
                            </p>
                        </span>
                    </td>
                    <td class="py-2">{{ fromNow(contract.updatedAt) }}</td>
                    <td class="py-2 hidden sm:table-cell">{{ fromNow(contract.createdAt) }}</td>
                    <td class="py-2 w-5">
                        <button class="text-cyan-600 font-bold italic" @click="onViewContract(contract.adId)">View</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-else-if="contracts.docs && contracts.docs.length == 0 && !isLoadingContracts" class="h-96 p-2 flex items-center justify-center">
            <p class="italic">No contracts yet</p>
        </div>
        <span v-else>
            <LoadingSpinner :isLoading ="isLoadingContracts"/>
        </span>
    </div>
</template>
<script setup lang="ts">
import type { Contract } from '@/types';
import { type Ref, ref, onMounted, onBeforeUnmount, computed } from 'vue';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { useQuerySubscription } from '@/firebase/utils';
import { useModalStore } from '@/stores/modals';
import { useRouter } from 'vue-router';
import { Timestamp } from 'firebase/firestore';
const router = useRouter();
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const { notifications } = storeToRefs(useModalStore());
const { user } = storeToRefs(useMainStore());
const contracts: Ref<{lastVisible:Contract[], docs:Contract[]}> = ref([]);
const isLoadingContracts = ref(false);
let buyerContracts = [];
let sellerContracts = [];
const updateContracts = () => {
    contracts.value.docs = [...buyerContracts, ...sellerContracts];
};
const { subscribe: sellerSub, unsubscribe:sellerUnsub } = useQuerySubscription(
    import.meta.env.VITE_CONTRACTS_COLLECTION,
    [
        ['sellerId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        sellerContracts = data as Contract[];
        updateContracts(); // Update combined contracts
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading contracts, please try again later.'       
    },
    isLoadingContracts,
)
const { subscribe:buyerSub, unsubscribe:buyerUnsub } = useQuerySubscription(
    import.meta.env.VITE_CONTRACTS_COLLECTION,
    [
        ['buyerId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        buyerContracts = data as Contract[];
        updateContracts(); // Update combined contracts
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading contracts, please try again later.'       
    },
    isLoadingContracts,
)
onMounted(async ()=>{
    sellerSub();
    buyerSub();
})
onBeforeUnmount(()=>{
    sellerUnsub();
    buyerUnsub();
})
const numberOfPendingContracts = computed(() => {
    if(!contracts.value.docs || contracts.value.docs.length === 0) {
        return 0;
    }
    return contracts.value.docs.filter((contract) => contract.status == 'pending').length;
})
const numberOfAcceptedContracts = computed(() => {
    if(!contracts.value.docs || contracts.value.docs.length === 0) {
        return 0;
    }
    return contracts.value.docs.filter((contract) => contract.status == 'accepted').length;
})
const numberOfRejectedContracts = computed(() => {
    if(!contracts.value.docs || contracts.value.docs.length === 0) {
        return 0;
    }
    return contracts.value.docs.filter((contract) => contract.status == 'rejected').length;
})
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
const onViewContract = (adId: string) => {
    router.push({ name: 'messaging', params: { adId } });
}
</script>