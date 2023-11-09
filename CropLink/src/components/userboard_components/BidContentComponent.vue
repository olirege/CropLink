<template>
    <span class="grid grid-flow-row space-y-4">
        <BidCard v-for="bid in bids" :bid="bid" />
    </span>
</template>
<script setup lang="ts">
import { type PropType} from 'vue';
import type { Bid } from '@/types';
import BidCard from '@/components/cards/BidCard.vue';
const props = defineProps({
    bids: {
        type: Array as PropType<Bid[]>,
        required: true
    }
})
</script>