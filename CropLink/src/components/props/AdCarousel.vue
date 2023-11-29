<template>
    <div class="carousel">
      <div class="carousel-inner" :style="{ transform: `translateX(-${currentIndex * 50}%)` }">
        <div class="carousel-item" v-for="(chunk, index) in chunkedAds" :key="index">
          <SellerAdCarouselCard v-for="(ad, adIndex) in chunk" :key="adIndex" :ad="ad" />
        </div>
      </div>
      <ChevronLeftIcon v-if="chunkedAds.length > 1" @click="prev" class="carousel-prev"/>
      <ChevronRightIcon v-if="chunkedAds.length > 1" @click="next" class="carousel-next"/>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import SellerAdCarouselCard from  '@/components/cards/SellerAdCarouselCard.vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import { getPaginatedCollectionGroupWhereWhere } from '@/firebase/utils';
import type { SellerAd, BuyerAd } from '@/types';
const props = defineProps({
  sellerId: {
    type: String,
    required: true
  }
});
const currentIndex = ref(0);

const chunkedAds = computed(() => {
  const size = 2;
  return liveAds.value.reduce((acc, ad, index) => {
    const chunkIndex = Math.floor(index / size);
    if(!acc[chunkIndex]) {
      acc[chunkIndex] = []; // start a new chunk
    }
    acc[chunkIndex].push(ad);
    return acc;
  }, []);
});

const next = () => {
  if (currentIndex.value < chunkedAds.value.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
};

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = chunkedAds.value.length - 1;
  }
};
const liveAds = ref([] as SellerAd[]|BuyerAd[]);
const isLoadingAds = ref(true);
onMounted(async() => {
    isLoadingAds.value = true;
    const promises = [];
    promises.push(getPaginatedCollectionGroupWhereWhere('ads', 'live', '==', true, 'uid', '==', props.sellerId, ['postedOn','desc'], 3).then((paginatedAds)=>{
        liveAds.value = paginatedAds.docs as SellerAd[]|BuyerAd[];
        isLoadingAds.value = false;
    }));
    await Promise.all(promises);
})
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
  display: flex;
  flex: 0 0 50%;
}
.carousel-prev,
.carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0,0,0,0.5);
  border: none;
  width:1.5rem;
  height:1.5rem;
}
.carousel-prev {
  left: 10px;
}
.carousel-next {
  right: 10px;
}
</style>
