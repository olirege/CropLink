<template>
    <div class="max-w-md mx-auto">
      <div>
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input v-model="newJob.title" type="text" id="title" name="title" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="newJob.description" id="description" name="description" rows="4" class="mt-1 p-2 w-full border rounded-md resize-none" required></textarea>
        </div>
        <Listbox
        :items="['Full Time', 'Part Time', 'Contract']"
        v-model="newJob.type"
        placeholder="Select an Employment Type"
        />
        <div class="mb-4">
          <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
          <input v-model="newJob.location" type="text" id="location" name="location" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4">
          <label for="salary" class="block text-sm font-medium text-gray-700">Salary</label>
          <input v-model="job.salaryMin" type="number" id="salary" name="salary" class="mt-1 p-2 w-full border rounded-md" required />
          <span class="text-sm text-gray-500">to</span>
          <input v-model="job.salaryMax" type="number" id="salary" name="salary" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4 space-y-2">
          <span class="w-full flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">Tasks</label>
            <button @click="addTask" type="button" class="mt-2 text-blue-500 hover:text-blue-700">Add Task</button>
          </span>
          <div v-for="(task, index) in newJob.tasks" :key="index" class="flex items-center space-x-2">
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
            :isLoading="isEditingJob"
            >Edit Job
          </ButtonWithLoading>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue';
  import CardButton from '@/components/props/CardButton.vue';
  import Listbox from '../props/Listbox.vue';
  import ButtonWithLoading from '@/components/props/ButtonWithLoading.vue';
  import { storeToRefs } from 'pinia';
  import { useModalStore } from '@/stores/modals';  
  import { useFirebaseFunctionCall } from '@/firebase/utils';
  import type { Job } from '@/types';
  const { notifications } = storeToRefs(useModalStore());
  const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
  const emits = defineEmits(['close']);
  const props = defineProps({
    job: {
      type: Object,
      required: true
    }
  });
  const deepAdCopy = JSON.parse(JSON.stringify(props.job));
  const newJob = ref({
    createdAt: deepAdCopy.createdAt,
    title: deepAdCopy.title,
    type: deepAdCopy.type,
    description: deepAdCopy.description,
    location: deepAdCopy.location,
    salary: deepAdCopy.salary,
    tasks: deepAdCopy.tasks,
  });
  
  const addTask = () => {
    newJob.value.tasks.push('');
  };
  
  const removeTask = (index:number) => {
    newJob.value.tasks.splice(index, 1);
  };
  const validateJob = () => {
    if(!newJob.value.title || !newJob.value.description || !newJob.value.location || !newJob.value.tasks.length) {
      if(newJob.value.tasks.length > 0 ) {
        for(const task in newJob.value.tasks) {
          if(!task) {
            // remove the empty task
            const index = newJob.value.tasks.indexOf(task);
            newJob.value.tasks.splice(index, 1);
          }
        }
      }
      return false;
    }
    else {
      return true;
    }
  };
  const isEditingJob = ref(false);
  const submitJob = async () => {
    if(validateJob()) {
      const originalJob = props.job;
      const changes = Object.keys(newJob.value).reduce((acc, key) => {
        if(key === 'tasks') {
          acc[key] = newJob.value[key].filter((task) => {
            return task !== '';
          });
          return acc;
        }
        if(key === 'createdAt') {
          return acc;
        }
        if(newJob.value[key] !== originalJob[key]) {
          acc[key] = newJob.value[key];
        }
        return acc;
      }, {} as Job);
      const deepCopy = JSON.parse(JSON.stringify(changes));
      console.log(changes)
      const jobId = props.job.jobId;
      const { callFunction } = useFirebaseFunctionCall(
        'editJobPost',
        {jobId, changes:deepCopy},
        isEditingJob,
        undefined,
        undefined,
        ()=> {
          notifications.value.show = true;
          notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
          notifications.value.message = 'Job Post Edited';
        },
        (error)=> {
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