<template>
<div class="container mx-auto">
    <span class="w-full space-y-4">
    <div class="flex flex-wrap">
        <div class="w-full space-y-2">
            <label class="block text-sm font-medium text-gray-700" for="email">
                Escrow Email
            </label>
            <input v-model="form.email" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="email" type="email" placeholder="example@example.com" :disabled="!editInputs">
        </div>
    </div>
    <div class="flex flex-wrap">
        <div class="w-full space-y-2">
            <label class="block text-sm font-medium text-gray-700" for="api-key">
                Escrow Api Key
            </label>
            <input v-model="form.apiKey" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="api-key" type="secret" placeholder="1a2w3E4a5x6E7AD89" :disabled="!editInputs">
        </div>
    </div>
    <div class="w-full flex justify-between">
        <CardButton @click="()=> editInputs = !editInputs">
            <span v-if="!editInputs">Edit</span>
            <span v-if="editInputs">Cancel</span>
        </CardButton>
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
import { useModalStore } from '@/stores/modals';
import { useFirebaseFunctionCall } from '@/firebase/utils';
import CardButton from '../props/CardButton.vue';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const { profile } = storeToRefs(useMainStore());
const emits = defineEmits(['success','failure']);
const form = ref({
email: '',
apiKey: '',
});
const isLoading = ref(false);
const submitForm = async () => {
    const deepCopy = JSON.parse(JSON.stringify(form.value));
    let res;
    const { callFunction } = useFirebaseFunctionCall(
    'linkEscrowAccount',
    deepCopy,
    isLoading,
    undefined,
    (data) => {
        res = data;
    },
    ()=> {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
        notifications.value.message = 'Escrow Account Linked';
    },
    ()=> {
        notifications.value.show = true;
        notifications.value.type = NOTIFICATION_TYPES.ERROR;
        notifications.value.message = 'An error occured during the process, please try again later';
        },
    );
    await callFunction();
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