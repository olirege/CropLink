<template>
    <span class="grid grid-flow-row space-y-4" v-if="contracts.docs && contracts.docs.length > 0 && !isLoadingContracts" >
       <ContractCard v-for="(contract,index) in contracts.docs" :key="index" :contract="contract" />
    </span>
    <div v-else-if="isLoadingContracts">
        <LoadingSpinner :isLoading ="isLoadingContracts"/>
    </div>
    <span v-else>
        <p>No contracts yet</p>
    </span>
</template>
<script setup lang="ts">
import type { Contract } from '@/types';
import ContractCard from '../cards/ContractCard.vue';
import { type Ref, ref, onMounted } from 'vue';
import { getPaginatedCollectionGroupWhere } from '@/firebase/utils';
import LoadingSpinner from '../props/LoadingSpinner.vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
const { user } = storeToRefs(useMainStore());
const contracts: Ref<{lastVisible:Contract[], docs:Contract[]}> = ref([]);
const isLoadingContracts = ref(false);

const loadContracts = async () => {
    isLoadingContracts.value = true;
    const sellerContracts = await getPaginatedCollectionGroupWhere('contracts', 'sellerId', '==', user.value.uid , ['createdAt','desc'], 10);
    const buyerContracts = await getPaginatedCollectionGroupWhere('contracts', 'buyerId', '==', user.value.uid , ['createdAt','desc'], 10);
    contracts.value.docs = [...sellerContracts.docs as Contract[], ...buyerContracts.docs as Contract[]];
    contracts.value.lastVisible = [sellerContracts.lastVisible as Contract, buyerContracts.lastVisible as Contract];
    isLoadingContracts.value = false;
}

onMounted( async ()=>{
    console.log("mounted");
    await loadContracts();
})
</script>