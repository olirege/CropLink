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
                    <ContractContentComponent :contracts="contracts.docs ? contracts.docs : [] " v-if="contracts.docs && contracts.docs.length > 0 && !isLoadingContracts" />
                    <div v-else-if="isLoadingContracts">
                        <LoadingSpinner :isLoading ="isLoadingContracts"/>
                    </div>
                    <span v-else>
                        <p>No contracts yet</p>
                    </span>
                </TabPanel>
                <TabPanel>
                    <ChatRoomsContentComponent :chatrooms="chatrooms.docs ? chatrooms.docs : [] " v-if="chatrooms.docs && chatrooms.docs.length > 0 && !isLoadingChatRooms" />
                    <div v-else-if="isLoadingChatRooms">
                        <LoadingSpinner :isLoading ="isLoadingChatRooms"/>
                    </div>
                    <span v-else>
                        <p>No conversations yet</p>
                    </span>
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
import type { SellerAd, BuyerAd, Bid, Contract, ChatRoom } from '@/types';
import SellerContentComponent from '@/components/userboard_components/SellerContentComponent.vue';
import BuyerContentComponent from '@/components/userboard_components/BuyerContentComponent.vue';
import BidContentComponent from '@/components/userboard_components/BidContentComponent.vue';
import ContractContentComponent from '@/components/userboard_components/ContractsContentComponent.vue';
import ChatRoomsContentComponent from '@/components/userboard_components/ChatRoomsContentComponent.vue';
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

const ads: Ref<{lastVisible:SellerAd|BuyerAd, docs:SellerAd[]|BuyerAd[]}> = ref([]);
const bids: Ref<{lastVisible:Bid, docs:Bid[]}> = ref([]);
const contracts: Ref<{lastVisible:Contract[], docs:Contract[]}> = ref([]);
const chatrooms: Ref<{lastVisible:ChatRoom, docs:ChatRoom[]}> = ref([]);
const isLoadingAds = ref(false);
const isLoadingContracts = ref(false);
const isLoadingChatRooms = ref(false);
const isLoadingBids = ref(false);

let stopSubscription: any;

const loadChatRooms = async () => {
    isLoadingChatRooms.value = true;
    const buyerChatrooms = await getPaginatedCollectionGroupWhere('chatrooms', 'sellerId', '==', user.value.uid , ['createdAt','desc'], 10);
    const sellerChatrooms = await getPaginatedCollectionGroupWhere('chatrooms', 'buyerId', '==', user.value.uid , ['createdAt','desc'], 10);
    chatrooms.value.docs = [...buyerChatrooms.docs as ChatRoom[], ...sellerChatrooms.docs as ChatRoom[]];
    chatrooms.value.lastVisible = [buyerChatrooms.lastVisible as ChatRoom, sellerChatrooms.lastVisible as ChatRoom];
    isLoadingChatRooms.value = false;
}

const loadContracts = async () => {
    isLoadingContracts.value = true;
    const sellerContracts = await getPaginatedCollectionGroupWhere('contracts', 'sellerId', '==', user.value.uid , ['createdAt','desc'], 10);
    const buyerContracts = await getPaginatedCollectionGroupWhere('contracts', 'buyerId', '==', user.value.uid , ['createdAt','desc'], 10);
    contracts.value.docs = [...sellerContracts.docs as Contract[], ...buyerContracts.docs as Contract[]];
    contracts.value.lastVisible = [sellerContracts.lastVisible as Contract, buyerContracts.lastVisible as Contract];
    isLoadingContracts.value = false;
}

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
watch(selectedTab, async (newVal, oldVal) => {
    if(selectedTab.value == 0) {
        await loadAds();
    }
    if(selectedTab.value == 1) {
        await loadContracts();
    }
    if(selectedTab.value == 2) {
        await loadChatRooms();
    }
    if(selectedTab.value == 3) {
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