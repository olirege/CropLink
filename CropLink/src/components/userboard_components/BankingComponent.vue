<template>
    <div>
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
import { getTransactionCallable } from '@/firebase/callables';
import { onMounted, ref } from 'vue';
import CardButton from '@/components/props/CardButton.vue';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
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
const getATransaction = getTransactionCallable();
const transaction = ref({} as any);
const isLoadingTransaction = ref(false);
const landingPage = ref({} as any);
const getTransaction = async () => {
    isLoadingTransaction.value = true;
    if(!props.contractId) return console.error('No contract id provided');
    const res = await getATransaction({transactionId:props.contractId});
    console.log(res);
    if(!res || !res.data.transaction) return console.error('No transaction found');
    transaction.value = res.data.transaction;
    landingPage.value = res.data.landingPage;
    isLoadingTransaction.value = false;
};
const goToLandingPage = () => {
    if(!landingPage.value) return console.error('No landing page found');
    window.open(landingPage.value, '_blank');
}
onMounted(async () => {
    await getTransaction();
})
</script>
