<template>
    <div class="carousel">
      <div class="carousel-inner" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div class="carousel-item" v-for="(image, index) in images" :key="index">
          <img :src="(image as string)" class="object-cover rounded-lg" :class="classes" v-if="image"/>
        </div>
      </div>
      <ChevronLeftIcon v-if="images.length > 1" @click="prev" class="carousel-prev"/>
      <ChevronRightIcon v-if="images.length > 1" @click="next" class="carousel-next"/>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
const emits = defineEmits(['onClick'])
const props = defineProps({
    images: {
      type: Array,
      required: true
    },
    classes: {
      type: String,
      default: 'w-full h-48'
    }
})
const currentIndex = ref(0);

const next = () => {
    if (currentIndex.value < props.images.length - 1) {
        currentIndex.value++;
    } else {
        currentIndex.value = 0;
    }
};

const prev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    } else {
        currentIndex.value = props.images.length - 1;
    }
};
</script>
  
  <style scoped>
  .carousel {
    position: relative;
    overflow: hidden;
  }
  .carousel-inner {
    display: flex;
    transition: transform 0.5s;
  }
  .carousel-item {
    flex: 0 0 100%;
  }
  .carousel-prev,
  .carousel-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,1);
    border: none;
  }
  .carousel-prev {
    left: 10px;
    width:1.5rem;
    height:1.5rem;
  }
  .carousel-next {
    right: 10px;
    width:1.5rem;
    height:1.5rem;
  }
  </style>
  