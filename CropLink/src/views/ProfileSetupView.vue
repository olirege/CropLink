<template>
    Profile Setup
    <div v-if="isLoading">Loading...</div>
    <div v-else>
        <input type="text" v-model="profileData.name" placeholder="Name">
        <label for="accounts">
            Select your account type
        </label>
        <select id="accounts" v-model="profileData.accountType">
            <option :value="option.value" v-for="option in options" :key="option.name">{{ option.name }}</option>
        </select>
        <button @click="continueSignup" :disabled="!profileData.name || !profileData.accountType">Continue</button>
    </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
const { isNewUser } = storeToRefs(useMainStore());
const router = useRouter();
const profileData = reactive({
    name: "",
    accountType: ""
});
const isLoading = ref(true);
const continueSignup = async () => {
    if(profileData.name === "" || profileData.accountType === "") {
        return;
    }
    isLoading.value = true;
    try{
        await useMainStore().continueSignup(profileData);
        router.push({name: "userboard"});
    } catch(e) {
        console.error("Profile setup", e);
        isLoading.value = false;
    }
}
const options = [
    {
        name: "Seller",
        value: "seller"
    }, {
        name: "Buyer",
        value: "buyer"  
    },
    {
        name: "Employer",
        value: "employer"
    },
    {
        name: "Employee",
        value: "employee"
    },
    {
        name: "Bank",
        value: "bank"
    }
]
onMounted(async () => {
    if(isNewUser.value) {
        isLoading.value = false;
    }
});
</script>