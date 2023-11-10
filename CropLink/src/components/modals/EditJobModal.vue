<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="setIsOpen(false)" class="relative z-10">
            <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900">
                                Edit Job Post
                            </DialogTitle>
                            <DialogDescription class="mt-2 mb-4">
                                <p class="text-sm text-gray-500">
                                    Edit a Job Post
                                </p>
                            </DialogDescription>
                            <JobPostEditForm @close="setIsOpen(false)" :job="(modals['context'] as Job)"/>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
<script setup lang="ts">
import JobPostEditForm from '@/components/forms/JobPostEditForm.vue';
import type { Job } from '@/types';
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { 
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
} from '@headlessui/vue'
const { modals } = storeToRefs(useModalStore());
const isOpen = ref(true)
function setIsOpen(value:boolean) {
  isOpen.value = value
  modals.value['editjob'] = value;
  modals.value['context'] = {};
}
</script>