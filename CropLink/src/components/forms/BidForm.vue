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
        class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
    isLoading.value = true;
    if(validateRequest()) {
        await useMainStore().placeNewBid({...newBid});
        isLoading.value = false;
        emits("close")
    } else {
        isLoading.value = false;
    }
}
const validateRequest = ()=>{
    if(newBid.price === 0) {
        return false;
    }
    return true;
}
</script>