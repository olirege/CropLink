<template>
    <div class="relative mt-1 w-72">
      <Listbox :modelValue="selectedValue" @update:modelValue="onChange" as="div" :disabled="disabled">
        <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span class="block truncate">{{ modelValue ? modelValue : placeholder  }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>
        <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          <ListboxOption v-for="item in items" :key="itemLabel ? item[itemLabel] : item" :value="itemLabel ? item[itemLabel] : item" v-slot="{ active, selected }">
            <li :class="{ 'bg-amber-100 text-amber-900': active, 'text-gray-900': !active }" class="relative cursor-default select-none py-2 pl-10 pr-4">
              <span :class="{ 'font-medium': selected, 'font-normal': !selected }" class="block truncate">{{ itemLabel ? item[itemLabel] : item }}</span>
              <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </div>
  </template>
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
  import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/24/outline';
  
  const props = defineProps({
    items: Array,
    modelValue: [String, Number],
    placeholder: String,
    itemLabel: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  });
  
  const emits = defineEmits(['update:modelValue']);
  const selectedValue = ref(props.modelValue);
  watch(() => props.modelValue, (newValue) => {
    selectedValue.value = newValue;
  });
  const onChange = (value) => {
    console.log('onChange', value);
    selectedValue.value = value
    emits('update:modelValue', value);
  };
  </script>