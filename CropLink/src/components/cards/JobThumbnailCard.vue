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
                <p class="text-sm">{{ job.salary }}</p>
            </div>
        </div>
        <div class="w-full flex justify-end gap-4">
            <p @click="onView(job.jobId)" class="underline text-sm">View</p>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Job } from '@/types';
import { type PropType } from 'vue';
import { useRouter } from 'vue-router';
import { MapPinIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline';
const emits = defineEmits(['edit', 'remove']);
const router = useRouter();
const props = defineProps({
    job: {
        type: Object as PropType<Job>,
        required: true
    },
})
const onView = (jobId: string) => {
    router.push({ name: 'job', params: { jobId } });
}
</script>