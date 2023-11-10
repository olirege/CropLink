<template>
<div class="container mx-auto">
    <span  class="w-full max-w-lg">
    <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="email">
            Escrow Email
        </label>
        <input v-model="form.email" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="email" type="email" placeholder="example@example.com" :disabled="!editInputs">
        </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="api-key">
            Escrow Api Key
        </label>
        <input v-model="form.apiKey" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="api-key" type="secret" placeholder="1a2w3E4a5x6E7AD89" :disabled="!editInputs">
        </div>
    </div>
    <div class="w-full flex justify-between">
        <button @click="()=> editInputs = !editInputs">
            <span v-if="!editInputs">Edit</span>
            <span v-if="editInputs">Cancel</span>
        </button>
        <ButtonWithLoading
        :isLoading="isLoading"
        v-if="editInputs"
        @click="submitForm">
            Submit
        </ButtonWithLoading>
    </div>
    </span>
</div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMainStore } from '@/stores/main';
import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
import { storeToRefs } from 'pinia';
const { profile } = storeToRefs(useMainStore());
const emits = defineEmits(['success','failure']);
const form = ref({
email: '',
apiKey: '',
});
const isLoading = ref(false);
const submitForm = async () => {
    isLoading.value = true;
    const deepCopy = JSON.parse(JSON.stringify(form.value));
    const res = await useMainStore().linkEscrowUserAccount(deepCopy);
    isLoading.value = false;
    if(res) {
    emits('success')
    } else {
    emits('failure')
    }
};

const editInputs = ref(true);
onMounted(() => {
    if(profile.value?.escrowAuth) {
        editInputs.value = false;
        form.value = {
            email: profile.value?.escrowAuth.email,
            apiKey: profile.value?.escrowAuth.apiKey,
        }
    }
})
</script>