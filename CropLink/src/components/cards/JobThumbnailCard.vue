<template>
    <span  class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4 p-5">
        <div class="flex flex-row space-x-4 w-full border-b pb-2 mb-4">
            <p class="text-md font-bold">{{ job.title }}</p>
        </div>
        <div class="space-y-2">
            <div class="flex flex-row space-x-4">
                <MapPinIcon class="w-5 h-5" />
                <p class="text-sm">{{ job.location }}</p>
            </div>
            <div class="flex flex-row space-x-4">
                <CurrencyDollarIcon class="w-5 h-5" />
                <p class="text-sm">{{ job.salaryMin }}</p>
                <p class="text-sm">-</p>
                <p class="text-sm">{{ job.salaryMax }}</p>
            </div>
        </div>
        <div class="w-full flex justify-end gap-4">
            <p @click="onView(job.jobId)" class="underline text-sm cursor-pointer">View</p>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Job } from '@/types';
import { type PropType } from 'vue';
import { MapPinIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
const { modals } = storeToRefs(useModalStore());
const emits = defineEmits(['edit', 'remove']);
const props = defineProps({
    job: {
        type: Object as PropType<Job>,
        required: true
    },
})
const onView = (jobId: string) => {
    if(!jobId) return;
    modals.value['viewjob'] = true;
    modals.value['context'].__key = jobId;
}
</script>