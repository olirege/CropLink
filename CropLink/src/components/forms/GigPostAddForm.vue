<template>
    <div class="max-w-md mx-auto">
      <div>
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input v-model="gig.title" type="text" id="title" name="title" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="gig.description" id="description" name="description" rows="4" class="mt-1 p-2 w-full border rounded-md resize-none" required></textarea>
        </div>
        <div class="mb-4">
          <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
          <input v-model="gig.location" type="text" id="location" name="location" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4 space-y-2">
          <span class="w-full flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">Milestones</label>
            <button @click="addMilestone" type="button" class="mt-2 text-blue-500 hover:text-blue-700">Add Milestone</button>
          </span>
          <div v-for="(milestone, index) in gig.milestones" :key="index" class="flex flex-col justify-start gap-1">
            <p>{{ index + 1  }}.</p>
            <input v-model="gig.milestones[index].name" type="text" class="p-1 w-full border rounded-md" placeholder="Milestone Title" required />
            <textarea v-model="gig.milestones[index].description" type="text" class="p-1 w-full border rounded-md resize-none h-10" placeholder="Description" required />
            <div class="flex flex-row gap-1 items-center justify-end w-full">
              $CA
              <input v-model="gig.milestones[index].price" type="number" class="p-1 w-1/6 border rounded-md" placeholder="Reward" required />
            </div>
            <div class="flex flex-row w-full justify-end items-center">
              <TrashIcon @click="removeMilestone(index)" type="button" class="text-red-500 hover:text-red-700 h-5 w-5"/>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between mt-4">
          <CardButton 
            @click="$emit('close')"
            :classes="'w-20'"
            >
                Cancel
          </CardButton>
          <ButtonWithLoading
            @click="submitGig"
            :isLoading="isPostingAd"
            >Create Gig
          </ButtonWithLoading>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue';
  import CardButton from '@/components/props/CardButton.vue';
  import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
  import { useModalStore } from '@/stores/modals';
  import { storeToRefs } from 'pinia';
  import { useFirebaseFunctionCall } from '@/firebase/utils';
  import { TrashIcon } from '@heroicons/vue/24/outline';
  const { notifications } = storeToRefs(useModalStore());
  const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
  const emits = defineEmits(['close']);
  const gig = ref({
    createdAt: null,
    title: '',
    description: '',
    location: '',
    milestones: [] as object [],
  });
  
  const addMilestone = () => {
    gig.value.milestones.push({name: '', price: 0});
  };
  
  const removeMilestone = (index:number) => {
    gig.value.milestones.splice(index, 1);
  };
  
  const validateGig = () => {
    if(!gig.value.title || !gig.value.description || !gig.value.location || !gig.value.milestones.length) {
      if(gig.value.milestones.length > 0 ) {
        for(const milestone in gig.value.milestones) {
          if(!milestone) {
            // remove the empty milestone
            const index = gig.value.milestones.indexOf(gig.value.milestones[milestone]);
            gig.value.milestones.splice(index, 1);
          }
        }
      }
      return false;
    }
    else {
      return true;
    }
  };
  const isPostingAd = ref(false);
  const submitGig = async () => {
    if(validateGig()) {
      const deepCopy = JSON.parse(JSON.stringify(gig.value));
      const { callFunction } = useFirebaseFunctionCall(
        'createGigPost',
        deepCopy,
        isPostingAd,
        undefined,
        undefined,
        ()=> {
          notifications.value.show = true;
          notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
          notifications.value.message = 'Gig Created';
        },
        ()=> {
          notifications.value.show = true;
          notifications.value.type = NOTIFICATION_TYPES.ERROR;
          notifications.value.message = 'An error occured during the process, please try again later';
        },
      );
      await callFunction();
      emits("close");
    }
  };
  </script>