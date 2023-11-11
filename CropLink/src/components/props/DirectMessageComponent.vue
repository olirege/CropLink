<template>
    <div class="w-48 rounded rounded-t-md fixed bottom-0 right-1 h-10 bg-white z-10 border-x-4 border-t-4 flex justify-center items-center" @click="onOpen(true)" v-if="!open">
        <div class="flex justify-center items-center flex-row gap-4">
            <EnvelopeIcon class="h-6 w-6" />
            <h1 class="text-lg font-bold">Messaging</h1>
        </div>
    </div>
    <div class="w-80 h-96 fixed bottom-0 right-1 bg-white z-10 border-4 rounded-t-md shadow-md" v-if="open">
        <div class="p-4 w-full mx-auto rounded-lg flex flex-col space-y-4">
            <h1 class="text-xl font-semibold border-b pb-2" @click="onOpen(false)">Messaging</h1>
            <div class="flex flex-col space-y-2 overflow-y-auto h-full">
                <ChatRoomsContentComponent :withThumbnails="true"/>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { EnvelopeIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import ChatRoomsContentComponent from '../userboard_components/ChatRoomsContentComponent.vue';
const open = ref(false);
const isLoadingMessages = ref(false);
const onOpen = (value:boolean) => {
    open.value = value;
}
</script>