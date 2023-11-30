<template>
    <span class="py-2 bg-white flex flex-row items-center gap-4 hover:bg-slate-200/50 transition duration-300 first:border-none border-t-2 last:border-b-2 cursor-pointer">
        <img v-if="dm.senderProfilePic" :src="dm.senderProfilePic" class="h-12 w-12 rounded-full bg-slate-400">
        <UserCircleIcon v-else class="h-12 w-12"/>
        <div class="flex flex-row space-x-4 items-center">
            <p class="block text-sm font-medium text-gray-700" v-if="!dm.lastContext">{{ dm.lastSender? `${dm.lastSender.substring(0,5)} says:` : '' }}</p>
            <p class="block text-sm font-medium text-gray-700" v-else-if="dm.lastContext && dm.lastContext.__key == 'invitation'">{{ dm.lastSender? `${dm.lastSender.substring(0,5)} invited you to chat` : '' }}</p>
            <p class="block text-sm font-medium text-gray-700" v-else-if="dm.lastContext && dm.lastContext.__key == 'application'">{{ dm.lastSender? `${dm.lastSender.substring(0,5)} responded to your application` : '' }}</p>
            <p class="block text-sm text-gray-500 truncate italic" v-else>{{ dm.lastMessage ? dm.lastMessage : '' }}</p>
        </div>
    </span>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { UserCircleIcon } from '@heroicons/vue/24/outline';
const router = useRouter();
const emits = defineEmits(['view']);
const props = defineProps({
    dm: {
        type: Object,
        required: true
    }
})
</script>