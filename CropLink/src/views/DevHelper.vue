<template>
    <div class="flex flex-col gap-4 justify-between">
        <div class="flex flex-row gap-2 items-center h-12">
            <label>Account Amount:</label>
            <input class="h-12 border" v-model="accountAmount">
            <ButtonWithLoading :isLoading="isLoadingUsers" @click="createUsers">
                Create Accounts
            </ButtonWithLoading>
        </div>
        <div class="flex flex-row gap-2 items-center h-12">
            <label>Ad Type:</label>
            <select v-model="adType" class="border h-12">
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
            </select>
            <ButtonWithLoading :isLoading="isLoadingAds" @click="createAds">
                Create Ads
            </ButtonWithLoading>
        </div>
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
const accountAmount = ref('');
const bidAmount = ref('');
const jobAmount = ref('');
const gigAmount = ref('');
const adType = ref('');
const isLoadingUsers = ref(false);
const isLoadingAds = ref(false);
const isLoadingBids = ref(false);
const isLoadingJobs = ref(false);
const isLoadingGigs = ref(false);
const createUsers = async () => {
    isLoadingUsers.value = true;
    if(accountAmount.value === '') {
        return;
    }
    const accountTypes = ['buyer', 'seller'];
    const range = parseInt(accountAmount.value) as number;
    for (let i = 0; i < range; i++) {
        const uid = `test_${Math.floor(Math.random() * 1000000)}`;
        const user = doc(db, USER_COLLECTION, uid);
        await setDoc(user, {
            accountType: accountTypes[Math.floor(Math.random() * accountTypes.length)],
            uid: uid,
            escrowAuth: {
                apiKey: 'test',
                email: `${uid}@test.com`,
            },
            hasEscrow: true,
            name: "Test User",
        });
    }
    isLoadingUsers.value = false;
}
const createAds = async () => {
    // get all users with test_ prefix
    isLoadingAds.value = true;
    if(adType.value === '') {
        return;
    }
    const q = query(collection(db, USER_COLLECTION), where("uid", ">=", "test_"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data());
    const sellers = users.filter(user => user.accountType === 'seller');
    const buyers = users.filter(user => user.accountType === 'buyer');
    const grapeImages = [
        'https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/eyvccy1ew0dks86fnfm3q8/5ojslbsrzlwg7v4n94cj.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=W614yrdbvkRV%2B%2B3GkJNNrG131xjZkP1gRI4ayZcua8BWD1WftuCzNPIGIYqNNxX%2B6srbHZpeQIvc8z2gJ%2BL%2FVW9Gv0%2BwlkZc145mRHdZrTggGTjhNCZbhV38sHd1S2CUvYlcm%2F3TpuktV4PWm1PqQkRX0Ld10qHllguzt2jd7iQim83yMrim0gnJvQeeClg3orEIr%2Fc0Es1Sb1QrGFWdHUWK%2FIq%2BWDHzp5a4Fbgf%2BHfLvtsCnmltxFNpNucSVWM1WBaX8X5v6TB2RcAmQSq79fnWXy1t4cCKHqgNMAAiZ1pHhuOrdD9tU212y701Ld7jQ0%2BXYB1wP6mclPOCpGyj5g%3D%3D',
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/eyvccy1ew0dks86fnfm3q8/cyqdjtzvjdfc8itb66qdel.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=LwaW%2FG61MYFBA8Ii8ouBbWRylUMgQ6U8ivDpY7AD9MV7a5pO35vD9QNxMpALp9rPO%2BaeG2%2F0apdFHEhq4YeneuqaMAS4Ardlirf5p6rc28%2FKeDnWswgIR6aqQg50THcqasF6b2xyz9Ejzh%2BrXgkbbMZQaAmCO3oWdNoZz9LKacKHxsmGY8LKVo6sjGiaxMGPUzw0rmS4RuzWkvEwLnN5yIg9HK2LekK4m0NvRs5GYwDX%2BWcbDDiCIlKBM1su3975Y3589lDdr8r0A5D0Gi0gTmp0KnhQfRYig3wRDVBZcune4ivZZQoU%2FMmANYdbctrIAyV5nI94f0aXOXbeF5cunA%3D%3D"
    ]
    const resizedGrapeImages = [
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/eyvccy1ew0dks86fnfm3q8/5ojslbsrzlwg7v4n94cj_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=B%2FI1UPYb5deYE0NXkvIOj9kA5OnF2k%2Fs41O8iLY3GyWPbQw9MQygzNMm8Jxkg9eT7A%2B4La%2B6o3vyicDaKVCrzeyYtKQegnc4YBY%2BGxrMiOe7E6VccGz3C5UxyS5O2m67310V5alaE5uCCW8B892Decj8RhIvYj6ICDbp9PJ1C%2B0uas%2FLOY5TgbZ4gzVwixcIJx8ONrrea6KURnLDLxdZAfQiMmKSOQMWEjqoFx5bxRrPCSq%2B86Du6lyAipD6RmtlvVnblCpvJ7RpLlqfdTdH20zaZfELjpHM8Sd287qEJhoLo6hoKasRXu1%2BSBaiZmUXbZoZZPH9i46E4i7ItCURrg%3D%3D",
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/eyvccy1ew0dks86fnfm3q8/cyqdjtzvjdfc8itb66qdel_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=gkWoAjY1rkjVmMbKcIWVSEb%2FCm4EBa7Nu3NU3LftB9psgx2MsEmzNGRIaXU4ITFwiIZV2l%2FAExckDwpIH7dKyCvDt6H5DZErKcFq2l10hvFvNFuqsiEC7Z4Ql7SHYgqORAP4XNxPkjkdhk7K4m%2BKXWSqQQJ3yEUChcFB02gckmioBbfwn8niHck6IroVjHHH%2BTHQRyX0xo0I9gGyTq0j1QQytAt20rqcYvnNbgS1riSfcFWzhgJW2VukJvvpw7n2Clv8yQl58UoArgEjZ4Uh4q13Pvg%2BxBrh%2F2mNGxNYULCq0cXoSCSIWHzAHj6yl342kgVvnEon7LPIUfUurN7Ymw%3D%3D",
    ]
    const chardImages = [
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/cpghlkju5m8vvbnwj8syi/yfloyfq6va3lvj7t3lkfc.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=gpvmJvNzeNF9FqxmmFMqoQ4IkhpDc%2BLqfMevK%2BPojrvmzxlBmETxpYIJWXA0dTP2LzB1gjbr1VSgZpVFaNnIbPhVuZV4bh1MuHJVdMnzIFjypS5qlqVVL6eIg8p%2BTE66XzeDBCoHUURPnyhAj%2FRxbxspxxz%2Bvt2uDnd8r9vt9YJBByI5ufDHiXHEaF4gCn4%2BI7MDZzTv8WXPo2RiGih7BSvSw8WWPyhCWq8yuHN5Pr3LykrcQKpda3GI%2BzQh1Tk8GL6Th1Qjv1tujAq38HHn9BiPqpQidwiH%2Fy5eOxb5plwkfIbqjEW%2FBNdRdAsGWWMBANWoQzAImiivMAfwGZeIeA%3D%3D",
    ]
    const chardResizedImages = [
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/cpghlkju5m8vvbnwj8syi/yfloyfq6va3lvj7t3lkfc_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=iygX%2F6eOh94O7BJaLD8rLBMZfXupNNB%2Bd590C%2BJesy0SjXMJnS2UE4EiK0aMbKSaO%2FjE%2FXhaxIblbd4MG6LiPvOHKAbGK0o0y5x61BbvKyj%2FoMxkRZ4H0mtIsc8bwzLqNzlR0iY5cDRR5Dgg7WQwkyxYIq6HfwN9pb5QGpRr7VewlOMIispqJo9JQN1SqfXPwv1SrEn%2BeARyr%2BxnlGlr7vJN%2FJGewy7IZLZUDbNjJe1iNYJJDCtk%2FzhFhoolYBf%2BzsTp2KaFU2AcetL98zcrfQi69pOGjCayHFWUAMBuaezPsmkU%2BTiqz%2BsP%2BgkuitumapoRilwWmNhCTcO63JzQMg%3D%3D",
    ]
    const appleImages = [
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/tg3ic9isjuinom0t8ktz5c/cfzk28yslxq8ze4vhlit.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=Y9A2V0qgw6vk7%2F0cBB%2BqW3DrhBWqU9QGy3XWmL68tJPfEI%2Fh%2BsOhWBQgmNJVqYFCeyD%2Fi2AWyOj78hVzi4wtjYcsDtopsfh3%2FzZuV4FbluVsnE1%2FZgfgW0vLiiHr2Up1Vt5cHIgtyIfcFvua0pSVnwvVBGUPJDMMlcNGVxyJKcT%2FpzHBT%2BH1OPGyOMJflS%2BdKjyUk%2F%2BdLVXq%2B0bSSz5wNZfAMVKfH7ozQWxpw2AyWRbK2NAtv%2B15fqPoe%2B9n6GHFAgEvOGo1IdR%2FHAvebpcz8S84I2eafAZ4Y%2FxgTtcgd0Sg%2BnkV2hnjfc9waeC9KriEFtIxJedLB3hAuqHQVRtlAA%3D%3D",
    ]
    const appleResizedImage = [
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/tg3ic9isjuinom0t8ktz5c/cfzk28yslxq8ze4vhlit_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=e34jreFTRpNpSK3BrC2ZrGGHWn1rth3xYQx1%2ByLGOu1BnSFIt6m3ExGyRMTBRumhcHkATK1EotiF%2Fsbu7E991rDKpCqajqLvGjIvf3DnNdw0U5sag7oBBqt7YfzwA2ovaZNHO0phbU53dv0BujgWZuxmh6HjTEFRidsQzgVWRPkgDBol5Pnq8OX5hpukpfVVcB3MnAH%2FvlOFk585%2BfR4JQ0INjeTxqRDfjHk1%2Ffe23vMeKSOPVE33wyDvJI8P0J6FZhM66sKcP%2FAqZqVY7qDkj80bpjWASftMo0eYtj5EVpRj%2FHzfZpsCvK0BbK9MmtwVMuNSuPRWXBvFTfb83uy3A%3D%3D",
    ]
    const prodTypes = {
        "Wine Grapes" : "Merlot",
        "Table Grapes" : "Red Globe",
        "Apples": "Ambrosia",
    }
    if(adType.value == 'seller') {
        for (const seller in sellers) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const chosenProduct = Object.keys(prodTypes)[Math.floor(Math.random() * Object.keys(prodTypes).length)];
            const images = []
            const resizedImages = []
            if (chosenProduct == "Wine Grapes") {
                images.push(grapeImages[Math.floor(Math.random() * grapeImages.length)])
                resizedImages.push(resizedGrapeImages[Math.floor(Math.random() * resizedGrapeImages.length)])
            } else if (chosenProduct == "Apples") {
                images.push(appleImages[Math.floor(Math.random() * appleImages.length)])
                resizedImages.push(appleResizedImage[Math.floor(Math.random() * appleResizedImage.length)])
            } else {
                images.push(chardImages[Math.floor(Math.random() * chardImages.length)])
                resizedImages.push(chardResizedImages[Math.floor(Math.random() * chardResizedImages.length)])
            }
            const ad = {
                adType: adType.value,
                biddingEndTime: Timestamp.fromDate(tomorrow),
                createdAt: Timestamp.fromDate(new Date()),
                expectedHarvestDate: Timestamp.fromDate(new Date()),
                id: `testad_${Math.floor(Math.random() * 1000000)}`,
                images: images,
                resizedImages: resizedImages,
                live: true,
                type: chosenProduct,
                uid: sellers[seller].uid,
                variety: prodTypes[chosenProduct],
                yieldTonnage: 100,
                postedOn: Timestamp.fromDate(new Date()),
            }
            const updateStoreFront = {
                createdAt: Timestamp.fromDate(new Date()),
                id: sellers[seller].uid,
                name: sellers[seller].name,
                samples: arrayUnion({
                    adId: ad.id,
                    image: ad.images[0],
                    name: ad.variety,
                }),
                updatedAt: Timestamp.fromDate(new Date()),
            }
            const adRefMain = doc(db, AD_COLLECTION, sellers[seller].uid);
            await setDoc(adRefMain, updateStoreFront);
            const adRef = doc(db, AD_COLLECTION, sellers[seller].uid, AD_COLLECTION, ad.id);
            await setDoc(adRef, ad);
        }
    } else if ( adType.value == 'buyer') {
        for (const buyer in buyers) {
            const chosenProduct = Object.keys(prodTypes)[Math.floor(Math.random() * Object.keys(prodTypes).length)];
            const ad = {
                adType: adType.value,
                biddingEndTime: Timestamp.fromDate(new Date()),
                createdAt: Timestamp.fromDate(new Date()),
                requestDate: Timestamp.fromDate(new Date()),
                id: `testad_${Math.floor(Math.random() * 1000000)}`,
                uid: buyers[buyer].uid,
                type: chosenProduct,
                variety: prodTypes[chosenProduct],
                yieldTonnage: 100,
                price: 100,
                live: true,
                postedOn: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date()),
                status: 'pending',
            }
            const adMainRef = doc(db, AD_COLLECTION, buyers[buyer].uid);
            await setDoc(adMainRef, {id: buyers[buyer].uid})
            const adRef = doc(db, AD_COLLECTION, buyers[buyer].uid, AD_COLLECTION, ad.id);
            await setDoc(adRef, ad);
        }
    }
    isLoadingAds.value = false;
}
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
                buyerId: buyers[Math.floor(Math.random() * buyers.length)].uid,
                price: Math.floor(Math.random() * 1000),
                createdAt: new Date,
                updatedAt: new Date,
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
    for ( const user in users) {
        for ( let i = 0; i < parseInt(jobAmount.value); i++) {
            const job = {
                createdAt: new Date(),
                description: "test",
                jobId: `testjob_${Math.floor(Math.random() * 1000000)}`,
                live: true,
                location: "test",
                posterId: users[user].id,
                salary: 100,
                tasks: ["test", "test"],
                title: "Test",
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
                createdAt: new Date(),
                description: "test",
                gigId: `testgig_${Math.floor(Math.random() * 1000000)}`,
                live: true,
                location: "test",
                posterId: users[user].id,
                milestones: [{title:"test", price:100}, {title:"test2", price:200}],
                title: "Test",
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
    const q = query(collection(db, AD_COLLECTION), where("id", ">=", "test_"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => {return {data:doc.data(), id: doc.id}});
    const promises = [];
    for (const user in users) {
        const adRef = doc(db, AD_COLLECTION, users[user].id);
        promises.push(deleteDoc(adRef));
    }
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
    const q = query(collection(db, JOBS_COLLECTION), where("id", ">=", "test_"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => {return {data:doc.data(), id: doc.id}});
    const promises = [];
    for (const user in users) {
        const jobRef = doc(db, JOBS_COLLECTION, users[user].id);
        promises.push(deleteDoc(jobRef));
    }
    await Promise.all(promises);
    isLoadingDeleteJobs.value = false;
}
const isLoadingDeleteGigs = ref(false);
const deleteGigs = async () => {
    isLoadingDeleteGigs.value = true;
    const q = query(collection(db, GIGS_COLLECTION), where("id", ">=", "test_"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => {return {data:doc.data(), id: doc.id}});
    const promises = [];
    for (const user in users) {
        const gigRef = doc(db, GIGS_COLLECTION, users[user].id);
        promises.push(deleteDoc(gigRef));
    }
    await Promise.all(promises);
    isLoadingDeleteGigs.value = false;
}
</script>