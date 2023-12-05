<template>
    <div v-if="!isLoadingAds">
        <span v-if="adGroups && adGroups.docs && adGroups.docs.length > 0" class="grid grid grid-cols-1 gap-4">
            <GroupAdCard :adGroup="adGroup" v-for="adGroup in filteredGroupAds" :key="adGroup.id"/>
            <div class="flex flex-row justify-end">
                <p @click="onViewMore" class="font-sm underline font-bold">
                    View more
                </p>
            </div>
        </span>
        <div v-if="adGroups.docs && adGroups.docs.length == 0" class="w-full">
            <div class="h-96 w-full flex items-center justify-center col-span-2 md:col-span-3 lg:col-span-4">
                <p class="text-xl font-bold">No Ads Found</p>
            </div>
        </div>
    </div>
    <div v-if="isLoadingAds" class="w-full">
        <div class="h-96 w-full flex items-center justify-center col-span-2 md:col-span-3 lg:col-span-4">
            <LoadingSpinner :isLoading="isLoadingAds"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import GroupAdCard from '@/components/cards/GroupedAdCard.vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { ref, onMounted, computed } from 'vue';
import { getPaginatedDocuments } from '@/firebase/utils';
const props = defineProps({
    filterBy: String
})
const filteredGroupAds = computed(() => {
    if (props.filterBy) {
        return adGroups.value.docs.filter((adGroup: any) => adGroup.companyName.toLowerCase().includes(props.filterBy.toLowerCase()));
    } else {
        return adGroups.value.docs;
    }
})
const isLoadingAds = ref(false);
const adGroups = ref([]);
const loadAds = async () => {
    isLoadingAds.value = true;
    adGroups.value = await getPaginatedDocuments('ads', ['updatedAt','desc'], 6);
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