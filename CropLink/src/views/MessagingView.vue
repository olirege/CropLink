<template>
    <div class="flex flex-row gap-2 h-16 border-b items-center pl-2 sticky top-16 bg-white sm:hidden">
        <p @click="scrollTo('messaging_content')" class="font-bold hover:underline" :class="tab == 'messaging_content' ? 'text-cyan-600 underline' : ''">Messaging</p>
        <p @click="scrollTo('contract_content')" class="font-bold hover:underline" :class="tab == 'contract_content' ? 'text-cyan-600 underline' : ''" >Contract</p>
    </div>
    <div class="flex flex-col gap-2 sm:grid sm:grid-rows-1 sm:grid-cols-2 gap-x-4 p-2">
        <ChatRoomComponent id="messaging_content" class="min-h-[400px] h-[400px]" :clauseMentionned="clauseMentionned" @onRemoveMentionnedClause="onRemoveMentionnedClause" :adId="(adId as string)"/>
        <ContractComponent id="contract_content" :adId="(adId as string)" @onMentionClause="onMentionClause" />
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
const tab = ref('messaging_content');
const scrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if(!element) return;
    tab.value = elementId;
    if(elementId == 'messaging_content') {
        element.scrollIntoView({behavior: "smooth", block: "end", });
        return;
    }
    element.scrollIntoView({behavior: "smooth", block: "start", });
}
</script>