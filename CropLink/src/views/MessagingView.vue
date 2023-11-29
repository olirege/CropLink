<template>
    <div class="grid grid-cols-2 gap-x-4 p-2">
        <ChatRoomComponent :clauseMentionned="clauseMentionned" @onRemoveMentionnedClause="onRemoveMentionnedClause" :adId="(adId as string)"/>
        <ContractComponent :adId="(adId as string)" @onMentionClause="onMentionClause" />
    </div>
</template>
<script setup lang="ts">
import ChatRoomComponent from '@/components/userboard_components/ChatRoomComponent.vue';
import ContractComponent from '@/components/userboard_components/ContractComponent.vue';
import { ref } from 'vue';
import type { Clause } from '@/types';
const props = defineProps({
    adId: {
        type: String,
        required: false
    },
    contractId: {
        type: String,
        required: false
    },
})
const clauseMentionned = ref({} as Clause);
const onMentionClause = (clause:Clause) => {
    if(!clause || !clause.id || clause.draft) return;
    clauseMentionned.value = clause;
}
const onRemoveMentionnedClause = () => {
    clauseMentionned.value = {} as Clause;
}
</script>