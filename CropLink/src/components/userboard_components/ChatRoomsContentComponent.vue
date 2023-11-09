<template>
    <span class="grid grid-flow-row space-y-4">
       <ChatRoomCard v-for="(chatroom,index) in chatrooms" :key="index" :chatroom="chatroom" />
   </span>
</template>
<script setup lang="ts">
import type { ChatRoom } from '@/types';
import ChatRoomCard from '../cards/ChatRoomCard.vue';
import { type PropType } from 'vue';
const props = defineProps({
   chatrooms: {
       type: Array as PropType<ChatRoom[]>,
       required: true
   }
})
</script>