<template>
    <div class="max-w-md mx-auto">
      <div>
        <div class="mb-4">
          <input v-model="confirmKeyword" type="text" id="confirmKeyword" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="flex items-center justify-between mt-4">
          <CardButton 
            @click="$emit('close')"
            :classes="'w-20'"
            >
                Cancel
          </CardButton>
          <ButtonWithLoading
            :disabled="confirmKeyword != props.context.__key"
            @click="onConfirm"
            :isLoading="isLoading"
            >Delete
          </ButtonWithLoading>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue';
  import CardButton from '@/components/props/CardButton.vue';
  import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
  import { useFirebaseFunctionCall } from '@/firebase/utils';
  import { useModalStore } from '@/stores/modals';
  import { storeToRefs } from 'pinia';
  const { notifications } = storeToRefs(useModalStore());
  const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
  const emits = defineEmits(['close']);
  const props = defineProps({
    context: {
      type: Object,
      required: true
    }
  
  })
  const isLoading = ref(false);
  const confirmKeyword = ref('');
  const onConfirm = async () => {
    isLoading.value = true;
    if(confirmKeyword.value == props.context.__key) {
        await manageRemove();
        emits("close");
    }
    isLoading.value = false;
  };
  const manageRemove = async () => {
    if(props.context.__key == 'ad') {
      const { callFunction } = useFirebaseFunctionCall(
        'removeAd',
        {adId:props.context.adId},
        isLoading,
        undefined,
        undefined,
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Ad removed!';
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'Error while removing ad, please try again later';
        },
      );
      await callFunction();
    }
    if(props.context.__key == 'job') {
      const { callFunction } = useFirebaseFunctionCall(
        'removeJobPost',
        {jobId:props.context.jobId},
        isLoading,
        undefined,
        undefined,
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Ad removed!';
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'Error while removing ad, please try again later';
        },
      );
      await callFunction();
    }
    if(props.context.__key == 'gig') {
      const { callFunction } = useFirebaseFunctionCall(
        'removeGigPost',
        {gigId:props.context.gigId},
        isLoading,
        undefined,
        undefined,
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Gig removed!';
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'Error while removing gig, please try again later';
        },
      );
      await callFunction();
    }
    if(props.context.__key == 'application') {
      const { callFunction } = useFirebaseFunctionCall(
        'removeApplication',
        {applicationId:props.context.applicationId},
        isLoading,
        undefined,
        undefined,
        () => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Gig removed!';
        },
        (error) => {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'Error while removing gig, please try again later';
        },
      );
      await callFunction()
    }
  }
  </script>