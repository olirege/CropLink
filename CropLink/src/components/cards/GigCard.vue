<template>
    <span  class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4">
        <div class="flex flex-row space-x-4" v-if="gig.live">
            <p class="text-sm"> <span class="text-green-500">LIVE</span> </p>
        </div>
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">createdAt</label>
            <p class="text-sm">{{ isFirestoreTimestamp(gig.createdAt) ? convertTimestampToDate(gig.createdAt) : gig.createdAt  }}</p>
        </div>
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">title</label>
            <p class="text-sm">{{ gig.title }}</p>
        </div>
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">description</label>
            <p class="text-sm">{{ gig.description }}</p>
        </div>
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">location</label>
            <p class="text-sm">{{ gig.location }}</p>
        </div>
        <div class="w-full flex justify-end gap-4" v-if="showButtons">
            <ButtonWithLoading :isLoading="isLoading" v-if="!gig.live" @click="onPost(gig.gigId)" :classes="'w-20'">Post</ButtonWithLoading>
            <ButtonWithLoading :isLoading="isLoading" v-if="gig.live" @click="onTakedown(gig.gigId)" :classes="'w-20'">Takedown</ButtonWithLoading>
            <CardButton @click="onRemove(gig.gigId)" :classes="'w-20'">Remove</CardButton>
            <CardButton @click="onEdit(gig.gigId)" :classes="'w-20'">Edit</CardButton>
            <CardButton @click="onView(gig.gigId)" :classes="'w-20'">View</CardButton>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { Gig } from '@/types';
import { type PropType, ref } from 'vue';
import { isFirestoreTimestamp, convertTimestampToDate } from '@/firebase/utils';
import CardButton from '@/components/props/CardButton.vue';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
const emits = defineEmits(['edit', 'remove']);
const router = useRouter();
const props = defineProps({
    gig: {
        type: Object as PropType<Gig>,
        required: true
    },
    showButtons: {
        type: Boolean,
        default: true
    }
})
const isLoading = ref(false);
const onPost = async (gigId: string) => {
    isLoading.value = true;
    await useMainStore().postGigPostAd(gigId)
    isLoading.value = false;
}
const onTakedown = async (gigId: string) => {
    isLoading.value = true;
    await useMainStore().takedownGigPostAd(gigId)
    isLoading.value = false;
}
const onView = (gigId: string) => {
    router.push({ name: 'gig', params: { gigId } });
}
const onEdit = (gigId: string) => {
    emits('edit', gigId);
}
const onRemove = (gigId: string) => {
    emits('remove', gigId);
}
</script>