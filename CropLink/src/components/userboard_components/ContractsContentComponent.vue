<template>
    <span class="grid grid-flow-row space-y-4">
       <ContractCard v-for="(contract,index) in contracts" :key="index" :contract="contract" />
    </span>
</template>
<script setup lang="ts">
import type { Contract } from '@/types';
import ContractCard from '../cards/ContractCard.vue';
import { type PropType } from 'vue';
const props = defineProps({
   contracts: {
       type: Array as PropType<Contract[]>,
       required: true
   }
})
</script>