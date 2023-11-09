<template>
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="translate-x-10 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition ease-in duration-300"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-10 opacity-0"
    >
        <div v-if="notifications.show" class="fixed top-5 right-5 z-50 flex items-center space-x-2 p-4 border-l-4 shadow-md rounded-lg transition-all bg-white" :class="notificationBorderClass">
            <div v-if="notifications.type">
                <CheckCircleIcon v-if="notifications.type === NOTIFICATION_TYPES.SUCCESS" class="h-6 w-6 text-green-500" aria-hidden="true" />
                <XCircleIcon v-if="notifications.type === NOTIFICATION_TYPES.ERROR" class="h-6 w-6 text-red-500" aria-hidden="true" />
                <ExclamationTriangleIcon v-if="notifications.type === NOTIFICATION_TYPES.WARNING" class="h-6 w-6 text-yellow-500" aria-hidden="true" />
                <InformationCircleIcon v-if="notifications.type === NOTIFICATION_TYPES.INFO" class="h-6 w-6 text-blue-500" aria-hidden="true" />
            </div>
            <div v-if="notifications.message" class="text-sm font-medium">
                <p>{{ notifications.message }}</p>
            </div>
        </div>
    </Transition>
</template>
<script setup lang="ts">
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { ref, watch, computed } from 'vue';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
const { notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
const TIMER = 5000;
const countdown = ref(TIMER);
const startCountdown = () => {
    countdown.value = TIMER;
    const interval = setInterval(() => {
        countdown.value -= 1000;
        if(countdown.value <= 0) {
            clearInterval(interval);
            useModalStore().resetNotification();
        }
    }, 1000);
}
watch(notifications, (newVal,oldVal) => {
    console.log('notifications changed');
    if(newVal.show) {
        startCountdown();
    }
},{ deep: true })
const notificationBorderClass = computed(() => {
    switch (notifications.value.type) {
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
</script>