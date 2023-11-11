<template>
    <span  class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4" @click="onView(chatroom.adId)">
        <div class="flex flex-row space-x-4">
            <p class="block text-sm font-medium text-gray-700">{{ chatroom.lastSender? chatroom.lastSender : '' }}</p>
            <p class="block text-sm text-gray-500">{{ chatroom.lastMessage ? chatroom.lastMessage : '' }}</p>
            <p class="block text-sm text-gray-500">{{ isFirestoreTimestamp(chatroom.lastUpdated) ? convertTimestampToDate(chatroom.lastUpdated) : chatroom.lastUpdated }}</p>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { ChatRoom } from '@/types';
import { type PropType } from 'vue';
import { isFirestoreTimestamp, convertTimestampToDate } from '@/firebase/utils';
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