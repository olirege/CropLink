<template>
    <span class="grid grid-flow-row space-y-4" v-if="contracts.docs && contracts.docs.length > 0 && !isLoadingContracts" >
       <ContractCard v-for="(contract,index) in contracts.docs" :key="index" :contract="contract" />
    </span>
    <div v-else-if="contracts.docs && contracts.docs.length == 0 && !isLoadingContracts">
        <p>No contracts yet</p>
    </div>
    <span v-else>
        <LoadingSpinner :isLoading ="isLoadingContracts"/>
    </span>
</template>
<script setup lang="ts">
import type { Contract } from '@/types';
import ContractCard from '../cards/ContractCard.vue';
import { type Ref, ref, onMounted, onBeforeUnmount } from 'vue';
import { getPaginatedCollectionGroupWhere } from '@/firebase/utils';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, collectionGroup, query, where, orderBy } from 'firebase/firestore';

const { user } = storeToRefs(useMainStore());
const contracts: Ref<{lastVisible:Contract[], docs:Contract[]}> = ref([]);
const isLoadingContracts = ref(false);

const loadMoreContracts= async () => {
    isLoadingContracts.value = true;
    const sellerContracts = await getPaginatedCollectionGroupWhere('contracts', 'sellerId', '==', user.value.uid , ['createdAt','desc'], 10);
    const buyerContracts = await getPaginatedCollectionGroupWhere('contracts', 'buyerId', '==', user.value.uid , ['createdAt','desc'], 10);
    contracts.value.docs = [...sellerContracts.docs as Contract[], ...buyerContracts.docs as Contract[]];
    contracts.value.lastVisible = [sellerContracts.lastVisible as Contract, buyerContracts.lastVisible as Contract];
    isLoadingContracts.value = false;
}

let stopSubscriptionSeller = null;
let stopSubscriptionBuyer = null;
let buyerContracts = [];
let sellerContracts = [];

const loadContracts= async () => {
    stopSubscriptionSeller = onSnapshot(query(collectionGroup(db, 'contracts'), where('sellerId', '==', user.value.uid), orderBy('createdAt', 'desc')), (snapshot) => {
        isLoadingContracts.value = true;
        sellerContracts = snapshot.docs.map((doc) => ({...doc.data()}));
        updateContracts(); // Update combined contracts
        isLoadingContracts.value = false;
    });
    stopSubscriptionBuyer = onSnapshot(query(collectionGroup(db, 'contracts'), where('buyerId', '==', user.value.uid), orderBy('createdAt', 'desc')), (snapshot) => {
        isLoadingContracts.value = true;
        buyerContracts = snapshot.docs.map((doc) => ({...doc.data()}));
        updateContracts(); // Update combined contracts
        isLoadingContracts.value = false;
    });
};

const updateContracts = () => {
    contracts.value.docs = [...buyerContracts, ...sellerContracts];
};

const unsubscribe = () => {
    if (stopSubscriptionSeller) stopSubscriptionSeller();
    if (stopSubscriptionBuyer) stopSubscriptionBuyer();
};

onMounted(async ()=>{
    await loadContracts();
})
onBeforeUnmount(()=>{
    unsubscribe();
})

</script>