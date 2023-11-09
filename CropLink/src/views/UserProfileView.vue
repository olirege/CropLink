<template>
    <div class="grid grid-cols-2 gap-x-4 p-5">
        <span>
            <h1>User Profile</h1>
            <div v-if="profile">{{ profile  }}</div>
            <div v-else>Loading...</div>
        </span>
        <EscrowAccountComponent v-if="profile?.accountType == ACCOUNT_TYPES.SELLER"/>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { db } from '@/firebase/main';
import { onSnapshot, doc } from 'firebase/firestore';
import type { Profile } from '@/types';
import EscrowAccountComponent from '@/components/userboard_components/EscrowAccountComponent.vue';
const { profile, user } = storeToRefs(useMainStore());
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
let stopUserProfileSubscription: any;
onMounted(()=>{
    stopUserProfileSubscription = onSnapshot(doc(db, import.meta.env.VITE_USERS_COLLECTION, user.value.uid), (doc) => {
        profile.value = doc.data() as Profile;
    });
})
onBeforeUnmount(()=>{
  if(stopUserProfileSubscription) stopUserProfileSubscription();
})
</script>