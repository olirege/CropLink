<template>
    <div class="absolute top-2 left-0 text-right">
      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton
            class="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-bg/30 hover:bg-cyan-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
          >
            Options
            <ChevronDownIcon
              class="-mr-1 ml-2 h-5 w-5 text-cyan-600 hover:text-cyan-600"
              aria-hidden="true"
            />
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
            class="absolute right-0 mt-2 z-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
          >
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-cyan-600/50 text-white' : 'text-gray-900',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                  ]"
                  @click="$emit('contact')"
                >
                  <EnvelopeIcon
                    :active="active"
                    class="mr-2 h-5 w-5 text-cyan-600"
                    aria-hidden="true"
                  />
                  Reach out
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-cyan-600/50 text-white' : 'text-gray-900',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                  ]"
                  @click="$emit('remove')"
                >
                  <TrashIcon
                    :active="active"
                    class="mr-2 h-5 w-5 text-cyan-600"
                    aria-hidden="true"
                  />
                  Remove
                </button>
              </MenuItem>
            </div>
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-cyan-600/50 text-white' : 'text-gray-900',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                  ]"
                  @click="$emit('view')"
                >
                  <EyeIcon
                    :active="active"
                    class="mr-2 h-5 w-5 text-cyan-600"
                    aria-hidden="true"
                  />
                  View Application
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </template>
  <script setup lang="ts">
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
  import { ChevronDownIcon } from '@heroicons/vue/20/solid'
  import { EnvelopeIcon, TrashIcon, EyeIcon } from '@heroicons/vue/24/outline';
  const emits = defineEmits(['remove', 'view', 'contact']);
  </script>