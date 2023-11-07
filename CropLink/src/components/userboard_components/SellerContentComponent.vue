<template>
     <span class="grid grid-flow-col space-x-4">
        <SellerAdCard v-for="(ad,index) in ads" :key="index" :ad="ad" />
    </span>
</template>
<script setup lang="ts">
import type { SellerAd } from '@/types';
import { type PropType } from 'vue';
import SellerAdCard from '../cards/SellerAdCard.vue';
const props = defineProps({
    ads: {
        type: Array as PropType<SellerAd[]>,
        required: true
    }
})
</script>