<template>
    <span  class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4">
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">createdAt</label>
            <p class="text-sm">{{ isFirestoreTimestamp(chatroom.createdAt) ? convertTimestampToDate(chatroom.createdAt) : chatroom.createdAt  }}</p>
        </div>
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">Ad</label>
            <p class="text-sm">{{ chatroom.adId.substring(0,5) }}</p>
        </div>
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">buyerId</label>
            <p class="text-sm">{{ chatroom.buyerId.substring(0,5) }}</p>
        </div>
        <div class="flex flex-row space-x-4">
            <label class="block text-sm font-medium text-gray-700">sellerId</label>
            <p class="text-sm">{{ chatroom.sellerId.substring(0,5) }}</p>
        </div>
        <div class="w-full flex justify-end gap-4">
            <CardButton @click="onView(chatroom.adId)" :classes="'w-20'">View</CardButton>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { ChatRoom } from '@/types';
import { type PropType } from 'vue';
import { isFirestoreTimestamp, convertTimestampToDate } from '@/firebase/utils';
import CardButton from '@/components/props/CardButton.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
    chatroom: {
        type: Object as PropType<ChatRoom>,
        required: true
    }
})
const onView = (adId: string) => {
    router.push({ name: 'messaging', params: { adId } });
}
</script>