<template>
    <div class="sticky top-0">
        <div class="border rounded-md p-4 flex flex-col gap-4" v-if="transaction.id">
            <div class="flex flex-row justify-between gap-4">
                <label>Escrow Transaction:</label> 
                <p class="font-bold">{{ transaction.id }}#</p>
            </div>
            <p>{{ transaction.description }}</p>
            <div class="ml-2 flex flex-col">
                <div class="flex flex row gap-4">
                    <label class="font-bold">Amount:</label>
                    <p>{{ transaction.items[0].schedule[0].amount }}</p>
                </div>
                <div class="flex flex row gap-4">
                    <label class="font-bold">Seller:</label>
                    <p>{{ transaction.items[0].schedule[0].beneficiary_customer }}</p>
                </div>
                <div class="flex flex row gap-4">
                    <label class="font-bold">Buyer:</label>
                    <p>{{ transaction.items[0].schedule[0].payer_customer }}</p>
                </div>
                <div class="flex flex-col gap-4 p-2">
                    <label class="font-bold">Payment status:</label>
                    <div class="flex flex-row gap-4 justify-between">
                        <div class="flex flex-col">
                            <label>Sent</label>
                            <p>{{ transaction.items[0].schedule[0].status.payment_sent }}</p>
                        </div>
                        <div class="flex flex-col">
                            <label>Recieved</label>
                            <p>{{ transaction.items[0].schedule[0].status.payment_sent }}</p>
                        </div>
                        <div class="flex flex-col">
                            <label>Secured</label>
                            <p>{{ transaction.items[0].schedule[0].status.secured }}</p>
                        </div>
                        <div class="flex flex-col">
                            <label>Disbursed</label>
                            <p>{{ transaction.items[0].schedule[0].status.disbursed_to_beneficiary }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <LoadingSpinner :isLoading="isLoadingTransaction" />
        </div>
        <CardButton @click="goToLandingPage" :classes="'w-full'">View</CardButton>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CardButton from '@/components/props/CardButton.vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useFirebaseFunctionCall } from '@/firebase/utils';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const props = defineProps({
    contractId: {
        type:String,
        required:true,
    },
    transactionId: {
        type:String,
        required:false,
    },
})
const transaction = ref({} as any);
const isLoadingTransaction = ref(false);
const landingPage = ref({} as any);
const getTransaction = async () => {
    if(!props.contractId) return console.error('No contract id provided');
    const { callFunction } = useFirebaseFunctionCall(
        'getTransaction',
        {transactionId:props.contractId},
        isLoadingTransaction,
        undefined,
        (data) => {
            if(!data || !data.data.transaction) return console.error('No transaction found');
            transaction.value = data.data.transaction;
            landingPage.value = data.data.landingPage;
        },
        () => {},
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'Error while fetching transaction, please try again later';
        },
    );
    await callFunction();
};
const goToLandingPage = () => {
    if(!landingPage.value) return console.error('No landing page found');
    window.open(landingPage.value, '_blank');
}
onMounted(async () => {
    await getTransaction();
})
</script>
