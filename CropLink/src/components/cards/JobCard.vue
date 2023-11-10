<template>
    <span  class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4">
        <div class="flex flex-row space-x-4" v-if="job.live">
            <p class="text-sm"> <span class="text-green-500">LIVE</span> </p>
        </div>
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
            <ButtonWithLoading :isLoading="isLoading" v-if="!job.live" @click="onPost(job.jobId)" :classes="'w-20'">Post</ButtonWithLoading>
            <ButtonWithLoading :isLoading="isLoading" v-if="job.live" @click="onTakedown(job.jobId)" :classes="'w-20'">Takedown</ButtonWithLoading>
            <CardButton @click="onRemove(job.jobId)" :classes="'w-20'">Remove</CardButton>
            <CardButton @click="onEdit(job.jobId)" :classes="'w-20'">Edit</CardButton>
            <CardButton @click="onView(job.jobId)" :classes="'w-20'">View</CardButton>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Job } from '@/types';
import { type PropType, ref } from 'vue';
import { isFirestoreTimestamp, convertTimestampToDate } from '@/firebase/utils';
import CardButton from '@/components/props/CardButton.vue';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
const emits = defineEmits(['edit', 'remove']);
const router = useRouter();
const props = defineProps({
    job: {
        type: Object as PropType<Job>,
        required: true
    }
})
const isLoading = ref(false);
const onPost = async (jobId: string) => {
    isLoading.value = true;
    await useMainStore().postJobPostAd(jobId)
    isLoading.value = false;
}
const onTakedown = async (jobId: string) => {
    isLoading.value = true;
    await useMainStore().takedownJobPostAd(jobId)
    isLoading.value = false;
}
const onView = (jobId: string) => {
    router.push({ name: 'job', params: { jobId } });
}
const onEdit = (jobId: string) => {
    emits('edit', jobId);
}
const onRemove = (jobId: string) => {
    emits('remove', jobId);
}
</script>