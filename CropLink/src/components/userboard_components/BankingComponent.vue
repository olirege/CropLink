<template>
    <div>
        <h1>Banking Component</h1>
        <button @click="createTransaction">Buy</button>
    </div>
</template>

<script setup lang="ts">
import { createTransactionCallable } from '@/firebase/callables';
const createATransaction = createTransactionCallable();
const createTransaction = async () => { 
    await createATransaction();
};
</script>
