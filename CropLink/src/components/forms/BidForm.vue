<template>
    <div class="space-y-4 mb-4">
        <label class="block text-sm font-medium text-gray-700" for="price">Bid Offer</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="number" id="price" v-model="newBid.price">
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
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useFirebaseFunctionCall } from '@/firebase/utils';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const emits = defineEmits(["close"]);
const props = defineProps({
    adId: {
        type: String,
        required: true
    }

})
const newBid = reactive({
    adId: props.adId,
    price: 0
});
const isLoading = ref(false);
const onConfirm = async () => {
    if(validateRequest()) {
        const { callFunction } = useFirebaseFunctionCall(
            'placeBid',
            {...newBid},
            isLoading,
            undefined,
            undefined,
            () => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
                notifications.value.message = 'Bid placed successfully';
            },
            (error) => {
                notifications.value.show = true;
                notifications.value.type = NOTIFICATION_TYPES.ERROR;
                notifications.value.message = 'Error while placing bid, please try again later';
            },
        );
        await callFunction();
        emits("close")
    }
}
const validateRequest = ()=>{
    if(newBid.price === 0) {
        return false;
    }
    return true;
}
</script>