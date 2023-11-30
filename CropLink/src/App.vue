<template>
  <header  class="relative bg-sky-600 text-white sticky top-0 z-10 w-full" id="header__main">
    <div class="pb-3 px-2 sm:px-6  max-w-[1000px] mx-auto">
      <div class="mx-auto flex items-center h-16 border-sky-700/50 border-b justify-between">
        <div class="flex items-center gap-2">
          <img src="@/assets/croplink_logo_small.png" alt="CropLink Logo" class="w-12 h-12 sm:mx-10 rounded-full">
          <span class="sm:hidden flex items-center gap-2">
            <RouterLink class="hover:bg-sky-500/50 p-2 rounded-md" :class="{'bg-sky-700/50 text-white': selectedPage == 4}" to="/" @click="selectedPage = 4">
              <HomeIcon class="h-6 w-6 text-white cursor-pointer"/>
            </RouterLink>
            <RouterLink class="hover:bg-sky-500/50 p-2 rounded-md" :class="{'bg-sky-700/50 text-white': selectedPage == 1}" to="/userboard" v-if="user" @click="selectedPage = 1">
              <NewspaperIcon class="h-6 w-6 text-white cursor-pointer"/>
            </RouterLink>
            <RouterLink class="hover:bg-sky-500/50 p-2 rounded-md" :class="{'bg-sky-700/50 text-white': selectedPage == 2}" to="/signup" v-if="!user" @click="selectedPage = 2">
              <ArrowDownOnSquareIcon class="h-6 w-6 text-white cursor-pointer"/>
            </RouterLink>
          </span>
        </div>
        <nav class="flex flex-row justify-between items-center sm:w-full">
          <span class="hidden sm:block sm:space-x-2 md:space-x-4 lg:space-x-6">
            <RouterLink class="hover:bg-sky-500/50 p-2 rounded-md" :class="{'bg-sky-700/50 text-white': selectedPage == 4}" to="/" @click="selectedPage = 4">Home</RouterLink>
            <RouterLink class="hover:bg-sky-500/50 p-2 rounded-md" :class="{'bg-sky-700/50 text-white': selectedPage == 1}" to="/userboard" v-if="user" @click="selectedPage = 1">Dashboard</RouterLink>
            <RouterLink class="hover:bg-sky-500/50 p-2 rounded-md" :class="{'bg-sky-700/50 text-white': selectedPage == 2}" to="/signup" v-if="!user" @click="selectedPage = 2">Signin</RouterLink>
          </span>
          <span class="flex flex-row gap-2 items-center justify-between">
            <div class="p-2 bg-slate-500/40 rounded-md hidden sm:block">
              Alpha v.1.7.3
            </div>
            <a class="hover:bg-sky-500 p-2 rounded-md" @click="onSignout" v-if="user"><ArrowTopRightOnSquareIcon class="h-6 w-6 text-white cursor-pointer" /></a>
            <RouterLink class="hover:bg-sky-500/50 p-2 rounded-md" :class="{'bg-sky-700/50 text-white': selectedPage == 3}" to="/profile" v-if="user" @click="selectedPage = 3">
              <Cog6ToothIcon class="h-6 w-6 text-white cursor-pointer"/>
            </RouterLink>
            <img v-if="profile" :src="profile.profilePicResized" alt="Profile Photo" class="w-10 h-10 rounded-full bg-slate-500"/>
          </span>
        </nav>
      </div>
    </div>
    <HeaderNotificationDropdown v-show="dropdowns.show"/>
  </header>
  <AddAdModal v-if="modals['addad']"/>
  <EditAdModal v-if="modals['editad']"/>
  <AddBidModal v-if="modals['addbid']"/>
  <EditJobModal v-if="modals['editjob']"/>
  <AddJobModal v-if="modals['addjob']"/>
  <EditGigModal v-if="modals['editgig']"/>
  <AddGigModal v-if="modals['addgig']"/>
  <ConfirmRemoveModal v-if="modals['confirmremove']"/>
  <JobViewModal v-if="modals['viewjob']"/>
  <GigViewModal v-if="modals['viewgig']"/>
  <StateNotificationToast v-show="notifications.show"/>
  <div class="relative h-screen">
    <div class="hidden sm:block h-24 w-full absolute top-0 left-0 bg-sky-600 -z-10"/>
    <div class="flex flex-col border rounded-md z-1 bg-white p-1 sm:p-4 mx-auto max-w-[1000px]" v-if="!isLoading">
      <RouterView />
    </div>
    <div class="h-screen w-full flex items-center justify-center" v-if="isLoading">
      <LoadingSpinner :isLoading="isLoading"/>
    </div>
  </div>
  <DirectMessageComponent v-if="user"/>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main';
import { useModalStore } from '@/stores/modals';
import AddAdModal from '@/components/modals/AddAdModal.vue';
import EditAdModal from '@/components/modals/EditAdModal.vue'
import AddBidModal from '@/components/modals/AddBidModal.vue';
import AddJobModal from './components/modals/AddJobModal.vue';
import EditJobModal from './components/modals/EditJobModal.vue';
import AddGigModal from './components/modals/AddGigModal.vue';
import EditGigModal from './components/modals/EditGigModal.vue';
import ConfirmRemoveModal from './components/modals/ConfirmRemoveModal.vue';
import JobViewModal from './components/modals/JobViewModal.vue';
import GigViewModal from './components/modals/GigViewModal.vue';
import StateNotificationToast from '@/components/toasts/StateNotificationToast.vue';
import HeaderNotificationDropdown from './components/toasts/HeaderNotificationDropdown.vue';
import DirectMessageComponent from './components/props/DirectMessageComponentV2.vue';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Cog6ToothIcon, NewspaperIcon, HomeIcon, ArrowDownOnSquareIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/20/solid';
import LoadingSpinner from './components/props/LoadingSpinner.vue';
const { profile, user } = storeToRefs(useMainStore());
const { modals, notifications, dropdowns } = storeToRefs(useModalStore());
const selectedPage = ref(0);
const router = useRouter();
const currentPageName = computed(() => {
  const route = router.currentRoute.value;
  return route.name;
});
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !profile.value) {
    next('/signup'); 
  } else {
    next();
  }
});
const isLoading= ref(true);
onMounted(async () => {
  const timeout = 1000;
  setTimeout(() => {
    isLoading.value = false;
  }, timeout);
})
const onSignout = async () => {
  await useMainStore().signout();
  router.push('/signup');
}
</script>