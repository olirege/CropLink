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
                    @click="selectedTab = 3"
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
                    <button @click="onAddAd" class="mt-2 mb-2 w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Add an ad</button>
                    <div v-if="ads.docs && ads.docs.length > 0 && !isLoadingAds" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SellerContentComponent :ads="(ads.docs ? ads.docs : [] as SellerAd[])" v-if="profile.accountType == ACCOUNT_TYPES.SELLER"/>
                        <BuyerContentComponent :ads="(ads.docs ? ads.docs : [] as BuyerAd[])" v-if="profile.accountType == ACCOUNT_TYPES.BUYER"/>
                    </div>
                    <div v-else-if="isLoadingAds">
                        <LoadingSpinner :isLoading ="isLoadingAds"/>
                    </div>
                    <div v-else>
                        <div>No ads found</div>
                    </div>
                </TabPanel>
                <TabPanel>
                    Contract
                </TabPanel>
                <TabPanel>
                    Messages
                </TabPanel>
                <TabPanel>
                    <BidContentComponent :bids="bids.docs ? bids.docs : [] " v-if="bids.docs && bids.docs.length > 0 && !isLoadingBids" />
                    <div v-else-if="isLoadingBids">
                        <LoadingSpinner :isLoading ="isLoadingBids"/>
                    </div>
                    <span v-else>
                        <p>No bids yet</p>
                    </span>
                </TabPanel>
            </TabGroup>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, type Ref, watch, onMounted } from 'vue';
import { TabGroup, TabList, Tab, TabPanel } from '@headlessui/vue'
import { useModalStore } from '@/stores/modals';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import type { SellerAd, BuyerAd, Bid } from '@/types';
import SellerContentComponent from '@/components/userboard_components/SellerContentComponent.vue';
import BuyerContentComponent from '@/components/userboard_components/BuyerContentComponent.vue';
import BidContentComponent from '@/components/userboard_components/BidContentComponent.vue';
import { getPaginatedCollectionGroupWhere }  from '@/firebase/utils';
import { query, collectionGroup, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/main';

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
    MESSAGES: "Messages",
}

const ads: Ref<{lastvisible:SellerAd|BuyerAd, docs:SellerAd[]|BuyerAd[]}> = ref([]);
const bids: Ref<{lastvisible:Bid, docs:Bid[]}> = ref([]);
const isLoadingAds = ref(false);
const loadAds = async () => {
    isLoadingAds.value = true;
    ads.value = await getPaginatedCollectionGroupWhere('ads', 'uid', '==', user.value.uid , ['createdAt','desc'], 10);
    console.log("ads", ads.value);
    stopSubscription = onSnapshot(query(collectionGroup(db, 'ads'), where('uid', '==', user.value.uid ), orderBy('createdAt','desc')), (snapshot) => {
        ads.value.docs = snapshot.docs.map((doc) => {
            console.log("ads changed")
            return {
                id: doc.id,
                ...doc.data()
            } as SellerAd | BuyerAd;
        })
    })
    isLoadingAds.value = false;
}

const isLoadingBids = ref(false);
const loadBids = async () => {
    isLoadingBids.value = true;
    bids.value = await getPaginatedCollectionGroupWhere('bids', 'buyerId', '==', user.value.uid , ['createdAt','desc'], 10);
    console.log("loadingBids", bids.value)
    stopSubscription = onSnapshot(query(collectionGroup(db, 'bids'), where('buyerId', '==', user.value.uid ), orderBy('createdAt','desc')), (snapshot) => {
        bids.value.docs = snapshot.docs.map((doc) => {
            console.log("bids changed")
            return {
                id: doc.id,
                ...doc.data()
            } as Bid;
        })
    })
    isLoadingBids.value = false;
}
let stopSubscription: any;
watch(selectedTab, async (newVal, oldVal) => {
    if(selectedTab.value == 0) {
        // fetch user ads
        await loadAds();
    }
    if(selectedTab.value == 3) {
        // fetch user bids
        await loadBids();
    }
    if(oldVal == 3 || oldVal == 0) {
        stopSubscription();
    }
})
onMounted( async ()=>{
    console.log("mounted");
    await loadAds();
})
</script>