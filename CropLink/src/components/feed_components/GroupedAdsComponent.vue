<template>
    <div>
        <span v-if="adGroups && adGroups.docs && adGroups.docs.length > 0 && !isLoadingAds" class="grid grid grid-cols-1 gap-4">
            <GroupAdCard :adGroup="adGroup" v-for="adGroup in adGroups.docs" :key="adGroup.id"/>
        </span>
        <div class="flex flex-row justify-end">
            <p @click="onViewMore" class="font-sm underline font-bold">
                View more
            </p>
        </div>
    </div>
    <span v-if="adGroups && adGroups.docs && adGroups.docs.length == 0 && !isLoadingAds">
        <p>No ads yet</p>
    </span>
    <div v-else="isLoadingAds">
        <LoadingSpinner :isLoading="isLoadingAds"/>
    </div>
</template>
<script setup lang="ts">
import GroupAdCard from '@/components/cards/GroupedAdCard.vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { ref, onMounted } from 'vue';
import { getPaginatedDocuments } from '@/firebase/utils';
const isLoadingAds = ref(false);
const adGroups = ref([]);
const loadAds = async () => {
    isLoadingAds.value = true;
    adGroups.value = await getPaginatedDocuments('ads', ['updatedAt','desc'], 3);
    isLoadingAds.value = false;
}
const onViewMore = async () => {
    const lastVisible = adGroups.value.lastVisible;
    const newadGroups = await getPaginatedDocuments('ads', ['updatedAt','desc'], 6, lastVisible);
    adGroups.value = {
        lastVisible: newadGroups.lastVisible,
        docs: [...adGroups.value.docs, ...newadGroups.docs]
    }
}
onMounted(async () => {
    await loadAds();
})
</script>