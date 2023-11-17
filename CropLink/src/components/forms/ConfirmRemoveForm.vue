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
  import { useMainStore } from '@/stores/main';
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
    if(props.context.__key == 'job') {
      await useMainStore().removeJobPostAd(props.context.jobId);
    }
    if(props.context.__key == 'gig') {
      await useMainStore().removeGigPostAd(props.context.gigId);
    }
    if(props.context.__key == 'application') {
      await useMainStore().removeApplication(props.context.applicationId);
    }
  }
  </script>