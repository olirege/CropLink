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
                                        <p class="text-md">${{ job.salaryMin }} - {{  job.salaryMax }} </p>
                                        <p class="text-md">{{ job.type }}</p>
                                        <CardButton @click="onApply">
                                            Apply
                                        </CardButton>
                                    </span>
                                    <template v-if="!showApplyResponse">
                                        <div class="w-full border-t-2 h-64 overflow-y-scroll">
                                            <p class="text-md text-left p-5">{{ job.description }}</p>
                                        </div>
                                        <div class="w-full flex flex-col gap-2 justify-start items-start px-5 pb-5">
                                            <div v-for="task in job.tasks">
                                                <p class="text-md">{{ task }}</p>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="w-full border-t-2 h-96 overflow-y-scroll">
                                            <div>
                                                <label for="name" class="block text-sm font-medium text-gray-700">
                                                    Name
                                                </label>
                                                <div class="mt-1">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        autocomplete="given-name"
                                                        v-model="application.name"
                                                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <label for="email" class="block text-sm font-medium text-gray-700">
                                                    Email
                                                </label>
                                                <div class="mt-1">
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        v-model="application.email"
                                                        autocomplete="email"
                                                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <label from="phone" class="block text-sm font-medium text-gray-700">
                                                    Phone
                                                </label>
                                                <div class="mt-1">
                                                    <input
                                                        id="phone"
                                                        name="phone"
                                                        type="tel"
                                                        autocomplete="tel"
                                                        v-model="application.phone"
                                                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <label for="resume" class="block text-sm font-medium text-gray-700">
                                                    Resume
                                                </label>
                                                <div class="mt-1">
                                                    <input
                                                        id="resume"
                                                        name="resume"
                                                        type="file"
                                                        ref="resume"
                                                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        @change="onFileChange"
                                                    />
                                                </div>
                                               <ButtonWithLoading :isLoading="isLoadingSubmit" @click="onSubmitResume" classes="w-full">
                                                    Submit
                                                </ButtonWithLoading>
                                            </div>
                                        </div>
                                    </template>
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
import { ref, onMounted, reactive } from 'vue';
import type { Job } from '@/types';
import { queryForCollectionGroupDocumentById } from '@/firebase/utils';
import LoadingSpinner from '@/components/props/LoadingSpinner.vue';
import CardButton from '@/components/props/CardButton.vue';
import ButtonWithLoading from '../props/ButtonWithLoading.vue';
import { 
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
} from '@headlessui/vue'
import { useModalStore } from '@/stores/modals';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main';
import { getStorage, ref as fbStorageRef, uploadBytes } from 'firebase/storage';
import { useFirebaseFunctionCall } from '@/firebase/utils';
const { user } = storeToRefs(useMainStore());
const uploadFileToFirebaseStorage = async (file) => {
    const storage = getStorage();
    const storageRef = fbStorageRef(storage, `resumes/${user.value.uid}/` + file.name); // Unique path for each file
    await uploadBytes(storageRef, file);
    return storageRef.fullPath; // Return the reference to the file
};

const showApplyResponse = ref(false);
const onApply = () => {
    showApplyResponse.value = true;
}
const { modals, notifications } = storeToRefs(useModalStore());
const NOTIFICATION_TYPES = useModalStore().NOTIFICATION_TYPES;
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
const application = reactive({
    name: '',
    email: '',
    phone: '',
    resume: ''
})
const onFileChange = (e:any) => {
    const file = e.target.files[0];
    application.resume = file;
}
const isLoadingSubmit = ref(false);
const onSubmitResume = async () => {
    console.log("application", application);
    application.parentId = job.value.jobId;
    application.parentType = 'job';
    application.ownerId = job.value.posterId;
    const fileRef = await uploadFileToFirebaseStorage(application.resume);
    application.resume = fileRef;
    const deepCopy = JSON.parse(JSON.stringify(application));
    const { callFunction } = useFirebaseFunctionCall(
        'submitApplication',
        deepCopy,
        isLoadingSubmit,
        undefined,
        undefined,
        ()=> {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.SUCCESS;
            notifications.value.message = 'Application submitted';
        },
        ()=> {
            notifications.value.show = true;
            notifications.value.type = NOTIFICATION_TYPES.ERROR;
            notifications.value.message = 'An error occured while submitting application, please try again later';
        }
    )
    await callFunction();
}
onMounted(async () => {
    await loadJob();
    await increaseJobViewCount(modals.value['context'].__key);
})
const increasingViewCount = ref(false);
const increaseJobViewCount = async (jobId:string) => {
    if(!jobId) return;
    console.log("jobId", jobId);
    const { callFunction } = useFirebaseFunctionCall(
            'increaseJobViewCount',
            {jobId},
            increasingViewCount,
        );
        await callFunction();
}
</script>