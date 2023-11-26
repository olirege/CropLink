<template>
    <div class="space-y-4 mb-4">
        <label class="block text-sm font-medium text-gray-700" for="type">Type</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="text" id="type" v-model="newRequest.type">
        <label class="block text-sm font-medium text-gray-700" for="yieldTonnage">Yield Tonnage</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="number" id="yieldTonnage" v-model="newRequest.yieldTonnage">
        <label class="block text-sm font-medium text-gray-700" for="requestDate">Request Date</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="date" id="requestDate" v-model="newRequest.requestDate">
        <label class="block text-sm font-medium text-gray-700" for="price">Price</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="number" id="price" v-model="newRequest.price">
    </div>
    <div class="flex justify-end space-x-2 mt-4">
        <button 
        @click="$emit('close')"
        type="button"
        class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
            Cancel
        </button>
        <ButtonWithLoading 
        @click="onConfirm"
        :isLoading="isLoading"
        >
            Confirm
        </ButtonWithLoading>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useMainStore } from '@/stores/main';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { storeToRefs } from 'pinia';
import { useFirebaseFunctionCall } from '@/firebase/utils';
import { useModalStore } from '@/stores/modals';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const emits = defineEmits(["close"]);
const { profile } = storeToRefs(useMainStore());
let today = new Date().toISOString().split("T")[0].split("-").reverse().join("-");
const newRequest = reactive({
    type: "",
    yieldTonnage: 0,
    requestDate: today,
    price: 0
});
const isLoading = ref(false);
const onConfirm = async () => {
    if(validateRequest() && profile.value) {
        const deepAdCopy = JSON.parse(JSON.stringify(newRequest));
        deepAdCopy.requestDate = new Date(deepAdCopy.requestDate).toISOString();
        const { callFunction } = useFirebaseFunctionCall(
            'createAd',
            {...deepAdCopy, adType:profile.value.accountType},
            isLoading,
            undefined,
            undefined,
            () => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
                notifications.value.message = 'Ad created!';
            },
            (error) => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.ERROR;
                notifications.value.message = 'Error creating ad, please try again later';
            },
        );
        await callFunction();
        emits("close")
    }
}
const validateRequest = ()=>{
    if(newRequest.type === "" || newRequest.yieldTonnage === 0 || !newRequest.requestDate || newRequest.price === 0) {
        return false;
    }
    return true;
}
</script>