<template>
  <div class="container mx-auto">
    <span  class="w-full max-w-lg">
      <div class="flex flex-wrap">
        <div class="w-full space-y-2">
          <label class="block text-sm font-medium text-gray-700" for="first-name">
            First Name
          </label>
          <input v-model="form.first_name" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="first-name" type="text" placeholder="John">
        </div>
        <div class="w-full space-y-2">
          <label class="block text-sm font-medium text-gray-700" for="middle-name">
            Middle Name
          </label>
          <input v-model="form.middle_name" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="middle-name" type="text" placeholder="Kane">
        </div>
        <div class="w-full space-y-2">
          <label class="block text-sm font-medium text-gray-700" for="last-name">
            Last Name
          </label>
          <input v-model="form.last_name" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="last-name" type="text" placeholder="Smith">
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <div class="w-1/2 space-y-2">
          <label class="block text-sm font-medium text-gray-700" for="email">
            Email
          </label>
          <input v-model="form.email" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="email" type="email" placeholder="john@test.escrow.com">
        </div>
        <div class="w-1/2 space-y-2">
          <label class="block text-sm font-medium text-gray-700" for="phone-number">
            Phone Number
          </label>
          <input v-model="form.phone_number" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="phone-number" type="text" placeholder="+18885118600">
        </div>
      </div>
      <div class="w-full space-y-2">
        <label class="block text-sm font-medium text-gray-700" for="address-line1">
          Address Line 1
        </label>
        <input v-model="form.address.line1" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="address-line1" type="text" placeholder="1829 West Lane">
      </div>
      <div class="w-full space-y-2">
        <label class="block text-sm font-medium text-gray-700" for="address-line2">
          Address Line 2
        </label>
        <input v-model="form.address.line2" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="address-line2" type="text" placeholder="Apartment 301020">
      </div>
      <div class="flex flex-row gap-2">
        <div class="w-1/2 space-y-2">
          <label class="block text-sm font-medium text-gray-700" for="city">
            City
          </label>
          <input v-model="form.address.city" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="city" type="text" placeholder="San Francisco">
        </div>
        <div class="w-1/2 space-y-2">
          <label class="block text-sm font-medium text-gray-700" for="state">
            State
          </label>
          <input v-model="form.address.state" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="state" type="text" placeholder="CA">
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <div class="w-1/2 space-y-2">
          <label class="block text-sm font-medium text-gray-700" for="country">
            Country
          </label>
          <input v-model="form.address.country" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="country" type="text" placeholder="US">
        </div>
        <div class="w-1/2 space-y-2">
          <label class="block text-sm font-medium text-gray-700" for="post-code">
            Postal Code
          </label>
          <input v-model="form.address.post_code" class="bg-gray-200/70 p-2 rounded-md border-1 w-full" id="post-code" type="text" placeholder="10203">
        </div>
      </div>
       
      <div class="flex flex-wrap -mx-3 mb-2">
        <CardButton 
        @click="devFillForm">
          Dev Fill Form
        </CardButton>
        <div class="w-full md:w-1/3">
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
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useFirebaseFunctionCall } from '@/firebase/utils';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
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
    const deepCopy = JSON.parse(JSON.stringify(form.value));
    let res;
    const { callFunction } = useFirebaseFunctionCall(
        'createEscrowAccount',
        deepCopy,
        isLoading,
        undefined,
        (data) => {
            res = data;
        },
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Escrow account created successfully';
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'Error while creating escrow account, please try again later';
        },
    );
    await callFunction();
    if(res) {
      emits('success')
    } else {
      emits('failure')
    }
};
</script>