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
import { ref, reactive, type PropType } from 'vue';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { storeToRefs } from 'pinia';
import { type BuyerAd } from '@/types';
import { useModalStore } from '@/stores/modals';
import { useFirebaseFunctionCall } from '@/firebase/utils';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const props = defineProps({
    ad: {
        type: Object as PropType<BuyerAd>,
        required: true
    }
})
const emits = defineEmits(["close"]);
const deepAdCopy = JSON.parse(JSON.stringify(props.ad));
const newRequest = reactive({
    type: deepAdCopy.type,
    yieldTonnage: deepAdCopy.yieldTonnage,
    requestDate: deepAdCopy.requestDate,
    price: deepAdCopy.price,
});
const isLoading = ref(false);
const onConfirm = async () => {
    const changes = Object.keys(newRequest).reduce((acc, key) => {
        if(newRequest[key] !== props.ad[key]) {
            acc[key] = newRequest[key];
        }
        return acc;
    }, {});
    const { callFunction } = useFirebaseFunctionCall(
        'editAd',
        {changes, adId:props.ad.id},
        isLoading,
        undefined,
        undefined,
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Ad edited successfully';
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'Error while editing bid, please try again later';
        },
    );
    await callFunction();
    emits("close")
}
</script>