<template>
    <div class="flex min-h-full items-center">
        <div v-if="gig && !isLoadingGig">
            <div class="flex flex-col gap-2 justify-start items-start border rounded-md">
                <span class="px-5 pt-5 text-left">
                    <h1 class="text-xl font-bold">{{ gig.title  }}</h1>
                    <p class="text-md">{{ gig.location }}</p>
                </span>
                <div class="w-full border-t-2 max-h-64 overflow-y-scroll">
                    <p class="text-md text-left p-5">{{ gig.description }}</p>
                </div>
                <div class="w-full flex flex-col gap-2 justify-start items-start px-5 pb-5">
                    <label class="text-lg font-semibold border-b pb-2">Milestones:</label>
                    <span v-for="(milestone,index) in gig.milestones" class="w-full p-2 border rounded-md resize-none focus:border-blue-500 focus:ring-0 flex flex-col gap-2">
                        <span class="flex flex-row justify-between">
                            <span class="flex flex-row items-center gap-2"><p class="font-bold text-xl">{{ index + 1 +'.' }}</p><p class="italic text-xl">{{milestone.name}}</p></span>
                            <span class="flex flex-row gap-4"><CurrencyDollarIcon class="h-6 w-6"/><p v-currency="milestone.price"/></span>
                        </span>
                        <p>{{ milestone.description.substring(0,300) + '...' }}</p>
                    </span>
                </div>
            </div>
        </div>
        <div v-else>
            <LoadingSpinner :isLoading="isLoadingGig"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, type PropType } from 'vue';
import type { Gig } from '@/types';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline';
const props = defineProps({
    gig: {
        type:Object as PropType<Gig>,
        required:true,
    },
})
const isLoadingGig = ref(false);
</script>