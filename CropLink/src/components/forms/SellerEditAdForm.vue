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
        <input class="mt-1 p-2 w-full rounded-md border" type="text" id="type" v-model="newCrop.type">
        <label class="block text-sm font-medium text-gray-700" for="variety">Variety</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="text" id="variety" v-model="newCrop.variety">
        <label class="block text-sm font-medium text-gray-700" for="yieldTonnage">Yield Tonnage</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="number" id="yieldTonnage" v-model="newCrop.yieldTonnage">
        <label class="block text-sm font-medium text-gray-700" for="expectedHarvestDate">Expected Harvest Date</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="date" id="expectedHarvestDate" v-model="newCrop.expectedHarvestDate">
        <label class="block text-sm font-medium text-gray-700" for="price">Price</label>
        <input class="mt-1 p-2 w-full rounded-md border" type="number" id="price" v-model="newCrop.price">
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
import { ref, reactive, type PropType } from 'vue';
import { useMainStore } from '@/stores/main';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { storeToRefs } from 'pinia';
import { type SellerAd } from '@/types';
const props = defineProps({
    ad: {
        type: Object as PropType<SellerAd>,
        required: true
    }
})
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
const removeResizedImage = (index) => {
    newCrop.resizedImages.splice(index, 1);
};

const deepAdCopy = JSON.parse(JSON.stringify(props.ad));
const newCrop = reactive({
    type: deepAdCopy.type,
    variety: deepAdCopy.variety,
    yieldTonnage: deepAdCopy.yieldTonnage,
    expectedHarvestDate: deepAdCopy.expectedHarvestDate,
    price: deepAdCopy.price,
    resizedImages: deepAdCopy.resizedImages,
});
const isLoading = ref(false);
const onConfirm = async () => {
    isLoading.value = true;
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
    await useMainStore().editUserAd({changes, adId:props.ad.id});
    isLoading.value = false;
    emits("close")
}
</script>