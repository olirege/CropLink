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
            bannerPic: "https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/ras12lb8s8kv2aslq40yts.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=ZGEpqIyWZkJmOLmXVry9i0PNlWujFNbnt6o7647O9q513re1a4HedY%2FqJekzrO%2FTq9nnaZMT8wYvUnPRgXgeaBP9Z1h8%2Bz8i8RyU0n5bSjffMa1iy7Oe%2BiliP3JSl%2Fg4kpF9RfzwEzg9%2B%2BZFPBPi8HOqj4X7SEZaV998agkAsLLf7EBFFI2Ys3BEbjkUGMquPrqCqvhD8a3k3O0a7qmCi57216upo4FntpKIB9LomCA0oV5uwEjWWAEJUOwYrzaeclm47o5m3DkuZYw6rWvnaqwMfEUeyqiRrbufg3Qf2KDL2wpkl4%2FJE034%2BRsaL8Njmaz2xG8%2BWnhNzVzDbTUp0w%3D%3D",
            bannerPicResized: "https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/ras12lb8s8kv2aslq40yts_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=Zti%2BO9bCxwmxnqntf9o2kPcoytuqPv1yDGD6NP9WJH0XA8E3xeOt1DpXWqmNSp5wVfdLRk0JHMVn5yxc96Biqo60R%2BGo78N%2By8ANpA4Ykr1BtKPFWgjEXiSQN5%2B90nM%2F2rAp4lzK8P6irvxA9EP7M9K8qlPzEk3T6V6A9aSnxg8YwGbeRGKxYtBRJjCTVWcaX8%2BjAzr1h%2F75dc%2F44NdV1aVHIJPhMejptTSfVDsRznxc66kV%2FKktqQGmKTdUhB1U%2Blm4UdoE%2BwNbmFhZFMvSeaE9Py88gS1%2Bm3huJydnrK9Sn%2BV5IOzzvjGOCBjGInpFT%2FlxaDk2mXTQJ%2B5K8mV0IQ%3D%3D",
            profilePic:"https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/jeqpf4y5jihv4t9kqklev.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=LrBQG5guNSMU9HmRKOvek%2Fqg6N3faRi9vyr1fw6Dbdg33uzVjLKyYfCt2ndjmLh%2BKIsM6BrnpMETDebSPWNzBYmwiKk8R1JxJS4nbvDXDLIS5iXMd93OD5xN0EblIaWbPegVI8Lw4ES10yc3K50FreMKIPH%2B%2FbVy3tdovvVid3E3kl%2BLs87AExzn5xDPSaStgH4vk5B00luNYZHHl3Rk7qMZRCuWD2c9%2FuKpt5mTj3DA2IldSoG5WnZer0ROG%2FYDflxP0FvuscbKErmnRw8WuytDe2h27fdnMUNgvT91D91HZDDlxzFAMGmQZli4gH0Qjic2vqv79iP3d%2Fncngn5Zg%3D%3D",
            profilePicResized:"https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/jeqpf4y5jihv4t9kqklev_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=L6EHLJoBgQQLALl0j%2F9gY38coLRTYKPJot3KjyrmoKrN8HDEejjV5gBSO%2FkrRAQkXc4Y7SmceRpngOX9Cgzho%2BJ2HNhMnWRfCRDXROlysF1m4mimhnspEFenqRq6S12edhB88DoPe6nQt5qd3%2BGHP90kfsj7kqgtYwFxLs2x7yxDzzIvO5dBo%2BR0O8LOb4Ezac5StajIWQm%2FBI7XHGKCXiwP8%2FomNSYOzn2DzSh8cfMnor3daGzw%2BPy5OCAqIoqiGrL0lU2yYm7zRl739gUymFh%2FpY1U080DalGd25UZLQ4zvJqBdZ90XQicLXWDxRqUxR86TMKFqHjlz0dm5K5lng%3D%3D",
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
    const peachesImages = [
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/1jo9urte104vierqy8g1qk/7i34d956gv6guoebpb6x67.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=OKXXrjhdNSe0hRCaYT8rou4%2BnfpGhForcDunxdqxHLjz94BeNvOqMnI3tpcdCIQrqlMJk1OCaay2wUgSKmCZIEIJ4eRhV6SwJKoRplyvL1GFbVzcqPeTrVYEosWsw%2FFOoxiK5iesIWkmUfxaAPofWTNWQXxPWTLEtNUb0FW00fsQN8vpBN9leicxZfwrhLDtAszlUtWtk0Kgq33Wss8qvTZOUV6gZgJLHZ%2FkbGBp5v5ogAB2s%2FenzyVbhBABz7bg%2BJdVOReBpJUMad4jRn8d1k2%2FP1ITLWJxpQT%2BBhj4U%2Fb5pLFo5V6IlW2sgkmPKPGnEH%2B42K6g4Y9jW5i9Z197Tw%3D%3D"
    ]
    const peachesResizedImage = [
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/1jo9urte104vierqy8g1qk/7i34d956gv6guoebpb6x67_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=N8XusCnld8bbIn5dJMzlUZBa8PWFD%2FrKsEv9sAwm6xadPylpyrMmNuPbWJrA89JcY1J%2BW0M8ygAbNtnndQM95E9jO%2FXQMVFDQOcjncobHHSDcSIsRqNJ1JGnZm9comjXTbVtAtq6vOaEMsEv61To6f0WGT%2FQZ9v3tczKi3DZ5xJEccc%2FkDLb3TVWHU2Ti2H0T4DTKtuVni2p5uhBCxd9pxYVDZuow7zkEI2o5iGzlz19zYmHImJyuT6nkQ%2BlI10qRrSTNNhbI80CSUBoBHURl86EBbya1kRfU74JwPlbAHWfyrgVyB5AvudHkbn%2FoV%2FcpGXbxxRLb4ukFvcuOj0V8g%3D%3D"
    ]
    const pearsImages = [
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/4vs07qcrsat77ennuwjufd/nd2fyfb91v1zqv70ijaaq.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=cdm%2BBpIKQ0OpzPPnZThsmjBG7%2FSQN2aJZuesmXfq7H%2FXP1i3wfFVFH5rIB9TFPtd8Mer4Q%2FvlGFjlb2uYwdqj8uc4ZWPvEN9CShAPNn54p6uAfXV7qtpwQ00%2Ftcc574Zt4ZmfDYGAKvlSRWYQuRFOpOuVD9aefe4hK8kZdEVfXs6Tq8ofEGOKwnSVs4y72nQM1V%2Bc%2BIjdSwPnEbfjw36dNi%2BWbHI7O0ZenCurQNwGZ8zs87otmJG3JyVMI7QFkrGMPXtgFwV1Vn87iz%2B%2BhXZUe1WeiTpvrZEjfSqCmNAKsSCcErkL6d0ABCVEk9MFOcf7PHA%2BV06NSc4viq01n202A%3D%3D"
    ]    
    const pearsResizedImage = [
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/4vs07qcrsat77ennuwjufd/nd2fyfb91v1zqv70ijaaq_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=YZIAmzklJJ9SulzoL%2Bn2j%2BN8MmgMzSw0oP0drULWuRU%2F%2FDDWZRMySgnr4EiacyH5yDI9kfgMIaToRM5GsRGFMzhaUiNRPRCr1ceBwoG0B%2B4E82RJkwhwrYg7HmFkZ0qJts4wGse70y0EuUfw78L9xpAtj3q9RdQFwHH5wloBQNWWm3LLxxVkbz5nZHNL%2BfGKIMfol5eXLvpZZZBW0ogo5AQqy3BdZ%2FtUV80gGQhkjKaDFq8PorlmdnL%2BUvIzVVYJvSs1gPCd%2BMZ1vI1FGhqfkJvQ6DVAUddGkWNabkQJVUI0VQY%2FRjPuEIjy566EnpWkO03%2BV038HcVJC5ThZhxaqQ%3D%3D"
    ]
    const strawberriesImages = [
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/z6xf1cd1ocdnh63xk417q8/9nv98lxcax1v7kml7jj.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=A1xloeYiFrQdm%2FHSbJD6ldN%2BKnNO7mYH8LMWiuElSF7x%2B7H8WRYVjcUJ5%2FdLG5oMKCqcY6QbZts2A8sXHULv3zPRemh1G8Oo50rT7FDhlm5u1Hf8%2B%2FFH6mPDPB2%2BBvRPUfnkBi%2BeNAK5tsFreiIFivlUqilazCBS5SpRtVt9a%2Fdq5AOwXxHBMjA8xDY1%2FV%2B8EHJwOELj8VOfKDUragAvEX5DZmAQqttG3G0hNg%2B6VbvjyfeTaNcM%2BLawfVts4518HXyYts8ynVEcBSfuTymvboT0U5qePsP5c%2FaddAgHCFveUp1pg5lpSccA%2Bbiyfm085b7vhz0iz1J5dJjdYzVxWA%3D%3D"
    ]
    const strawberriesResizedImage = [
        "https://storage.googleapis.com/croplink-30e3c.appspot.com/ads/jnxX7x0PwlfjDKFt7GTVUNQQN533/ads/z6xf1cd1ocdnh63xk417q8/9nv98lxcax1v7kml7jj_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=duRbVnGPI6MLXPDgBKsQUFZIhDb3fupJulhHaFqJj%2FniaRw77qw2yRvOWPzFDA4qot%2FW6Q6bDZl0epixmgfh26n%2B8ehn7xC0gUxkKOODr63AinCgyN4qdCVXDQ%2FIwZAjj9lInerUPH%2BBul2mjIU663mfe2%2FXMiovMRKQuua4NayuCVOAqsGR2WLt%2FbI7oXlzGY6Wb0i%2BG6zzHvKw0Yez%2BqKxH6gaqMCk%2FndNrESwCxWdVESSbdzq8jqjaOP2NO9q3T7AbnHdlwPyiVznIR3%2BnYL3nH0DgBxw1aUdyb1rVnd%2BPa0Qo9fFmks%2BjSfjtxveHFwEU8YT6AfZOV5cApL02g%3D%3D"
    ]
    const prodTypes = {
        "Wine Grapes" : "Merlot",
        "Table Grapes" : "Red Globe",
        "Apples": "Ambrosia",
        "Peaches": "Glohaven",
        "Pears": "Anjou",
        "Strawberries": "Albion",
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
            } else if (chosenProduct == "Peaches") {
                images.push(peachesImages[Math.floor(Math.random() * chardImages.length)])
                resizedImages.push(peachesResizedImage[Math.floor(Math.random() * chardResizedImages.length)])
            } else if (chosenProduct == "Pears") {
                images.push(pearsImages[Math.floor(Math.random() * chardImages.length)])
                resizedImages.push(pearsResizedImage[Math.floor(Math.random() * chardResizedImages.length)])
            } else if (chosenProduct == "Strawberries") {
                images.push(strawberriesImages[Math.floor(Math.random() * chardImages.length)])
                resizedImages.push(strawberriesResizedImage[Math.floor(Math.random() * chardResizedImages.length)])
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
                yieldTonnage: Math.floor(Math.random() * 100),
                price: Math.floor(Math.random() * 100),
                postedOn: Timestamp.fromDate(new Date()),
            }
            const updateStoreFront = {
                createdAt: Timestamp.fromDate(new Date()),
                id: sellers[seller].uid,
                companyName: `Test Company_${Math.floor(Math.random() * 1000000)}`,
                companyEmail: `test_${Math.floor(Math.random() * 1000000)}@test.com`,
                companyWebsite: `https://test_${Math.floor(Math.random() * 1000000)}.com`,
                verifiedSeller:  Math.random() >= 0.5,
                samples: arrayUnion({
                    adId: ad.id,
                    image: ad.images[0],
                    name: ad.variety,
                }),
                bannerPic: "https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/ras12lb8s8kv2aslq40yts.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=ZGEpqIyWZkJmOLmXVry9i0PNlWujFNbnt6o7647O9q513re1a4HedY%2FqJekzrO%2FTq9nnaZMT8wYvUnPRgXgeaBP9Z1h8%2Bz8i8RyU0n5bSjffMa1iy7Oe%2BiliP3JSl%2Fg4kpF9RfzwEzg9%2B%2BZFPBPi8HOqj4X7SEZaV998agkAsLLf7EBFFI2Ys3BEbjkUGMquPrqCqvhD8a3k3O0a7qmCi57216upo4FntpKIB9LomCA0oV5uwEjWWAEJUOwYrzaeclm47o5m3DkuZYw6rWvnaqwMfEUeyqiRrbufg3Qf2KDL2wpkl4%2FJE034%2BRsaL8Njmaz2xG8%2BWnhNzVzDbTUp0w%3D%3D",
                bannerPicResized: "https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/ras12lb8s8kv2aslq40yts_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=Zti%2BO9bCxwmxnqntf9o2kPcoytuqPv1yDGD6NP9WJH0XA8E3xeOt1DpXWqmNSp5wVfdLRk0JHMVn5yxc96Biqo60R%2BGo78N%2By8ANpA4Ykr1BtKPFWgjEXiSQN5%2B90nM%2F2rAp4lzK8P6irvxA9EP7M9K8qlPzEk3T6V6A9aSnxg8YwGbeRGKxYtBRJjCTVWcaX8%2BjAzr1h%2F75dc%2F44NdV1aVHIJPhMejptTSfVDsRznxc66kV%2FKktqQGmKTdUhB1U%2Blm4UdoE%2BwNbmFhZFMvSeaE9Py88gS1%2Bm3huJydnrK9Sn%2BV5IOzzvjGOCBjGInpFT%2FlxaDk2mXTQJ%2B5K8mV0IQ%3D%3D",
                profilePic:"https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/jeqpf4y5jihv4t9kqklev.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=LrBQG5guNSMU9HmRKOvek%2Fqg6N3faRi9vyr1fw6Dbdg33uzVjLKyYfCt2ndjmLh%2BKIsM6BrnpMETDebSPWNzBYmwiKk8R1JxJS4nbvDXDLIS5iXMd93OD5xN0EblIaWbPegVI8Lw4ES10yc3K50FreMKIPH%2B%2FbVy3tdovvVid3E3kl%2BLs87AExzn5xDPSaStgH4vk5B00luNYZHHl3Rk7qMZRCuWD2c9%2FuKpt5mTj3DA2IldSoG5WnZer0ROG%2FYDflxP0FvuscbKErmnRw8WuytDe2h27fdnMUNgvT91D91HZDDlxzFAMGmQZli4gH0Qjic2vqv79iP3d%2Fncngn5Zg%3D%3D",
                profilePicResized:"https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/jeqpf4y5jihv4t9kqklev_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=L6EHLJoBgQQLALl0j%2F9gY38coLRTYKPJot3KjyrmoKrN8HDEejjV5gBSO%2FkrRAQkXc4Y7SmceRpngOX9Cgzho%2BJ2HNhMnWRfCRDXROlysF1m4mimhnspEFenqRq6S12edhB88DoPe6nQt5qd3%2BGHP90kfsj7kqgtYwFxLs2x7yxDzzIvO5dBo%2BR0O8LOb4Ezac5StajIWQm%2FBI7XHGKCXiwP8%2FomNSYOzn2DzSh8cfMnor3daGzw%2BPy5OCAqIoqiGrL0lU2yYm7zRl739gUymFh%2FpY1U080DalGd25UZLQ4zvJqBdZ90XQicLXWDxRqUxR86TMKFqHjlz0dm5K5lng%3D%3D",
                updatedAt: Timestamp.fromDate(new Date()),
                staffNumber: Math.floor(Math.random() * 100),
                acreage: Math.floor(Math.random() * 100),
                plants: [
                    {'name': 'Apples', 'variety': 'Ambrosia', 'amount': Math.floor(Math.random() * 3000)},
                    {'name': 'Peaches', 'variety': 'Glohaven', 'amount': Math.floor(Math.random() * 3000)},
                    {'name': 'Pears', 'variety': 'Anjou', 'amount': Math.floor(Math.random() * 3000)},
                    {'name': 'Strawberries', 'variety': 'Albion', 'amount': Math.floor(Math.random() * 3000)},
                    {'name': 'Wine Grapes', 'variety': 'Merlot', 'amount': Math.floor(Math.random() * 3000)},
                    {'name': 'Table Grapes', 'variety': 'Red Globe', 'amount': Math.floor(Math.random() * 3000)},
                ],
                capabilities: [
                    'Harvesting',
                    'Pruning',
                    'Planting',
                    'Packing',
                    'Weeding',
                    'Fertilizing',
                    'Spraying',
                    'Irrigation',
                    'Tractor Work',
                    'Machinery Work',
                    'Other',
                ],
                machinery: [
                    'Tractor',
                    'Sprayer',
                    'Forklift',
                    'Loader',
                    'Other',
                ],
                shipping: [
                    {'distance': Math.floor(Math.random() * 100), 'type': 'Trailer', 'weight': Math.floor(Math.random() * 1000)},
                    {'distance': Math.floor(Math.random() * 100), 'type': 'Truck', 'weight': Math.floor(Math.random() * 25000)},
                ],
                rating: Math.floor(Math.random() * 5),
                reviewsCount: Math.floor(Math.random() * 100),
                location: "Kelowna, BC",
                storeImagesResized: [
                    "https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/hss4y9uo6rd3bsf7yezo6g_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=aOdp0f9iLBxaVAbofZJLnM2gAHEX4Rk3AXkd%2FzYKYTplPCtW%2FR%2BvLIJE9pXFcvfJY34fdcZIdSY%2Feb3Kx2pMYJkDNeWU0kUseIwLlEXNRNxlT3N%2BUZMI2ya5r%2FJ9vmOgSQfZWSmysAeOlZ%2BvnI2C8JE2FngsdrnTSveHwVEFlAkPVCdm1S4kevspUMeXU7%2BmKpNcOO6WJxcMb4qlOSQhYyyOIvNTD%2B%2F3lIgrXrbecM22qOcd0gFqAeRwqqPqx2AoEVvj9Fi8h%2BHv2m5YfEO7CktHNFk%2B93iYc6S7bMD8EAVSu3kuRPsLLRiafWyon2F8VODCONRp7HhZu2EHd%2BNAZw%3D%3D",
                    "https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/1h4sjkq3hi9glkv6lmyfnt_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=b98k5ij%2BZ%2Fk0PoXOzqJFJgsZygV1SBA%2BBwF8nUdErB%2F9W0mPN9J%2F3S3GdDqr5%2FNmJZ3dc11ksZkYSj6WhM2VzPD4J%2BoN5OfDZyUtHCXTHgwyJh%2BcXlwP3tDgA%2FPCN7Dq3wgogZZVNx7yc88L0EbdvVxeX9ChQ8XOW9BA7xDyCrWygQgFMoAAA%2BAcUkwTD8i75gqWYmqj4ofTSk66yYc5QCAUwkEeIOfQMcUACpeexxlzcWFwjxT6m%2FlneijtGu4hOiBL0Rs2WipG%2FziY1wso%2BRL2hM1LXE3mdYlL9KVjqNlBOh5%2FRu49wbaIx8G5Zb%2F6KqjxmKpv0BUPGfJpqOKmNg%3D%3D",
                    "https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/vii3nnqako7ki5ezc6ajvs_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=SjIsW7Aq9suoKodCgSsIGcxoHSoe5BuiP248Znww5zQSQD766gVl2kAPGTPf6gcWJ38XeeY2tYEsXudgYauswy25IVNQrQTGDm2W6Eh6nYjWM3D3ltpEexnFdm87Dna8O%2FcYeHqWt9J4ootEezkYGXXjYViyFWlpPZzo7H%2FIn0cogK9z2rZAvCoXABA3bhjcyQWSBxqs0juiQ7p0dAIqim4U6igxQScvJbSyfSlorGxyKDeTi1GpTfq7Y4ih4d5rYUE3rrUBnaSabeGQsFsYvZsyoq1bIV0guP0HqNwFzHuIzsKpk%2FOZGBiPT%2F1qzigWMh0Wijt4fx7TkBq8iaxDEA%3D%3D",
                ],
                storeBannerPic: "https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/vf5b8hmz5atuihfweh24q.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=Bb%2FQFPT9a7TlnNhU9X4MxOyAKSRK%2B20ckrPG7CAPyBhTuQSzMOGyekMjmPOaVOTiCTHgo4z1VySptDkUxkyM6DK%2BWQ2YQjvbFb7JZQ2pAHPrGv%2FAxVTHrwoQK%2BbCHks9AOBtDLRRg2rY0qr%2FdR921ImG2E8MsTL8tiNfoTRF2CNJ8G023dwZssXsgzWSpAEZH%2BPJODCz10CJ%2F2YDUUfB%2B93rhuuAT5Dp33Ehf%2FIS%2FCbFlYDKHORpDEJhfRv%2FyG1adP10RKASeZU4s%2FKB9OpmvL7Mf9n2qOAiBeZgLrzoUF7RHHYWYYGgmLICZ%2BGWR5BMBen0N07F4Km16VDKuP%2Fz4w%3D%3D",
                storeLogo: "https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/64h8oqa261ty25hiu149i.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=UJS7uxjBz2N%2FuWol5Au8bjZkb0mVJdkvl5pkoHhWw9Ofa8%2FkPpHN5MalQMnYvJcLZgtJXS5xM8g3NQTLBwQYoIxXFf6eGq%2BJkRJ%2FSAySszBrkaUL%2FR0tVlRa2Dm5kSYK4YsHHkH9272lGiJWL56v1NiMAnprRy7OtrhWW8vM%2BifzTzzah7ET%2Fj6%2FV8GVyj0UO%2FxP3XAqIugukqt7zZUq3%2BzAXyLKPnxtC9JOMX0X1S2%2B8QBjobTYjKvdpjHrEVE6Y6nG00YNz2GkHpUo3UYoanrm0x%2Bw0tjtZmtqicuG3VmjlHQr95Bl0QF77gqc8lYBjPcED7nzKLMRRykuEd7tFg%3D%3D",
                storeLogoResized: "https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/64h8oqa261ty25hiu149i_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=kIZP4MylTu6QJ%2F9Mn1TrcwlZzEukFLzQzQxWZCRdpDgJCzlm9oKmtCo%2B2XfJur%2FUlOXOj4Uh82PUNQWp7JcMOd36OZhSkQN%2FBi7Tf8vfgeJxa31kB2bAZkNuL08KhW8yDsW13b0vkcN40QAQB0V0zNvtUJXMLYNoO6wyi5fJmQKdQAgMugVrndTnJuUBhIu37zWKTrfxSzDuhRegjoJ4VoQj6JT8l1IZLnb%2BCctDhVUXrXXBsn7xw2zc3x0hhA40RoBgjl8wvbM9IV6HCB4JnxvaekrNZgqcKbDAZSOXlUMpAMiwlRKOXb13vtT8Nuaawv6VflBjyBCEJXDmc%2FR0YA%3D%3D",
                storeBannerResized: "https://storage.googleapis.com/croplink-30e3c.appspot.com/users/jnxX7x0PwlfjDKFt7GTVUNQQN533/vf5b8hmz5atuihfweh24q_resized.jpg?GoogleAccessId=firebase-adminsdk-wxai1%40croplink-30e3c.iam.gserviceaccount.com&Expires=1899936000&Signature=iT6eHAjaNw7attFistnBnU8vSAJIP78dwNCz%2FnfiIXnRJ4Zv7Xy9drjALLMwpF5dLKDbo18rSPUS8PFCjA79gK8i7fO0VzMfOuKY%2BKC%2F5V4I7U00IRR6LFRUWtM7PuEdnolaR0HT7CMJWWGbyzRiutY6L4xRqe5X%2BhEi4512rGAwzbYgWwAcOX0NqxFVgEDq6ILjVyFnBvheMPUMGL0MCJRP3SVs%2B25G42XSthddUw%2BB2wcAAvONEpO17DPo4GxWLmz1XBA1JoF%2BkjokoNmHJmncJnl38onqjtZJFGUJtakt%2FLLcIqeaS8wNGROXiPRtRfsoUtboTvuLfycR6hYhJw%3D%3D",
            }
            const adRefMain = doc(db, AD_COLLECTION, sellers[seller].uid);
            await setDoc(adRefMain, updateStoreFront, {merge: true});
            const adRef = doc(db, AD_COLLECTION, sellers[seller].uid, AD_COLLECTION, ad.id);
            await setDoc(adRef, ad);
        }
    } else if ( adType.value == 'buyer') {
        for (const buyer in buyers) {
            const chosenProduct = Object.keys(prodTypes)[Math.floor(Math.random() * Object.keys(prodTypes).length)];
            const minCostPerTon = Math.floor(Math.random() * 100);
            const maxCostPerTon = minCostPerTon + Math.floor(Math.random() * 100);
            const ad = {
                adType: adType.value,
                createdAt: Timestamp.fromDate(new Date()),
                id: `testad_${Math.floor(Math.random() * 1000000)}`,
                uid: buyers[buyer].uid,
                type: chosenProduct,
                variety: prodTypes[chosenProduct],
                minCostPerTon: minCostPerTon,
                maxCostPerTon: maxCostPerTon,
                tons: Math.floor(Math.random() * 100),
                certifiedOrganic: Math.random() >= 0.5,
                verifiedBuyer: Math.random() >= 0.5,
                offersShipping: Math.random() >= 0.5,
                live: true,
                postedOn: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date()),
                status: 'pending',
                location: "Kelowna, BC",
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
                sellerId: sellerAds[ad].uid,
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
    const salaryMin = Math.floor(Math.random() * 100000);
    const salaryMax = salaryMin + Math.floor(Math.random() * 100000);
    for ( const user in users) {
        for ( let i = 0; i < parseInt(jobAmount.value); i++) {
            const job = {
                createdAt: new Date(),
                description: "test",
                jobId: `testjob_${Math.floor(Math.random() * 1000000)}`,
                live: true,
                location: "test",
                posterId: users[user].id,
                salaryMin: salaryMin,
                salaryMax: salaryMax,
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
    const qStore = query(collection(db, AD_COLLECTION), where("id", ">=", "test_"));
    const querySnapshot = await getDocs(qStore);
    const users = querySnapshot.docs.map(doc => {return {data:doc.data(), id: doc.id}});
    const promises = [];
    for (const user in users) {
        const adRef = doc(db, AD_COLLECTION, users[user].id);
        promises.push(deleteDoc(adRef));
    }
    const qAds = query(collectionGroup(db, AD_COLLECTION), where("id", ">=", "test_"));
    const querySnapshotAds = await getDocs(qAds);
    const usersAds = querySnapshotAds.docs.map(doc => {return {data:doc.data(), id: doc.id}});
    for (const user in usersAds) {
        const adRef = doc(db, AD_COLLECTION, users[user].id);
        promises.push(deleteDoc(adRef));
    }
    const qBids = query(collectionGroup(db, BIDS_COLLECTION), where("id", ">=", "test_"));
    const querySnapshotBids = await getDocs(qBids);
    const usersBids = querySnapshotBids.docs.map(doc => {return {data:doc.data(), id: doc.id}});
    for (const user in usersBids) {
        const bidRef = doc(db, BIDS_COLLECTION, users[user].id);
        promises.push(deleteDoc(bidRef));
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