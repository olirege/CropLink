<template>
    <div class="w-full px-2 py-3 sm:px-0">
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
                    <Tab
                    as="template"
                    v-if="profile.accountType === ACCOUNT_TYPES.BUYER"
                    v-slot="{ selected }"
                    @click="selectedTab = 4"
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
                            Bids
                        </button>
                    </Tab>
                </TabList>
                <TabPanel>
                        <SellerContentComponent v-if="profile.accountType == ACCOUNT_TYPES.SELLER"/>
                        <BuyerContentComponent v-if="profile.accountType == ACCOUNT_TYPES.BUYER"/>
                </TabPanel>
                <TabPanel>
                    <ContractContentComponent/>
                </TabPanel>
                <TabPanel>
                    <ChatRoomsContentComponent/>
          
                </TabPanel>
                <TabPanel>
                    <JobsContentComponent/>
                </TabPanel>
                <TabPanel>
                    <BidContentComponent/>
            
                </TabPanel>
            </TabGroup>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, type Ref } from 'vue';
import { TabGroup, TabList, Tab, TabPanel } from '@headlessui/vue'
import SellerContentComponent from '@/components/userboard_components/SellerContentComponent.vue';
import BuyerContentComponent from '@/components/userboard_components/BuyerContentComponent.vue';
import BidContentComponent from '@/components/userboard_components/BidContentComponent.vue';
import ContractContentComponent from '@/components/userboard_components/ContractsContentComponent.vue';
import ChatRoomsContentComponent from '@/components/userboard_components/ChatRoomsContentComponent.vue';
import JobsContentComponent from '@/components/userboard_components/JobsContentComponent.vue';
const { profile } = storeToRefs(useMainStore());
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const selectedTab:Ref<number> = ref(0);
const TAB_CATEGORIES = {
    ADS: "Ads",
    CONTRACTS: "Contracts",
    MESSAGES: "Messages",
    JOBS: "Job posts"
}
</script>