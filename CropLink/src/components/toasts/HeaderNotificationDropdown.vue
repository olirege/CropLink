<template>
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="-translate-y-10 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-10 opacity-0"
    >
      <div v-if="dropdowns.show" class="absolute top-0 left-0 z-50 flex items-center space-x-2 p-4 border-b-4 shadow-md transition-all bg-white w-full" :class="dropdownBorderClass">
          <div v-if="dropdowns.type">
              <CheckCircleIcon v-if="dropdowns.type === NOTIFICATION_TYPES.SUCCESS" class="h-6 w-6 text-green-500" aria-hidden="true" />
              <XCircleIcon v-if="dropdowns.type === NOTIFICATION_TYPES.ERROR" class="h-6 w-6 text-red-500" aria-hidden="true" />
              <ExclamationTriangleIcon v-if="dropdowns.type === NOTIFICATION_TYPES.WARNING" class="h-6 w-6 text-yellow-500" aria-hidden="true" />
              <InformationCircleIcon v-if="dropdowns.type === NOTIFICATION_TYPES.INFO" class="h-6 w-6 text-blue-500" aria-hidden="true" />
          </div>
          <div v-if="dropdowns.message" class="text-sm font-medium text-black">
              <p>{{ dropdowns.message }}</p>
          </div>
          <XCircleIcon @click="onClose" class="absolute right-1 h-5 w-5 text-black" aria-hidden="true" />
      </div>
  </Transition>
</template>
<script setup lang="ts">
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
const { dropdowns } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const dropdownBorderClass = computed(() => {
  switch (dropdowns.value.type) {
      case NOTIFICATION_TYPES.SUCCESS:
          return 'border-green-500 bg-green-50';
      case NOTIFICATION_TYPES.ERROR:
          return 'border-red-500 bg-red-50';
      case NOTIFICATION_TYPES.WARNING:
          return 'border-yellow-500 bg-yellow-50';
      case NOTIFICATION_TYPES.INFO:
          return 'border-blue-500 bg-blue-50';
      default:
          return '';
  }
});
const onClose = () => {
  dropdowns.value.show = false;
}
</script>