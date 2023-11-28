<template>
    <div class="flex items-center shadow p-2 h-16 cursor-pointer hover:bg-slate-300/20 transform transition-all" @click="onClick">
        <table class="table-fixed w-full border-collapse">
            <tbody>
                <tr>
                    <td ><p>{{ ad.variety }}</p></td>
                    <td >
                        <span class="flex flex-row items-center gap-2">
                            <ScaleIcon class="h-4 w-4" />
                            <p>~{{ ad.tons }} tons</p>
                        </span>
                    </td>
                    <td ><p class="text-sm truncate"><span v-currency="ad.minCostPerTon"/>-<span v-currency="ad.maxCostPerTon"/>/ ton</p></td>
                    <td >
                        <span class="flex flex-row items-center gap-2">
                            <MapPinIcon class="h-4 w-4"/>
                            <p>{{ ad.location }}</p>
                        </span>
                    </td>
                    <td ><p class="italic text-sm">{{ ad.certifiedOrganic ? 'Certified Organic' : 'Not Certified Organic' }}</p></td>
                    <td ><p class="italic bg-slate-200 p-1 rounded-md text-center">{{ fromNow(ad.postedOn)}}</p></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">
import { type PropType } from 'vue';
import type { BuyerAd } from '@/types';
import { MapPinIcon, ScaleIcon } from '@heroicons/vue/24/outline';
const props = defineProps({
    ad: {
        type: Object as PropType<BuyerAd>,
        required: true
    },
})
const fromNow = (date:Timestamp) => {
    const now = new Date();
    const messageDate = date.toDate();
    const diff = now.getTime() - messageDate.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if(days > 1) {
        return `${days} days ago`;
    } else if (days == 1) {
        return `${days} day ago`;
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
const onClick = () => {
    console.log('clicked');
}
</script>