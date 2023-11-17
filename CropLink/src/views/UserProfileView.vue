<template>
    <div class="grid grid-cols-2 gap-x-4 p-5">
        <span>
            <h1>User Profile</h1>
            <div v-if="profile">
                <h2>{{ profile.name }}</h2>
                <img :src="profile.profilePic" class="w-32 h-32 object-cover rounded-full" />
            </div>
            <div v-else>Loading...</div>
            <div>
                <div>
                    <h2>Change Profile Pic</h2>
                    <input type="file" @change="onFileChange" ref="profilePic" name="profilePic"/>
                </div>
                <div>
                    <h2>Change Banner Pic</h2>
                    <input type="file" @change="onFileChange" ref="bannerPic" name="bannerPic"/>
                </div>
                <button :disabled="!hasChanged" @click="onAcceptProfileChanges">Accept changes</button>
            </div>
        </span>
        <EscrowAccountComponent v-if="profile?.accountType == ACCOUNT_TYPES.SELLER"/>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, doc } from 'firebase/firestore';
import type { Profile } from '@/types';
import EscrowAccountComponent from '@/components/userboard_components/EscrowAccountComponent.vue';
const { profile, user } = storeToRefs(useMainStore());
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
let stopUserProfileSubscription: any;
const profileChanges = ref({
    profilePic: null,
    bannerPic: null
})
onMounted(()=>{
    stopUserProfileSubscription = onSnapshot(doc(db, import.meta.env.VITE_USERS_COLLECTION, user.value.uid), (doc) => {
        profile.value = doc.data() as Profile;
    });
})
onBeforeUnmount(()=>{
  if(stopUserProfileSubscription) stopUserProfileSubscription();
})
const hasChanged = ref(false);
const onFileChange = (e:any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if(e.target.name == 'profilePic') {
            profileChanges.value.profilePic = reader.result as string;
        }
        if(e.target.name == 'bannerPic') {
            profileChanges.value.bannerPic = reader.result as string;
        }
        hasChanged.value = true;
    }
}
const isLoadingProfileChanges = ref(false);
const onAcceptProfileChanges = async () => {
    isLoadingProfileChanges.value = true;
    hasChanged.value = false;
    const deepCopy = JSON.parse(JSON.stringify(profileChanges.value));
    deepCopy.profilePic = profileChanges.value.profilePic ? profileChanges.value.profilePic.split(",")[1] : null;
    deepCopy.bannerPic = profileChanges.value.bannerPic ? profileChanges.value.bannerPic.split(",")[1] : null;
    await useMainStore().updateProfileChanges(deepCopy);
    isLoadingProfileChanges.value = false;
}
</script>