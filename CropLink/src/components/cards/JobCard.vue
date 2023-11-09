<template>
    <span  class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4">
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">createdAt</label>
            <p class="text-sm">{{ isFirestoreTimestamp(job.createdAt) ? convertTimestampToDate(job.createdAt) : job.createdAt  }}</p>
        </div>
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">title</label>
            <p class="text-sm">{{ job.title }}</p>
        </div>
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">description</label>
            <p class="text-sm">{{ job.description }}</p>
        </div>
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">location</label>
            <p class="text-sm">{{ job.location }}</p>
        </div>
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">salary</label>
            <p class="text-sm">{{ job.salary }}</p>
        </div>
        <div class="w-full flex justify-end gap-4">
            <CardButton @click="onView(job.id)" :classes="'w-20'">View</CardButton>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Job } from '@/types';
import { type PropType } from 'vue';
import { isFirestoreTimestamp, convertTimestampToDate } from '@/firebase/utils';
import CardButton from '@/components/props/CardButton.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
    job: {
        type: Object as PropType<Job>,
        required: true
    }
})
const onView = (jobId: string) => {
    router.push({ name: 'job', params: { jobId } });
}
</script>