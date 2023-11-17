<template>
    <div class="max-w-md mx-auto">
      <div>
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input v-model="job.title" type="text" id="title" name="title" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="job.description" id="description" name="description" rows="4" class="mt-1 p-2 w-full border rounded-md resize-none" required></textarea>
        </div>
        <Listbox
        :items="['Full Time', 'Part Time', 'Contract']"
        v-model="job.type"
        placeholder="Select an Employment Type"
        />
        <div class="mb-4">
          <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
          <input v-model="job.location" type="text" id="location" name="location" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4">
          <label for="salary" class="block text-sm font-medium text-gray-700">Salary</label>
          <input v-model="job.salary" type="text" id="salary" name="salary" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4 space-y-2">
          <span class="w-full flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">Tasks</label>
            <button @click="addTask" type="button" class="mt-2 text-blue-500 hover:text-blue-700">Add Task</button>
          </span>
          <div v-for="(task, index) in job.tasks" :key="index" class="flex items-center space-x-2">
            <input v-model="job.tasks[index]" type="text" class="p-2 w-full border rounded-md" placeholder="Task" required />
            <button @click="removeTask(index)" type="button" class="text-red-500 hover:text-red-700">Remove</button>
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
            @click="submitJob"
            :isLoading="isPostingAd"
            >Create Job
          </ButtonWithLoading>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { type PropType, ref } from 'vue';
  import CardButton from '@/components/props/CardButton.vue';
  import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
  import Listbox from '@/components/props/Listbox.vue';
  import { useMainStore } from '@/stores/main';
  import type { Job } from '@/types';
  const emits = defineEmits(['close']);
  const job = ref({
    createdAt: null,
    title: '',
    type: '',
    description: '',
    location: '',
    salary: '',
    tasks: [] as string [],
  });
  
  const addTask = () => {
    job.value.tasks.push('');
  };
  
  const removeTask = (index:number) => {
    job.value.tasks.splice(index, 1);
  };
  
  const validateJob = () => {
    if(!job.value.title || !job.value.description || !job.value.location || !job.value.salary || !job.value.type || !job.value.tasks.length) {
      if(job.value.tasks.length > 0 ) {
        for(const task in job.value.tasks) {
          if(!task) {
            // remove the empty task
            const index = job.value.tasks.indexOf(task);
            job.value.tasks.splice(index, 1);
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
  const submitJob = async () => {
    isPostingAd.value = true;
    if(validateJob()) {
      const deepCopy = JSON.parse(JSON.stringify(job.value));
      await useMainStore().createJobPostAd(deepCopy);
      emits("close");
    }
    isPostingAd.value = false;
  };
  </script>