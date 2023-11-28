<template>
    <div class="space-y-4 mb-4">
        <label class="block text-sm font-medium text-gray-700" for="images">Images</label>
        <input type="file" id="images" ref="imageInput" multiple @change="onImageChange" class="mt-1 p-2 w-full rounded-md border" />
        <div class="mt-4 flex overflow-y-auto" style="max-height: 150px;">
            <div v-for="(image, index) in images" :key="index" class="mr-2 relative">
                <img :src="image.url" class="w-16 h-16 object-cover" />
                <button @click="removeImage(index)">Remove</button>
            </div>
        </div>
        <label class="block text-sm font-medium text-gray-700" for="type">Type</label>
        <Listbox
        :items="produces"
        v-model="newCrop.type"
        placeholder="Select a Produce"
        itemLabel="id"
        />
        <label class="block text-sm font-medium text-gray-700" for="variety">Variety</label>
        <Listbox
        :items="selectableVariety"
        v-model="newCrop.variety"
        placeholder="Select a Variety"
        :disabled="!newCrop.type"
        />
        <label class="block text-sm font-medium text-gray-700" for="pricePerTon">Price per Ton</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="number" id="pricePerTon" v-model="newCrop.pricePerTon">
        <label class="block text-sm font-medium text-gray-700" for="tons">Quantity</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="number" id="tons" v-model="newCrop.tons">tons
        <label class="block text-sm font-medium text-gray-700" for="expectedHarvestDate">Expected Harvest Date</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="date" id="expectedHarvestDate" v-model="newCrop.expectedHarvestDate">
        <label class="block text-sm font-medium text-gray-700" for="biddingEndTime">Bidding End Time (Bidding ends at 17:00 EST)</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="date" id="biddingEndTime" v-model="newCrop.biddingEndTime">
    </div>
    <div class="flex justify-end space-x-2 mt-4">
        <button 
        @click="$emit('close')"
        type="button"
        class="mt-2 mb-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"        >
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
import { type Ref, ref, reactive, onMounted, computed } from 'vue';
import type { Produce } from '@/types';
import { useMainStore } from '@/stores/main';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { storeToRefs } from 'pinia';
import Listbox from '@/components/props/Listbox.vue';
import { useFirebaseFunctionCall } from '@/firebase/utils';
import { useModalStore } from '@/stores/modals';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;

const emits = defineEmits(["close"]);
const { profile } = storeToRefs(useMainStore());
const images = ref([]);
const imageInput = ref(null);
const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
const onImageChange = () => {
    const fileList = imageInput.value.files;
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.size > maxSizeInBytes) {
            alert("File size should not exceed 5MB");
            continue; // Skip this file
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            images.value.push({ file, url: e.target.result });
        };
        reader.readAsDataURL(file);
    }
};
const removeImage = (index) => {
    images.value.splice(index, 1);
};

// yyyy-mm-dd
const today = new Date().toISOString().split("T")[0].split("-").reverse().join("-");
const newCrop = reactive({
    type: "",
    variety: "",
    pricePerTon: 0,
    tons: 0,
    expectedHarvestDate: today,
    biddingEndTime: today,
});
const isLoading = ref(false);
const onConfirm = async () => {
    if(validateCrop() && profile.value) {
        const base64Images = images.value.map((imageObj) => {
            return imageObj.url.split(",")[1]; // Extract the base64 part of the DataURL
        });
        const deepAdCopy = JSON.parse(JSON.stringify(newCrop));
        deepAdCopy.biddingEndTime = new Date(deepAdCopy.biddingEndTime).toISOString();
        deepAdCopy.expectedHarvestDate = new Date(deepAdCopy.expectedHarvestDate).toISOString();
        const { callFunction } = useFirebaseFunctionCall(
            'createAd',
            {images:base64Images,...deepAdCopy, adType:profile.value.accountType},
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
const validateCrop = ()=>{
    if(newCrop.type === "" || newCrop.variety === "" || newCrop.pricePerTon === 0 || !newCrop.expectedHarvestDate || newCrop.tons === 0 || images.value.length === 0 || !newCrop.biddingEndTime) {
        return false;
    }
    return true;
}

const isLoadingProduce = ref(false);
const produces:Ref<Produce[]> = ref([]);
const loadProduce = async () => {
    isLoadingProduce.value = true;
    produces.value = await useMainStore().getProduce() as Produce[];
    console.log("produce", produces.value);
    isLoadingProduce.value = false;
};
const selectableVariety = computed(()=>{
    if(newCrop.type === "") {
        return [];
    }
    const produce = produces.value.find((produce)=>produce.id === newCrop.type);
    if(produce) {
        return produce.sub;
    }
    return [];
})
onMounted(async () => {
    console.log("mounted");
    await loadProduce();
})
</script>