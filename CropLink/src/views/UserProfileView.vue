<template>
    <div class="grid grid-cols-1 p-5 divide-y">
        <div class="grid grid-cols-2 gap-x-4 p-5">
            <span>
                <h2 class="text-2xl font-semibold mb-2 capitalize">
                    Personal Information
                </h2>
                <p class="text-md mb-2 italic w-48">
                    Change your profile information and avatar here.
                </p>
            </span>
            <span v-if="profile && !loading" class="flex flex-col gap-4">
                <span class="flex flex-row gap-4">
                    <div>
                        <img :src="profile.profilePic" class="w-32 h-32 object-cover rounded-md" v-if="profile.profilePic"/>
                        <img :src="profileChanges.profilePic" class="w-32 h-32 object-cover rounded-md" v-else-if="profileChanges.profilePic"/>
                        <img src="https://via.placeholder.com/150" class="w-32 h-32 object-cover rounded-md" v-else="!profile.profilePic && !profileChanges.profilePic"/>
                    </div>
                    <div class="flex flex-col gap-4">
                        <span class="space-y-1">
                            <div class="p-4 rounded-md bg-sky-500 h-8 flex items-center justify-center">
                                <h2 @click="triggerFileInput('profilePic')" class="cursor-pointer text-white">Change Avatar</h2>
                                <input type="file" @change="onFileChange" ref="profilePic" name="profilePic" class="hidden"/>
                            </div>
                            <p class="text-xs">1MB max.</p>
                        </span>
                        <span class="space-y-1">
                            <div class="p-4 rounded-md bg-sky-500 h-8 flex items-center justify-center">
                                <h2 @click="triggerFileInput('bannerPic')" class="cursor-pointer  text-white">Change Banner</h2>
                                <input type="file" @change="onFileChange" ref="bannerPic" name="bannerPic" class="hidden"/>
                            </div>
                            <p class="text-xs">3MB max.</p>
                        </span>
                    </div>
                </span>
                <div class="flex flex-col gap-2">
                    <span class="flex flex-row gap-2 w-full">
                        <span class="space-y-2 w-full">
                            <label class="block text-sm font-medium text-gray-700" for="name">Name</label>
                            <input type="text" v-model="profileChanges.name" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                        </span>
                        <span class="space-y-2 w-full">
                            <label class="block text-sm font-medium text-gray-700" for="name">Last Name</label>
                            <input type="text" v-model="profileChanges.lastname" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                        </span>
                    </span>
                    <span class="space-y-2 w-3/4">
                        <label class="block text-sm font-medium text-gray-700" for="email">Email</label>
                        <input type="text" v-model="profileChanges.email" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                    </span>
                    <label class="block text-sm font-medium text-gray-700" for="location">Street Address</label>
                    <input type="text" v-model="profileChanges.streetAddress" class="bg-gray-200/70 p-2 rounded-md border-1" />
                    <span class="space-y-2 w-1/2">
                        <label class="block text-sm font-medium text-gray-700" for="website">Website</label>
                        <input type="text" v-model="profileChanges.website" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                    </span>
                </div>
                <div class="flex justify-end">
                    <button @click="onAcceptProfileChanges" class="mt-2 mb-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 w-36">
                        Save
                    </button>
                </div>
            </span>
            <div v-if="loading">
                <LoadingSpinner :isLoading="loading" />
            </div>
        </div>
        <div class="grid grid-cols-2 gap-x-4 p-5">
            <span>
                <h2 class="text-2xl font-semibold mb-2 capitalize">
                    Store Page Information
                </h2>
                <p class="text-md mb-2 italic w-48">
                    Change your store page information here.
                </p>
            </span>
            <span v-if="store && !loading" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <span class="flex flex-row gap-4">
                        <div class="flex flex-col gap-4">
                            <span class="space-y-1">
                                <div class="p-4 rounded-md bg-sky-500 h-8 flex items-center justify-center">
                                    <h2 @click="triggerFileInput('storeLogo')" class="cursor-pointer text-white">Change Logo</h2>
                                    <input type="file" @change="onFileChange" ref="storeLogo" name="storeLogo" class="hidden"/>
                                </div>
                                <p class="text-xs">1MB max.</p>
                            </span>
                            <span class="space-y-1">
                                <div class="p-4 rounded-md bg-sky-500 h-8 flex items-center justify-center">
                                    <h2 @click="triggerFileInput('storeBannerPic')" class="cursor-pointer  text-white">Change Banner</h2>
                                    <input type="file" @change="onFileChange" ref="storeBannerPic" name="storeBannerPic" class="hidden"/>
                                </div>
                                <p class="text-xs">3MB max.</p>
                            </span>
                        </div>
                        <div>
                            <img :src="store.storeLogo" class="w-32 h-32 object-cover rounded-md" v-if="store.storeLogo"/>
                            <img :src="storeChange.storeLogo" class="w-32 h-32 object-cover rounded-md" v-else-if="storeChange.storeLogo"/>
                            <img src="https://via.placeholder.com/150" class="w-32 h-32 object-cover rounded-md" v-else="!store.storeLogo && !storeChange.storeLogo"/>
                        </div>
                    </span>
                    <span class="flex flex-col gap-2 w-full">
                        <span class="space-y-2 w-full">
                            <label class="block text-sm font-medium text-gray-700" for="name">Company Name</label>
                            <input type="text" v-model="storeChange.companyName" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                        </span>
                        <span class="space-y-2 w-full">
                            <label class="block text-sm font-medium text-gray-700" for="name">Company Email</label>
                            <input type="email" v-model="storeChange.companyEmail" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                        </span>
                        <span class="space-y-2 w-full">
                            <label class="block text-sm font-medium text-gray-700" for="name">Company Website</label>
                            <input type="url" v-model="storeChange.companyWebsite" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                        </span>
                        <span class="space-y-2 w-full">
                            <label class="block text-sm font-medium text-gray-700" for="name">Location</label>
                            <input type="text" v-model="storeChange.location" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                        </span>
                        <span class="flex flex-row gap-2 w-full">
                            <span class="space-y-2 w-full">
                                <label class="block text-sm font-medium text-gray-700" for="name">Acreage</label>
                                <input type="number" v-model="storeChange.acreage" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                            </span>
                            <span class="space-y-2 w-full">
                                <label class="block text-sm font-medium text-gray-700" for="name">Staff Number</label>
                                <input type="number" v-model="storeChange.staffNumber" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                            </span>
                        </span>
                        <span class="space-y-2 w-full">
                            <label class="block text-sm font-medium text-gray-700" for="name">Capabilities</label>
                            <div class="grid grid-cols-3 divide-x">
                                <span v-for="capability in capabilities" class="flex flex-row items-center justify-start gap-2 pl-2">
                                    <input type="checkbox" :value="capability" v-model="storeChange.capabilities" />
                                    <label class="text-sm font-medium text-gray-700" for="name">{{ capability }}</label>
                                </span>
                            </div>
                        </span>
                        <span class="space-y-2 w-full">
                            <label class="block text-sm font-medium text-gray-700" for="name">Machinery</label>
                            <div class="grid grid-cols-3 divide-x">
                                <span v-for="machine in machinery" class="flex flex-row items-center justify-start gap-2 pl-2">
                                    <input type="checkbox" :value="machine" v-model="storeChange.machinery" />
                                    <label class="text-sm font-medium text-gray-700" for="name">{{ machine }}</label>
                                </span>
                            </div>
                        </span>
                        <span class="space-y-2 w-full">
                            <label class="block text-sm font-medium text-gray-700" for="name">Plants</label>
                            <div class="flex flex-row gap-2 items-center">
                                <Listbox
                                :items="produce"
                                v-model="produceToAdd.type"
                                placeholder="Select a Produce"
                                itemLabel="id"
                                />
                                <Listbox
                                :items="selectableVariety"
                                v-model="produceToAdd.variety"
                                placeholder="Select a Variety"
                                :disabled="!produceToAdd.type"
                                />
                                <input type="number" v-model="produceToAdd.amount" class="bg-gray-200/70 p-2 rounded-md border-1 w-1/3 text-sm" placeholder="Amount"/>
                                <button @click="addProduceToPlants" class="mt-2 mb-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 w-36">
                                    Add
                                </button>
                            </div>
                            <div class="flex flex-wrap h-24 w-full gap-2 bg-slate-400/20 rounded-md p-2 overflow-y-scroll">
                                <span v-for="plant in storeMergePlants" class="flex flex-row items-center justify-start bg-white gap-2 pl-2 h-6 border rounded-md p-1">
                                    <label class="text-sm font-medium text-gray-700" for="name">{{ plant.type }}</label>
                                     -
                                    <label class="text-sm font-medium text-gray-700" for="name">{{ plant.variety }}</label>
                                    -
                                    <label class="text-sm font-medium text-gray-700" for="name">{{ plant.amount }} plants</label>
                                    <XCircleIcon @click="removeProduceFromPlants(plant)" class="w-6 h-6 pl-2"/>
                                </span>
                            </div>
                        </span>
                        <span class="space-y-2 w-full">
                            <label class="block text-sm font-medium text-gray-700" for="name">Shipping</label>
                            <div class="flex flex-row gap-2 items-center">
                                <Listbox
                                :items="shipping"
                                v-model="shippingMethodToAdd.type"
                                placeholder="Select a Shipping Method"
                                />
                                <input type="text" v-model="shippingMethodToAdd.distance" class="bg-gray-200/70 p-2 rounded-md border-1 w-1/3 text-sm" placeholder="Distance(km)" />
                                <input type="text" v-model="shippingMethodToAdd.weight" class="bg-gray-200/70 p-2 rounded-md border-1 w-1/3 text-sm" placeholder="Weight(kg)"/>
                                <button @click="addShippingMethodToShipping" class="mt-2 mb-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 w-36">
                                    Add
                                </button>
                            </div>
                            <div class="flex flex-wrap h-24 w-full gap-2 bg-slate-400/20 rounded-md p-2 overflow-y-scroll">
                                <span v-for="shippingMethod in storeMergeShipping" class="flex flex-row items-center justify-start bg-white gap-2 pl-2 h-6 border rounded-md p-1">
                                    <label class="text-sm font-medium text-gray-700" for="name">{{ shippingMethod.type }}</label>
                                     -
                                    <label class="text-sm font-medium text-gray-700" for="name">Up to {{ shippingMethod.distance }}km</label>
                                     -
                                    <label class="text-sm font-medium text-gray-700" for="name">Max {{ shippingMethod.weight }}kg</label>
                                    <XCircleIcon @click="removeShippingMethodFromShipping(shippingMethod)" class="w-6 h-6 pl-2"/>
                                </span>
                            </div>
                        </span>
                        <div>
                            <label class="block text-sm font-medium text-gray-700" for="images">Images</label>
                            <input type="file" id="newStoreImages" ref="storeImages" name="newStoreImages" multiple @change="onFileChange" class="mt-1 p-2 w-full rounded-md border" />
                            <div class="mt-4 flex overflow-y-auto" style="max-height: 150px;">
                                <div v-for="(image, index) in storeChange.storeImagesResized" :key="index" class="mr-2 relative">
                                    <img :src="image" class="w-16 h-16 object-cover" />
                                    <button @click="removeStoreResizedImage(index)">Remove</button>
                                </div>
                                <div v-for="(image, index) in newStoreImages" :key="index" class="mr-2 relative">
                                    <img :src="image.url" class="w-16 h-16 object-cover" />
                                    <button @click="removeStoreImage(index)">Remove</button>
                                </div>
                            </div>
                        </div>
                    </span>
                </div>
                <div class="flex justify-end">
                    <button @click="onAcceptStoreChange" class="mt-2 mb-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 w-36">
                        Save
                    </button>
                </div>
            </span>
        </div>
        <div class="grid grid-cols-2 gap-x-4 p-5">
            <span>
                <h2 class="text-2xl font-semibold mb-2 capitalize">
                    Change Password
                </h2>
                <p class="text-md mb-2 italic w-48">
                    Change your password here.
                </p>
            </span>
            <span v-if="profile && !loading" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <span class="flex flex-col gap-2 w-full">
                        <span class="space-y-2 w-1/2">
                            <label class="block text-sm font-medium text-gray-700" for="name">Current password</label>
                            <input type="password" v-model="passwordChange.old" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                        </span>
                        <span class="space-y-2 w-1/2">
                            <label class="block text-sm font-medium text-gray-700" for="name">New password</label>
                            <input type="password" v-model="passwordChange.new" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                        </span>
                        <span class="space-y-2 w-1/2">
                            <label class="block text-sm font-medium text-gray-700" for="name">Confirm password</label>
                            <input type="password" v-model="passwordChange.confirm" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" />
                        </span>
                    </span>
                </div>
                <div class="flex justify-end">
                    <button @click="onAcceptPasswordChange" class="mt-2 mb-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 w-36">
                        Save
                    </button>
                </div>
            </span>
        </div>
        <div class="grid grid-cols-2 gap-x-4 p-5">
            <span>
                <h2 class="text-2xl font-semibold mb-2 capitalize">
                    Delete Account
                </h2>
                <p class="text-md mb-2 italic w-48">
                    No longer interested in using CropLink? Delete your account here. This action is irreversible. All your data will be deleted.
                </p>
            </span>
            <span v-if="profile && !loading" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <span class="space-y-2 w-1/2">
                        <button class="mt-2 mb-2 inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-white hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 w-48">
                            Yes, Delete my Account
                        </button>
                    </span>
                </div>
            </span>
        </div>
        <EscrowAccountComponent v-if="profile?.accountType == ACCOUNT_TYPES.SELLER"/>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { useDocumentSubscription, useFirebaseFunctionCall } from '@/firebase/utils';
import type { Profile } from '@/types';
import EscrowAccountComponent from '@/components/userboard_components/EscrowAccountComponent.vue';
import { useModalStore } from '@/stores/modals';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import Listbox from '@/components/props/Listbox.vue';
import { XCircleIcon } from '@heroicons/vue/20/solid';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const { profile, user } = storeToRefs(useMainStore());
const ACCOUNT_TYPES = useMainStore().ACCOUNT_TYPES;
const profileChanges = ref({
    profilePic: null,
    bannerPic: null,
    name: null,
})
const passwordChange = ref({
    old: null,
    new: null,
    confirm: null,
})
const loading = ref(false);
const { subscribe:profileSub, unsubscribe:profileUnsub } = useDocumentSubscription(
    import.meta.env.VITE_USERS_COLLECTION,
    user.value.uid,
    (data) => {
        profile.value = data as Profile;
        profileChanges.value = data as Profile;
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading profile, please try again later.'       
    },
    loading,
)
const isLoadingStoreChange = ref(false);
const store = ref(null);
const { subscribe:storeSub, unsubscribe:storeUnsub } = useDocumentSubscription(
    import.meta.env.VITE_ADS_COLLECTION,
    user.value.uid,
    (data) => {
        store.value = data;
        storeChange.value = JSON.parse(JSON.stringify(data));
    },
    (error) => {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Error loading profile, please try again later.'       
    },
    isLoadingStoreChange,
)
onMounted(async ()=>{
    await loadProduce();
    profileSub();
    storeSub();
})
onBeforeUnmount(()=>{
    profileUnsub();
    storeUnsub();
})
const newStoreImages = ref([]);
const onFileChange = (e:any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if(e.target.name == 'profilePic') {
            profileChanges.value.profilePic = reader.result as string;
        }
        if(e.target.name == 'bannerPic') {
            profileChanges.value.bannerPic = reader.result as string;
        }
        if(e.target.name == 'storeLogo') {
            storeChange.value.storeLogo = reader.result as string;
        }
        if(e.target.name == 'storeBannerPic') {
            storeChange.value.storeBannerPic = reader.result as string;
        }
        if(e.target.name == 'newStoreImages') {
            console.log("newStoreImages", newStoreImages.value)
            newStoreImages.value.push({ file, url: reader.result as string });
        }
    }
}

const removeStoreResizedImage = (index) => {
    storeChange.value.storeImagesResized.splice(index, 1);
};
const removeStoreImage = (index) => {
    newStoreImages.value.splice(index, 1);
};
const isLoadingProfileChanges = ref(false);
const capabilities = [
    "Harvesting",
    "Pruning",
    "Planting",
    "Packing",
    "Weeding",
    "Fertilizing",
    "Spraying",
    "Irrigation",
    "Tractor Work",
    "Machinery Work",
    "Other",
]
const machinery = [
    "Tractor",
    "Sprayer",
    "Mower",
    "Tiller",
    "Seeder",
    "Other",
]
const shipping = [
    "Trailer",
    "Truck",
    "Van",
    "Other",
]
const shippingMethodToAdd = ref({
    type: "",
    distance: "",
    weight: "",
})
const addShippingMethodToShipping = () => {
    if(shippingMethodToAdd.value.type === "" || shippingMethodToAdd.value.distance === "" || shippingMethodToAdd.value.weight === "") {
        return;
    }
    storeChange.value.shipping.push(shippingMethodToAdd.value);
    shippingMethodToAdd.value = {
        type: "",
        distance: "",
        weight: "",
    }
}
const removeShippingMethodFromShipping = (shippingMethod) => {
    storeChange.value.shipping = storeChange.value.shipping.filter((method) => {
        return !(method.type === shippingMethod.type && method.distance === shippingMethod.distance && method.weight === shippingMethod.weight);
    });
}
const storeMergeShipping = computed(()=> {
    const storeShipping = store.value?.shipping || [];
    const merge = [...storeShipping, ...storeChange.value.shipping];
    const removeDuplicates = merge.filter((method, index, self) =>
        index === self.findIndex((t) => (
            t.type === method.type && t.distance === method.distance && t.weight === method.weight
        ))
    )
    return removeDuplicates;
})
const produce = ref([]);
const loadProduce = async () => {
    produce.value = await useMainStore().getProduce();
}
const produceToAdd = ref({
    type: "",
    variety: "",
    amount: 0,
})
const selectableVariety = computed(()=>{
    if(produceToAdd.value.type === "") {
        return [];
    }
    const chosenProduct = produce.value.find((produce)=>produce.id === produceToAdd.value.type);
    if(chosenProduct) {
        return chosenProduct.sub;
    }
    return [];
})
const addProduceToPlants = () => {
    if(produceToAdd.value.type === "" || produceToAdd.value.variety === "" || produceToAdd.value.amount === 0) {
        return;
    }
    storeChange.value.plants.push(produceToAdd.value);
    produceToAdd.value = {
        type: "",
        variety: "",
        amount: 0,
    }
}
const removeProduceFromPlants = (plant) => {
    storeChange.value.plants = storeChange.value.plants.filter((p) => {
        return !(p.type === plant.type && p.variety === plant.variety && p.amount === plant.amount);
    });
}
const storeMergePlants = computed(()=>{
    const storePlants = store.value?.plants || [];
    const merge = [...storePlants, ...storeChange.value.plants];
    const removeDuplicates = merge.filter((plant, index, self) =>
        index === self.findIndex((t) => (
            t.type === plant.type && t.variety === plant.variety
        ))
    )
    return removeDuplicates;
})
const onAcceptProfileChanges = async () => {
    console.log("profileChanges", profileChanges.value)
    console.log("profile", profile.value)
    const changes = {};
    // store different values between profile and profileChanges into changes
    for(const key in profileChanges.value) {
        console.log("key", key)
        if(profileChanges.value[key] != profile.value[key]) {
            console.log("profileChanges.value[key]", profileChanges.value[key])
            changes[key] = profileChanges.value[key];
        }
    }
    console.log("profile changes", changes)
    const deepCopy = JSON.parse(JSON.stringify(changes));
    deepCopy.profilePic = profileChanges.value.profilePic ? profileChanges.value.profilePic.split(",")[1] : null;
    deepCopy.bannerPic = profileChanges.value.bannerPic ? profileChanges.value.bannerPic.split(",")[1] : null;
    Object.keys(deepCopy).forEach((key) => (deepCopy[key] == null) && delete deepCopy[key]);
    const { callFunction } = useFirebaseFunctionCall(
        'updateProfile',
        deepCopy,
        isLoadingProfileChanges,
        undefined,
        undefined,
        ()=> {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Profile Updated';
        },
        ()=> {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'An error occured while updating your profile, please try again later';
        },
    );
    await callFunction();
}
const profilePic = ref(null);
const bannerPic = ref(null);
const storeLogo = ref(null);
const storeBannerPic = ref(null);
const triggerFileInput = (refName: string) => {
    if (refName === 'profilePic' && profilePic.value) {
        profilePic.value.click();
    } else if (refName === 'bannerPic' && bannerPic.value) {
        bannerPic.value.click();
    } else if (refName === 'storeLogo' && storeLogo.value) {
        storeLogo.value.click();
    } else if (refName === 'storeBannerPic' && storeBannerPic.value) {
        storeBannerPic.value.click();
    }
}
const isLoadingPasswordChange = ref(false);
const onAcceptPasswordChange = async () => {
    if(passwordChange.value.new != passwordChange.value.confirm) {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'Passwords do not match';
        return;
    }
    // const { callFunction } = useFirebaseFunctionCall(
    //     'updatePassword',
    //     passwordChange.value,
    //     isLoadingPasswordChange,
    //     undefined,
    //     undefined,
    //     ()=> {
    //         notifications.value.show = true;
    //         notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
    //         notifications.value.message = 'Password Updated';
    //     },
    //     ()=> {
    //         notifications.value.show = true;
    //         notifications.value.type = NOTIFICATION_TYPES.ERROR;
    //         notifications.value.message = 'An error occured while updating your password, please try again later';
    //     },
    // );
    // await callFunction();
}
const storeChange = ref({
    storeLogo: null,
    storeBannerPic: null,
    acreage: null,
    staffNumber: null,
    capabilities: [],
    location: null,
    machinery: [],
    plants: [],
    shipping: [],
    companyName: null,
    companyEmail: null,
    companyWebsite: null,
    storeImagesResized: [],
})
const onAcceptStoreChange = async () => {
    const changes = {};
    for(const key in storeChange.value) {
        if(storeChange.value[key] != store.value[key]) {
            changes[key] = storeChange.value[key];
        }
    }
    console.log("store changes", changes)
    const deepCopy = JSON.parse(JSON.stringify(changes));
    deepCopy.storeLogo = storeChange.value.storeLogo ? storeChange.value.storeLogo.split(",")[1] : null;
    deepCopy.storeBannerPic = storeChange.value.storeBannerPic ? storeChange.value.storeBannerPic.split(",")[1] : null;
    if(newStoreImages.value.length > 0) {
        deepCopy.newStoreImages = newStoreImages.value.map((image)=>image.url.split(",")[1]);
    }
    Object.keys(deepCopy).forEach((key) => (deepCopy[key] == null) && delete deepCopy[key]);
    const { callFunction } = useFirebaseFunctionCall(
        'updateStoreChanges',
        deepCopy,
        isLoadingStoreChange,
        undefined,
        ()=> {
            newStoreImages.value = [];
        },
        ()=> {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Store Updated';
        },
        ()=> {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'An error occured while updating your store, please try again later';
        },
    );
    await callFunction();
}
</script>