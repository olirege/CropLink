<template>
    <span class="py-2 bg-white flex flex-row items-center gap-4 hover:bg-slate-200/50 transition duration-300 first:border-none border-t-2 last:border-b-2" @click="onView(chatroom.adId)">
        <img src="" class="h-12 w-12 rounded-full bg-slate-400">
        <div class="flex flex-row space-x-4 items-center">
            <p class="block text-sm font-medium text-gray-700">{{ chatroom.lastSender? `${chatroom.lastSender.substring(0,5)} says:` : '' }}</p>
            <p class="block text-sm text-gray-500 truncate italic">{{ chatroom.lastMessage ? chatroom.lastMessage : '' }}</p>
        </div>
    </span>
</template>
<script setup lang="ts">
import type { ChatRoom } from '@/types';
import { type PropType } from 'vue';
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