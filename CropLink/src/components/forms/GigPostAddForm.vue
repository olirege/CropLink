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
          <div v-for="(milestone, index) in gig.milestones" :key="index" class="flex items-center space-x-2">
            <input v-model="gig.milestones[index].name" type="text" class="p-2 w-full border rounded-md" placeholder="Milestone" required />
            <input v-model="gig.milestones[index].price" type="number" class="p-2 w-full border rounded-md" placeholder="Milestone" required />
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
            :isLoading="isPostingAd"
            >Create Gig
          </ButtonWithLoading>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { type PropType, ref } from 'vue';
  import CardButton from '@/components/props/CardButton.vue';
  import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
  import { useMainStore } from '@/stores/main';
  import type { Gig } from '@/types';
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
    isPostingAd.value = true;
    if(validateGig()) {
      const deepCopy = JSON.parse(JSON.stringify(gig.value));
      await useMainStore().createGigPostAd(deepCopy);
      emits("close");
    }
    isPostingAd.value = false;
  };
  </script>