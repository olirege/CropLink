<template>
    <div class="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-x-4 p-2 sm:p-4">
        <div>
            <h1 class="text-2xl font-semibold mb-2 capitalize">Escrow Account Details</h1>
            <p class="text-md mb-2 italic w-64">
                In order to sell crops on CropLink, you must have an escrow account to hold the buyers
                money until the transaction is complete. You can either link an existing escrow account or
                create a new one.
            </p>
        </div>
        <div>
            <div v-if="!showSignupForm">
                <p class="text-lg italic mb-2">Link an Existing Escrow Account</p>
                <p class="text-xs"> 
                    If you already have an escrow account, you can link it to your CropLink account by entering
                    your escrow email and api key below.
                </p>
                <p class="text-xs font-bold mt-2 mb-4">For more info visit <a href="https://escrow.com" target="_blank">escrow.com</a></p>
                <EscrowLinkForm class="mb-4" @success="displayNotification(NOTIFICATION_TYPES.SUCCESS)" @failure="displayNotification(NOTIFICATION_TYPES.ERROR)"/>
            </div>
            <span>
                <p class="text-lg italic mb-4">Create an Escrow Account</p>
                <p class="text-xs"> 
                    If you do not have an escrow account, you can create one by clicking the button below.
                </p>
                <div class="flex justify-end pb-8 sm:pb-0">
                    <CardButton
                    v-if="!showSignupForm"
                    @click="toggleSignupForm">
                        Create Escrow Account
                    </CardButton>
                </div>
                <EscrowSignupForm v-if="showSignupForm" @cancel="() => showSignupForm = false" @success="onSignupSuccess" @failure="displayNotification(NOTIFICATION_TYPES.ERROR)"/>
            </span>
        </div>
    </div>
</template>
<script setup lang="ts">
import CardButton from '../props/CardButton.vue';
import EscrowSignupForm from '../forms/EscrowSignupForm.vue';
import EscrowLinkForm from '../forms/EscrowLinkForm.vue';
import { ref } from 'vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const showSignupForm = ref(false);
const showLinkForm = ref(false);
const toggleSignupForm = () => {
    showSignupForm.value = !showSignupForm.value;
    if(showSignupForm.value) {
        showLinkForm.value = false;
    }
}
const displayNotification = (state:string) => {
    if(state == NOTIFICATION_TYPES.ERROR) {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Failed to create escrow account';
    }
    if(state == NOTIFICATION_TYPES.SUCCESS) {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
        notifications.value.message = 'Successfully created escrow account';
    }
}
const onSignupSuccess = () => {
    displayNotification('success');
    toggleSignupForm();
}
</script>