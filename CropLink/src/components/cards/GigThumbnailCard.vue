<template>
    <span  class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4 p-5">
        <div class="flex flex-row space-x-4 w-full border-b pb-2 mb-4">
            <p class="text-md font-bold">{{ gig.title }}</p>
        </div>
        <div class="space-y-2">
            <div class="flex flex-row space-x-4">
                <MapPinIcon class="w-5 h-5" />
                <p class="text-sm">{{ gig.location }}</p>
            </div>
            <div class="flex flex-row space-x-4">
                <CurrencyDollarIcon class="w-5 h-5" />
                <p class="text-sm">{{ milestoneTotal }}</p>
            </div>
        </div>
        <div class="w-full flex justify-end gap-4">
            <p @click="onView(gig.gigId)" class="underline text-sm cursor-pointer">View</p>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Gig } from '@/types';
import { type PropType, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MapPinIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
const { modals } = storeToRefs(useModalStore());
const emits = defineEmits(['edit', 'remove']);
const router = useRouter();
const props = defineProps({
    gig: {
        type: Object as PropType<Gig>,
            required: true
        },
})
const milestoneTotal = computed(() => {
    return props.gig.milestones.reduce((acc, curr) => acc + curr.price, 0);
})
const onView = (gigId: string) => {
    if(!gigId) return;
    // router.push({ name: 'gig', params: { gigId } });
    modals.value['viewgig'] = true;
    modals.value['context'].__key = gigId;
}
</script>