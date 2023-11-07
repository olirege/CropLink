<template>
    <span>
       <BuyerAdCard v-for="(ad,index) in ads" :key="index" :ad="ad" />
   </span>
</template>
<script setup lang="ts">
import type { BuyerAd } from '@/types';
import BuyerAdCard from '../cards/BuyerAdCard.vue';
import { type PropType } from 'vue';
const props = defineProps({
   ads: {
       type: Array as PropType<BuyerAd[]>,
       required: true
   }
})
</script>