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
                <div class="flex min-h-full items-center justify-center text-center">
                    <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all">
                            <div v-if="job && !isLoadingJob">
                                <div class="flex flex-col gap-2 justify-start items-start border rounded-md">
                                    <span class="px-5 pt-5 text-left">
                                        <h1 class="text-xl font-bold">{{ job.title  }}</h1>
                                        <p class="text-md">{{ job.location }}</p>
                                        <p class="text-md">${{ job.salary }}</p>
                                        <p class="text-md">{{ job.type }}</p>
                                        <CardButton>
                                            Apply
                                        </CardButton>
                                    </span>
                                    <div class="w-full border-t-2 h-64 overflow-y-scroll">
                                        <p class="text-md text-left p-5">{{ job.description }}</p>
                                    </div>
                                    <div class="w-full flex flex-col gap-2 justify-start items-start px-5 pb-5">
                                        <div v-for="task in job.tasks">
                                            <p class="text-md">{{ task }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <LoadingSpinner :isLoading="isLoadingJob"/>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
<script setup lang="ts">
import { type PropType, ref, onMounted } from 'vue';
import type { Job } from '@/types';
import { queryForCollectionGroupDocumentById } from '@/firebase/utils';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import CardButton from '@/components/props/CardButton.vue';
import { 
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
} from '@headlessui/vue'
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
const { modals } = storeToRefs(useModalStore());
const isOpen = ref(true)
function setIsOpen(value:boolean) {
  isOpen.value = value
  modals.value['viewjob'] = value;
}
const job = ref({} as Job);
const isLoadingJob = ref(false);
const loadJob = async () => {
    const jobId = modals.value['context'].__key;
    if (!jobId) return;
    isLoadingJob.value = true;
    job.value = await queryForCollectionGroupDocumentById('jobs', jobId, 'jobId') as Job;
    isLoadingJob.value = false;
}
onMounted(async () => {
    await loadJob();
})
</script>