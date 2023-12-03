<template>
    <div class="flex flex-col gap-4 justify-between">
        <div class="flex flex-row gap-2 items-center h-12">
            <label>Amount of bids:</label>
            <input v-model="bidAmount" class="border h-12">
            <ButtonWithLoading :isLoading="isLoadingBids" @click="createBids">
                Create Bids
            </ButtonWithLoading>
        </div>
        <div class="flex flex-row gap-2 items-center h-12">
            <label>Amount of jobs:</label>
            <input v-model="jobAmount" class="border h-12">
            <ButtonWithLoading :isLoading="isLoadingJobs" @click="createJobs">
                Create Jobs
            </ButtonWithLoading>
        </div>
        <div class="flex flex-row gap-2 items-center h-12">
            <label>Amount of gigs:</label>
            <input v-model="gigAmount" class="border h-12">
            <ButtonWithLoading :isLoading="isLoadingGigs" @click="createGigs">
                Create Gigs
            </ButtonWithLoading>
        </div>
        <div class="flex flex-row gap-4">
            <ButtonWithLoading :isLoading="isLoadingDeleteUsers" @click="deleteUsers">
                Delete Users
            </ButtonWithLoading>
            <ButtonWithLoading :isLoading="isLoadingDeleteAds" @click="deleteAds">
                Delete Ads
            </ButtonWithLoading>
            <ButtonWithLoading :isLoading="isLoadingDeleteBids" @click="deleteBids">
                Delete Bids
            </ButtonWithLoading>
            <ButtonWithLoading :isLoading="isLoadingDeleteJobs" @click="deleteJobs">
                Delete Jobs
            </ButtonWithLoading>
            <ButtonWithLoading :isLoading="isLoadingDeleteGigs" @click="deleteGigs">
                Delete Gigs
            </ButtonWithLoading>
        </div>
    </div>
</template>
<script setup lang="ts">
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { ref } from 'vue';
import { db } from '@/firebase/main';
import { faker } from '@faker-js/faker';
import { useFirebaseFunctionCall } from '@/firebase/utils';
import { 
    collection,
    collectionGroup,
    getDocs,
    query,
    where,
    getDoc,
    setDoc,
    addDoc,
    doc,
    Timestamp,
    deleteDoc,
    orderBy,
    startAfter,
    arrayUnion,
    limit  } from "firebase/firestore";

const USER_COLLECTION = import.meta.env.VITE_USERS_COLLECTION as string;
const AD_COLLECTION = import.meta.env.VITE_ADS_COLLECTION as string;
const BIDS_COLLECTION = import.meta.env.VITE_BIDS_COLLECTION as string;
const JOBS_COLLECTION = import.meta.env.VITE_JOBS_COLLECTION as string;
const GIGS_COLLECTION = import.meta.env.VITE_GIGS_COLLECTION as string;
const bidAmount = ref('');
const jobAmount = ref('');
const gigAmount = ref('');
const isLoadingBids = ref(false);
const isLoadingJobs = ref(false);
const isLoadingGigs = ref(false);

const createBids = async () =>{
    isLoadingBids.value = true;
    if(bidAmount.value === '') {
        return;
    }
    const q = query(collection(db, USER_COLLECTION), where("uid", ">=", "test_"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data());
    const sellers = users.filter(user => user.accountType === 'seller');
    const buyers = users.filter(user => user.accountType === 'buyer');
    const selleradsQuery = query(collectionGroup(db, AD_COLLECTION), where("adType", "==", "seller"));
    const sellerAdsSnapshot = await getDocs(selleradsQuery);
    const sellerAds = sellerAdsSnapshot.docs.map(doc => doc.data());
    const promises = [];
    for (const ad in sellerAds) {
        if(!sellerAds[ad].live) continue;
        const bids = []
        for (let i = 0; i < parseInt(bidAmount.value); i++) {
            const bidId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const bid = {
                adId: sellerAds[ad].id,
                id: bidId,
                sellerId: sellerAds[ad].uid,
                buyerId: buyers[Math.floor(Math.random() * buyers.length)].uid,
                price: parseFloat(faker.finance.amount(100, 1000, 2)),
                createdAt: faker.date.past(),
                updatedAt: new Date(),
                status: "pending",

            };
            bids.push(bid);
        }
        for (const bid in bids) {
            const bidRef = doc(db, BIDS_COLLECTION, sellerAds[ad].id ,BIDS_COLLECTION, bids[bid].id);
            promises.push(setDoc(bidRef, bids[bid]));
        }
        const bidMainRef = doc(db, BIDS_COLLECTION, sellerAds[ad].id);
        promises.push(setDoc(bidMainRef, {id: sellerAds[ad].id}));
    }
    await Promise.all(promises);
    isLoadingBids.value = false;
}
const createJobs = async () => {
    isLoadingJobs.value = true;
    if(jobAmount.value === '') {
        return;
    }
    const q = query(collection(db, USER_COLLECTION), where("uid", ">=", "test_"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => {return {data:doc.data(), id: doc.id}});
    const promises = [];
    const salaryMin = Math.floor(Math.random() * 100000);
    const salaryMax = salaryMin + Math.floor(Math.random() * 100000);
    for ( const user in users) {
        for ( let i = 0; i < parseInt(jobAmount.value); i++) {
            const job = {
                createdAt: faker.date.past(),
                description: faker.person.jobDescriptor(),
                jobId: `testjob_${Math.floor(Math.random() * 1000000)}`,
                live: true,
                location: faker.location.city(),
                posterId: users[user].id,
                salaryMin: salaryMin,
                salaryMax: salaryMax,
                tasks: generateJobTasks(),
                title: faker.person.jobTitle(),
                updatedAt: new Date(),
            }
            const jobRef = doc(db, JOBS_COLLECTION, users[user].id, JOBS_COLLECTION, job.jobId);
            promises.push(setDoc(jobRef, job));
        }
        const jobMainRef = doc(db, JOBS_COLLECTION, users[user].id);
        promises.push(setDoc(jobMainRef, {id: users[user].id}));
    }
    await Promise.all(promises);
    isLoadingJobs.value = false;
}
const createGigs = async () => {
    isLoadingGigs.value = true;
    if(gigAmount.value === '') {
        return;
    }
    const q = query(collection(db, USER_COLLECTION), where("uid", ">=", "test_"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => {return {data:doc.data(), id: doc.id}});
    const promises = [];
    for ( const user in users) {
        for ( let i = 0; i < parseInt(gigAmount.value); i++) {
            const gig = {
                createdAt: faker.date.past(),
                description: faker.lorem.paragraph(),
                gigId: `testgig_${Math.floor(Math.random() * 1000000)}`,
                live: true,
                location: faker.location.city(),
                posterId: users[user].id,
                milestones: generateMilestones(),
                title: faker.lorem.words(),
                updatedAt: new Date(),
            }
            const gigRef = doc(db, GIGS_COLLECTION, users[user].id, GIGS_COLLECTION, gig.gigId);
            promises.push(setDoc(gigRef, gig));
        }
        const gigMainRef = doc(db, GIGS_COLLECTION, users[user].id);
        promises.push(setDoc(gigMainRef, {id: users[user].id}));
    }
    await Promise.all(promises);
    isLoadingGigs.value = false;
}
const isLoadingDeleteUsers = ref(false);
const deleteUsers = async () => {
    isLoadingDeleteUsers.value = true;
    const q = query(collection(db, USER_COLLECTION), where("uid", ">=", "test_"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => {return {data:doc.data(), id: doc.id}});
    const promises = [];
    for (const user in users) {
        const userRef = doc(db, USER_COLLECTION, users[user].id);
        promises.push(deleteDoc(userRef));
    }
    await Promise.all(promises);
    isLoadingDeleteUsers.value = false;
}
const isLoadingDeleteAds = ref(false);
const deleteAds = async () => {
    isLoadingDeleteAds.value = true;
    const promises = [];
    const adDocs = await getDocs(collection(db, AD_COLLECTION));
    const adcGroupDocs = await getDocs(collectionGroup(db, AD_COLLECTION));
    adDocs.forEach(doc => {
        promises.push(deleteDoc(doc.ref));
    });
    adcGroupDocs.forEach(doc => {
        promises.push(deleteDoc(doc.ref));
    });
    await Promise.all(promises);
    isLoadingDeleteAds.value = false;
}
const isLoadingDeleteBids = ref(false);
const deleteBids = async () => {
    isLoadingDeleteBids.value = true;
    const q = query(collectionGroup(db, BIDS_COLLECTION), where("id", ">=", "test_"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => {return {data:doc.data(), id: doc.id}});
    const promises = [];
    for (const user in users) {
        const bidRef = doc(db, BIDS_COLLECTION, users[user].id);
        promises.push(deleteDoc(bidRef));
    }
    await Promise.all(promises);
    isLoadingDeleteBids.value = false;
}
const isLoadingDeleteJobs = ref(false);
const deleteJobs = async () => {
    isLoadingDeleteJobs.value = true;
    const promises = [];
    const docs = await getDocs(collection(db, JOBS_COLLECTION));
    const groupDocs = await getDocs(collectionGroup(db, JOBS_COLLECTION));
    docs.forEach(doc => {
        promises.push(deleteDoc(doc.ref));
    });
    groupDocs.forEach(doc => {
        promises.push(deleteDoc(doc.ref));
    });
    await Promise.all(promises);
    isLoadingDeleteJobs.value = false;
}
const isLoadingDeleteGigs = ref(false);
const deleteGigs = async () => {
    isLoadingDeleteGigs.value = true;
    const promises = [];
    const docs = await getDocs(collection(db, GIGS_COLLECTION));
    const groupDocs = await getDocs(collectionGroup(db, GIGS_COLLECTION));
    docs.forEach(doc => {
        promises.push(deleteDoc(doc.ref));
    });
    groupDocs.forEach(doc => {
        promises.push(deleteDoc(doc.ref));
    });
    await Promise.all(promises);
    isLoadingDeleteGigs.value = false;
}
const generateMilestones = () => {
    const randomAmount = Math.floor(Math.random() * 10);
    const milestones = [];
    for (let i = 0; i < randomAmount; i++) {
        milestones.push({
            title: faker.lorem.words(),
            description: faker.lorem.paragraph(),
            price: parseFloat(faker.finance.amount(100, 1000, 2)),
        })
    }
    return milestones;
}
const generateJobTasks = () => {
    const randomAmount = Math.floor(Math.random() * 10);
    const tasks = [];
    for (let i = 0; i < randomAmount; i++) {
        tasks.push(faker.lorem.paragraph({
            min: 1,
            max: 5,
        }));
    }
    return tasks;
}
</script>