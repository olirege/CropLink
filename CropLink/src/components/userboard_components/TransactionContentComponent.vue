<template>
    <div class="h-32 flex flex-row items-center divide-x border-y px-2 grid grid-cols-2 sm:grid-cols-4">
        <div class="p-2 hidden">
            <span class="text-sm font-medium text-slate-300">Pending</span>
            <p class="text-2xl truncate font-bold text-slate-500">{{ numberOfPending }}</p> 
        </div>
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Total Pending</span>
            <p class="text-2xl truncate font-bold text-slate-500" v-currency="totalPending"/>
        </div>
        <div class="p-2 hidden">
            <span class="text-sm font-medium text-slate-300">Completed</span>
            <p class="text-2xl truncate font-bold text-slate-500">{{ numberOfCompleted }}</p>
        </div>
        <div class="p-2">
            <span class="text-sm font-medium text-slate-300">Total Completed</span>
            <p class="text-2xl truncate font-bold text-slate-500" v-currency="totalCompleted"/>
        </div>
    </div>
    <div class="sm:p-4">
        <table  v-if="transactions.docs && transactions.docs.length > 0 && !isLoadingTransactions" class="table-fixed w-full border-collapse">
            <thead class="border-b">
                <tr class="text-left">
                    <th class="p-2 sm:pb-4 hidden sm:table-cell">ID</th>
                    <th class="p-2 sm:pb-4">Parties</th>
                    <th class="p-2 sm:pb-4">Status</th>
                    <th class="p-2 sm:pb-4 text-center sm:text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(transaction,index) in transactions.docs" :key="index" class="text-left">
                    <td class="py-2 hidden sm:table-cell">{{ transaction.transaction_id }}</td>
                    <td class="py-2 text-sm" v-if="transaction.parties && transaction.parties.length > 1">
                        <p class="truncate">{{ transaction.parties[0].customer }}</p>
                        <p class="truncate">{{ transaction.parties[1].customer }}</p>
                    </td>
                    <td class="py-2 sm:text-base text-xs">
                        <div class="flex flex-row gap-2 justify-between items-center w-3/4 sm:w-5/6"><p>Sent:</p><p :class="{'bg-red-500 rounded-full w-3 h-3': fetchTransactionStatus(transaction).payment_sent == false, 'bg-green-500 rounded-full w-3 h-3': fetchTransactionStatus(transaction).payment_sent == true}"></p></div>
                        <div class="flex flex-row gap-2 justify-between items-center w-3/4 sm:w-5/6"><p>Recieved:</p><p :class="{'bg-red-500 rounded-full w-3 h-3': fetchTransactionStatus(transaction).payment_received == false, 'bg-green-500 rounded-full w-3 h-3': fetchTransactionStatus(transaction).payment_received == true}"></p></div>
                        <div class="flex flex-row gap-2 justify-between items-center w-3/4 sm:w-5/6"><p>Disbursed:</p><p :class="{'bg-red-500 rounded-full w-3 h-3': fetchTransactionStatus(transaction).disbursed_to_beneficiary == false, 'bg-green-500 rounded-full w-3 h-3': fetchTransactionStatus(transaction).disbursed_to_beneficiary == true}"></p></div>
                    </td>
                    <td class="py-2 w-5 text-center sm:text-left">
                        <button class="text-cyan-600 font-bold italic" @click="onViewTransaction(transaction.adId, transaction.contractId)">View</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-else-if="transactions.docs && transactions.docs.length == 0 && !isLoadingTransactions" class="h-96 p-2 flex items-center justify-center">
            <p class="italic">No transactions yet</p>
        </div>
        <span v-else>
            <LoadingSpinner :isLoading ="isLoadingTransactions"/>
        </span>
    </div>
</template>
<script setup lang="ts">
import type { Transaction } from '@/types';
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
const transactions: Ref<{lastVisible:Transaction[], docs:Transaction[]}> = ref([]);
const isLoadingTransactions = ref(false);
let buyerTransactions = [];
let sellerTransactions = [];
const updateTransactions = () => {
    transactions.value.docs = [...buyerTransactions, ...sellerTransactions];
};
const { subscribe: sellerSub, unsubscribe:sellerUnsub } = useQuerySubscription(
    import.meta.env.VITE_TRANSACTIONS_COLLECTION,
    [
        ['sellerId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        sellerTransactions = data as Transaction[];
        updateTransactions(); // Update combined transactions
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading transactions, please try again later.'       
    },
    isLoadingTransactions,
)
const { subscribe:buyerSub, unsubscribe:buyerUnsub } = useQuerySubscription(
    import.meta.env.VITE_TRANSACTIONS_COLLECTION,
    [
        ['buyerId', '==', user.value.uid]
    ],
    ['createdAt', 'desc'],
    (data) => {
        buyerTransactions = data as Transaction[];
        updateTransactions(); // Update combined transactions
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading transactions, please try again later.'       
    },
    isLoadingTransactions,
)
onMounted(async ()=>{
    sellerSub();
    buyerSub();
})
onBeforeUnmount(()=>{
    sellerUnsub();
    buyerUnsub();
})
const fetchTransactionStatus = (transaction:Transaction) => {
    const items = transaction.items;
    if (!items || items.length === 0) {
        return false;
    }
    const schedule = items[0].schedule;
    if (!schedule || schedule.length === 0) {
        return false;
    }
    const status = schedule[0].status;
    if (!status) {
        return false;
    }
    return status
}
const numberOfPending = computed(() => {
    if(!transactions.value.docs || transactions.value.docs.length === 0) {
        return 0;
    }
    return transactions.value.docs.filter((transaction) => {
        const items = transaction.items;
        if (!items || items.length === 0) {
            return false;
        }
        const schedule = items[0].schedule;
        if (!schedule || schedule.length === 0) {
            return false;
        }
        const status = schedule[0].status;
        if (!status) {
            return false;
        }
        return status.payment_sent === false;
    }).length;
})
const numberOfCompleted = computed(() => {
    if(!transactions.value.docs || transactions.value.docs.length === 0) {
        return 0;
    }
    return transactions.value.docs.filter(
        (transaction) => {
        const items = transaction.items;
        if (!items || items.length === 0) {
            return false;
        }
        const schedule = items[0].schedule;
        if (!schedule || schedule.length === 0) {
            return false;
        }
        const status = schedule[0].status;
        if (!status) {
            return false;
        }
        return status.disbursed_to_beneficiary == true
        }).length;
})
const totalCompleted = computed(() => {
    if(!transactions.value.docs || transactions.value.docs.length === 0) {
        return 0;
    }
    const completed = transactions.value.docs.filter((transaction) => {
        const items = transaction.items;
        if (!items || items.length === 0) {
            return false;
        }
        const schedule = items[0].schedule;
        if (!schedule || schedule.length === 0) {
            return false;
        }
        const status = schedule[0].status;
        if (!status) {
            return false;
        }
       return  status.disbursed_to_beneficiary == true
    });
    let total = 0;
    completed.forEach((transaction) => {
        total += parseInt(transaction.items[0].schedule[0].amount);
    })
    return total;
})
const totalPending = computed(() => {
    if(!transactions.value.docs || transactions.value.docs.length === 0) {
        return 0;
    }
    const pending = transactions.value.docs.filter((transaction) => {
       const items = transaction.items;
        if (!items || items.length === 0) {
            return false;
        }
        const schedule = items[0].schedule;
        if (!schedule || schedule.length === 0) {
            return false;
        }
        const status = schedule[0].status;
        if (!status) {
            return false;
        }
       return  status.payment_sent == false
    });
    let total = 0;
    pending.forEach((transaction) => {
        total += parseInt(transaction.items[0].schedule[0].amount);
    })
    return total;
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
const onViewTransaction = (adId: string, contractId:string) => {
    router.push({ name: 'banking', params: { adId, contractId } });
}
</script>