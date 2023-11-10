<template>
  <div class="container mx-auto">
    <span  class="w-full max-w-lg">
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="first-name">
            First Name
          </label>
          <input v-model="form.first_name" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="first-name" type="text" placeholder="John">
        </div>
        <div class="w-full md:w-1/2 px-3">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="middle-name">
            Middle Name
          </label>
          <input v-model="form.middle_name" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="middle-name" type="text" placeholder="Kane">
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="last-name">
            Last Name
          </label>
          <input v-model="form.last_name" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="last-name" type="text" placeholder="Smith">
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="email">
            Email
          </label>
          <input v-model="form.email" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder="john@test.escrow.com">
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="address-line1">
            Address Line 1
          </label>
          <input v-model="form.address.line1" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="address-line1" type="text" placeholder="1829 West Lane">
        </div>
        <div class="w-full px-3">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="address-line2">
            Address Line 2
          </label>
          <input v-model="form.address.line2" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="address-line2" type="text" placeholder="Apartment 301020">
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="city">
            City
          </label>
          <input v-model="form.address.city" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="city" type="text" placeholder="San Francisco">
        </div>
        <div class="w-full md:w-1/2 px-3">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="state">
            State
          </label>
          <input v-model="form.address.state" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="state" type="text" placeholder="CA">
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="country">
            Country
          </label>
          <input v-model="form.address.country" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="country" type="text" placeholder="US">
        </div>
        <div class="w-full md:w-1/2 px-3">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="post-code">
            Postal Code
          </label>
          <input v-model="form.address.post_code" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="post-code" type="text" placeholder="10203">
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="phone-number">
            Phone Number
          </label>
          <input v-model="form.phone_number" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="phone-number" type="text" placeholder="+18885118600">
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-2">
        <CardButton 
        @click="devFillForm">
          Dev Fill Form
        </CardButton>
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <ButtonWithLoading
          :isLoading="isLoading" 
          @click="submitForm">
            Submit
          </ButtonWithLoading>
          <button @click="$emit('cancel')">
            Cancel
          </button>
        </div>
      </div>
    </span>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useMainStore } from '@/stores/main';
import ButtonWithLoading from '../props/ButtonWithLoading.vue';
import CardButton from '../props/CardButton.vue';
const emits = defineEmits(['success','failure', 'cancel']);
const form = ref({
  email: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: '',
    post_code: ''
  },
  phone_number: ''
});
const isLoading = ref(false);
const devFillForm = () => {
  form.value = {
    email: 'test@test.com',
    first_name: 'John',
    middle_name: 'Kane',
    last_name: 'Smith',
    address: {
      line1: '1829 West Lane',
      line2: 'Apartment 301020',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      post_code: '10203'
    },
    phone_number: '+18885118600'
  }
}
const submitForm = async () => {
    isLoading.value = true;
    const deepCopy = JSON.parse(JSON.stringify(form.value));
    const res = await useMainStore().createEscrowUserAccount(deepCopy);
    isLoading.value = false;
    if(res) {
      emits('success')
    } else {
      emits('failure')
    }
};
</script>