<template>
    <div class="max-w-md mx-auto p-4">
      <h2 class="text-2xl font-semibold mb-4">Create a New Job</h2>
      <form @submit.prevent="submitJob">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input v-model="job.title" type="text" id="title" name="title" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="job.description" id="description" name="description" rows="4" class="mt-1 p-2 w-full border rounded-md" required></textarea>
        </div>
        <div class="mb-4">
          <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
          <input v-model="job.location" type="text" id="location" name="location" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4">
          <label for="salary" class="block text-sm font-medium text-gray-700">Salary</label>
          <input v-model="job.salary" type="text" id="salary" name="salary" class="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Tasks</label>
          <div v-for="(task, index) in job.tasks" :key="index" class="flex items-center space-x-2">
            <input v-model="job.tasks[index]" type="text" class="p-2 w-full border rounded-md" placeholder="Task" required />
            <button @click="removeTask(index)" type="button" class="text-red-500 hover:text-red-700">Remove</button>
          </div>
          <button @click="addTask" type="button" class="mt-2 text-blue-500 hover:text-blue-700">Add Task</button>
        </div>
        <div class="mt-4">
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Create Job</button>
        </div>
      </form>
    </div>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const job = ref({
    createdAt: null, // You can set this as needed
    id: '', // You can generate an ID as needed
    title: '',
    description: '',
    location: '',
    salary: '',
    tasks: [],
  });
  
  const addTask = () => {
    job.tasks.push('');
  };
  
  const removeTask = (index) => {
    job.tasks.splice(index, 1);
  };
  
  const submitJob = () => {
    // Handle job submission here
    console.log(job);
  };
  </script>