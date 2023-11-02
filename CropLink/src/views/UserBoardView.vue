<template>
    <div class="w-full px-2 py-3 sm:px-0">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Dashboard</h1>
        <div class="w-full" v-if="profile">
            <TabGroup class="w-full" as="div">
                <TabList class="w-full flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                    <Tab
                        v-for="(category,key,index) in TAB_CATEGORIES"
                        as="template"
                        :key="key"
                        v-slot="{ selected }"
                        @click="selectedTab = index"
                        >
                            <button
                            :class="[
                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                            selected
                                ? 'bg-white shadow'
                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                            ]"
                        >
                            {{ category }}
                        </button>
                    </Tab>
                </TabList>
                <TabPanel>
                    <button @click="onAddAd" class="mt-2 mb-2 w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Add an ad</button>
                    <div v-if="ads.length > 0 && !isLoadingAds" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SellerContentComponent :ads="ads" v-if="profile.accountType == ACCOUNT_TYPES.SELLER" @post="postAd" @remove="removeAd"/>
                        <BuyerContentComponent :ads="ads" v-if="profile.accountType == ACCOUNT_TYPES.BUYER" @post="postAd" @remove="removeAd"/>
                    </div>
                    <div v-else-if="isLoadingAds">
                        <LoadingSpinner :isLoading ="isLoadingAds"/>
                    </div>
                    <div v-else>
                        <div>No ads found</div>
                    </div>
                </TabPanel>
            </TabGroup>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, type Ref, watch, onMounted } from 'vue';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { getDocuments } from '@/firebase/utils';
import { useModalStore } from '@/stores/modals';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import type { Ad } from '@/types';
import SellerContentComponent from '@/components/userboard_components/SellerContentComponent.vue';
import BuyerContentComponent from '@/components/userboard_components/BuyerContentComponent.vue'
const { profile, user } = storeToRefs(useMainStore());
const { modals } = storeToRefs(useModalStore());
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const onAddAd = () => {
    modals.value['addad'] = true;
}
const selectedTab:Ref<number> = ref(0);
const TAB_CATEGORIES = {
    ADS: "Ads",
    CONTRACTS: "Contracts",
    MESSAGES: "Messages"
}

const ads: Ref<Ad[]> = ref([]);
const isLoadingAds = ref(false);
const loadAds = async () => {
    isLoadingAds.value = true;
    ads.value = await getDocuments(`ads/${user.value?.uid}/ads`) as Ad[];
    console.log("ads", ads);
    isLoadingAds.value = false;
}
watch(selectedTab, async (newVal, oldVal) => {
    if(selectedTab.value == 0) {
        // fetch user ads
        await loadAds();
    }
})
onMounted( async ()=>{
    console.log("mounted");
    await loadAds();
})
const postAd = async (adId:string) => {
    console.log("postAd", adId);
    await useMainStore().postNewAd(adId);
}
const removeAd = async (adId:string) => {
    console.log("removeAd", adId);
    // await useMainStore().removeAd(adId);
}
</script>