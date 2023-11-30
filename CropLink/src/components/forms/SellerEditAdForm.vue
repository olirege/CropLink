<template>
    <div class="space-y-4 mb-4">
        <label class="block text-sm font-medium text-gray-700" for="images">Images</label>
        <input type="file" id="images" ref="imageInput" multiple @change="onImageChange" class="mt-1 p-2 w-full rounded-md border" />
        <div class="mt-4 flex overflow-y-auto" style="max-height: 150px;">
            <div v-for="(image, index) in images" :key="index" class="mr-2 relative">
                <img :src="image.url" class="w-16 h-16 object-cover" />
                <button @click="removeImage(index)">Remove</button>
            </div>
            <div v-for="(image, index) in newCrop.resizedImages" :key="index" class="mr-2 relative">
                <img :src="image" class="w-16 h-16 object-cover" />
                <button @click="removeResizedImage(index)">Remove</button>
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
        <label class="block text-sm font-medium text-gray-700" for="tons">Quantity(tons)</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="number" id="tons" v-model="newCrop.tons">
        <label class="block text-sm font-medium text-gray-700" for="expectedHarvestDate">Expected Harvest Date</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="date" id="expectedHarvestDate" v-model="newCrop.expectedHarvestDate">
        <label class="block text-sm font-medium text-gray-700" for="biddingEndTime">Bidding End Time (Bidding ends at 17:00 EST)</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="date" id="biddingEndTime" v-model="newCrop.biddingEndTime">
    </div>
    <div class="flex justify-end space-x-2 mt-4">
        <CardButton 
        @click="$emit('close')"
        type="button"
        >
            Cancel
        </CardButton>
        <ButtonWithLoading 
        @click="onConfirm"
        :isLoading="isLoading"
        >
            Confirm
        </ButtonWithLoading>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, type PropType, type Ref, computed, onMounted } from 'vue';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/modals';
import { useFirebaseFunctionCall } from '@/firebase/utils';
import { type SellerAd } from '@/types';
import Listbox from '@/components/props/Listbox.vue';
import { useMainStore } from '@/stores/main';
import CardButton from '@/components/props/CardButton.vue';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const props = defineProps({
    ad: {
        type: Object as PropType<SellerAd>,
        required: true
    }
})
const emits = defineEmits(["close"]);
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
const removeResizedImage = (index) => {
    newCrop.resizedImages.splice(index, 1);
};

const deepAdCopy = JSON.parse(JSON.stringify(props.ad));
const newCrop = reactive({
    type: deepAdCopy.type,
    variety: deepAdCopy.variety,
    pricePerTon: deepAdCopy.pricePerTon,
    tons: deepAdCopy.tons,
    expectedHarvestDate: deepAdCopy.expectedHarvestDate,
    price: deepAdCopy.price,
    resizedImages: deepAdCopy.resizedImages,
});
const isLoading = ref(false);
const onConfirm = async () => {
    const changes = Object.keys(newCrop).reduce((acc, key) => {
        if(newCrop[key] !== props.ad[key]) {
            acc[key] = newCrop[key];
        }
        return acc;
    }, {});
    if(imageInput.value.files.length > 0) {
        const base64Images = images.value.map((imageObj) => {
            return imageObj.url.split(",")[1]; // Extract the base64 part of the DataURL
        });
        changes.newImages = base64Images;
    }
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