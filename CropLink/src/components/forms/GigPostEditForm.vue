<template>
    <div class="max-w-md mx-auto">
      <div>
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input v-model="newGig.title" type="text" id="title" name="title" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="newGig.description" id="description" name="description" rows="4" class="mt-1 p-2 w-full border rounded-md resize-none" required></textarea>
        </div>
        <div class="mb-4">
          <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
          <input v-model="newGig.location" type="text" id="location" name="location" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4 space-y-2">
          <span class="w-full flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">Milestones</label>
            <button @click="addMilestone" type="button" class="mt-2 text-blue-500 hover:text-blue-700">Add Milestone</button>
          </span>
          <div v-for="(milestone, index) in newGig.milestones" :key="index" class="flex items-center space-x-2">
            <input v-model="gig.milestones[index].name" type="text" class="p-2 w-full border rounded-md" placeholder="Type name here..." required />
            <input v-model="gig.milestones[index].description" type="text" class="p-2 w-full border rounded-md" placeholder="Type description here..." required />
            <input v-model="gig.milestones[index].price" type="number" class="p-2 w-full border rounded-md" placeholder="0" required />
            <button @click="removeMilestone(index)" type="button" class="text-red-500 hover:text-red-700">Remove</button>
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
            :isLoading="isEditingGig"
            >Edit Gig
          </ButtonWithLoading>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue';
  import CardButton from '@/components/props/CardButton.vue';
  import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
  import { storeToRefs } from 'pinia';
  import { useModalStore } from '@/stores/modals';
  import { useFirebaseFunctionCall } from '@/firebase/utils';
  import type { Gig } from '@/types';
  const { notifications } = storeToRefs(useModalStore());
  const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
  const emits = defineEmits(['close']);
  const props = defineProps({
    gig: {
      type: Object,
      required: true
    }
  });
  const deepAdCopy = JSON.parse(JSON.stringify(props.gig));
  const newGig = ref({
    createdAt: deepAdCopy.createdAt,
    title: deepAdCopy.title,
    description: deepAdCopy.description,
    location: deepAdCopy.location,
    milestones: deepAdCopy.milestones,
  });
  
  const addMilestone = () => {
    newGig.value.milestones.push('');
  };
  
  const removeMilestone = (index:number) => {
    newGig.value.milestones.splice(index, 1);
  };
  const validateGig = () => {
    if(!newGig.value.title || !newGig.value.description || !newGig.value.location || !newGig.value.milestones.length) {
      if(newGig.value.milestones.length > 0 ) {
        for(const milstone in newGig.value.milestones) {
          if(!milstone) {
            // remove the empty milstone
            const index = newGig.value.milestones.indexOf(milstone);
            newGig.value.milestones.splice(index, 1);
          }
        }
      }
      return false;
    }
    else {
      return true;
    }
  };
  const isEditingGig = ref(false);
  const submitGig = async () => {
    if(validateGig()) {
      const originalGig = props.gig;
      const changes = Object.keys(newGig.value).reduce((acc, key) => {
        if(key === 'createdAt') {
          return acc;
        }
        if(newGig.value[key] !== originalGig[key]) {
          acc[key] = newGig.value[key];
        }
        return acc;
      }, {} as Gig);
      const deepCopy = JSON.parse(JSON.stringify(changes));
      console.log(changes)
      const gigId = props.gig.gigId;
      const { callFunction } = useFirebaseFunctionCall(
        'editGigPost',
        { gigId, changes:deepCopy },
        isEditingGig,
        undefined,
        undefined,
        ()=> {
          notifications.value.show = true;
          notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
          notifications.value.message = 'Gig Edited';
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