
<template>
  <header>
    <div class="wrapper">
      <h1>CropLink</h1>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/signup">Signup</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router' 
</script>