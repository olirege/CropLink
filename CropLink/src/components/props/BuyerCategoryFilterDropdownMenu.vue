<template>
    <div class="relative sm:hidden">
        <Menu as="div" class="relative inline-block text-left">
        <div>
            <MenuButton
            class="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-bg/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
            >
            <div class="pt-2">
                <AdjustmentsHorizontalIcon class="h-10 w-10" />
            </div>
            </MenuButton>
        </div>

        <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
            <MenuItems
            class="absolute p-2 left-0 mt-2 z-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
            <h1 class="text-2xl font-bold mb-2 capitalize">Filters</h1>
                <span class="divide-y">
                    <div class="py-4">
                        <p class="text-sm mb-2">Cost per Ton</p>
                        <div class="flex flex-row gap-2 items-center">
                            <input type="number" class="text-xs border rounded-md w-1/2 p-2" v-model="filtersBuffer.minCostPerTon" min="0"/>
                            <p>-</p>
                            <input type="number" class="text-xs border rounded-md w-1/2 p-2" v-model="filtersBuffer.maxCostPerTon" min="0"/>
                        </div>
                    </div>
                    <span class="py-4">
                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" id="verifiedseller" v-model="filtersBuffer.verifiedSeller"/>
                            <label class="text-sm" for="verifiedseller">Verified Buyer</label>
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" id="certifiedOrganic" v-model="filtersBuffer.certifiedOrganic"/>
                            <label class="text-sm" for="certifiedOrganic truncate">Certified Organic</label>
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" id="offersshipping" v-model="filtersBuffer.offersShipping"/>
                            <label class="text-sm" for="offersshipping">Offers shipping</label>
                        </div>
                    </span>
                </span>
                <MenuItem 
                class="p-2"
                v-slot="{ close }"
                >
                    <button
                    type="button"
                    class="w-full flex justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    @click="()=>{onSave(); close();}"
                    >
                    Apply Filters
                    </button>
                </MenuItem>
            </MenuItems>
        </transition>
        </Menu>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem,  } from '@headlessui/vue'
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
const props = defineProps({
  filters: Object,
  selectableVariety: Array,
});
const filtersBuffer = ref({});

// Deep copy the filters into the buffer when the props change
watch(() => props.filters, (newFilters) => {
  filtersBuffer.value = JSON.parse(JSON.stringify(newFilters));
}, { deep: true, immediate: true });

const emit = defineEmits(['updateFilters']);
const onSave = () => {
    emit('updateFilters', filtersBuffer.value);
}

</script>