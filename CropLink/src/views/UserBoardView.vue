<template>
    <div class="w-full">
        <div class="w-full" v-if="profile">
            <TabGroup>
                <TabList class="w-full flex justify-between sm:justify-start sm:space-x-1 p-1">
                    <Tab
                        v-for="(category,key,index) in TAB_CATEGORIES"
                        as="template"
                        :key="key"
                        v-slot="{ selected }"
                        @click="selectedTab = index"
                        >
                            <button
                            :class="[
                            'sm:w-24 rounded-lg py-2.5 text-sm font-medium cursor-pointer',
                            selected
                                ? 'text-blue-500 focus:outline-none'
                                : 'text-slate-500',
                            ]"
                        >
                            {{ category }}
                        </button>
                    </Tab>
                    <Tab
                    as="template"
                    v-if="profile.accountType === ACCOUNT_TYPES.BUYER"
                    v-slot="{ selected }"
                    @click="selectedTab = 5"
                        >
                        <button
                            :class="[
                            'w-24 rounded-lg py-2.5 text-sm font-medium cursor-pointer',
                            selected
                                ? 'text-blue-500 focus:outline-none'
                                : 'text-slate-500',
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
                    <JobsContentComponent/>
                </TabPanel>
                <TabPanel>
                    <GigsContentComponent/>
                </TabPanel>
                <TabPanel>
                    <ApplicationsContentComponent/>
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
import GigsContentComponent from '@/components/userboard_components/GigsContentComponent.vue';
import ApplicationsContentComponent from '@/components/userboard_components/ApplicationsContentComponent.vue';
import ContractContentComponent from '@/components/userboard_components/ContractsContentComponent.vue';
import JobsContentComponent from '@/components/userboard_components/JobsContentComponent.vue';
const { profile } = storeToRefs(useMainStore());
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const selectedTab:Ref<number> = ref(0);
const TAB_CATEGORIES = {
    ADS: "Ads",
    CONTRACTS: "Contracts",
    JOBS: "Job posts",
    GIGS: "Gigs",
    APPLICATIONS: "Applications",
}
</script>