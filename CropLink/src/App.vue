<template>
  <header  class="relative bg-sky-600 text-white sticky top-0 z-10">
    <div class="pb-3 px-6  w-full">
      <div class="mx-auto flex items-center h-24 border-sky-700/50 border-b">
        <div class="flex items-center">
          <img src="@/assets/croplink_logo.png" alt="CropLink Logo" class="w-12 h-12 mx-10 rounded-full">
        </div>
        <nav class="flex flex-row justify-between items-center w-full">
          <span class="sm:space-x-2 md:space-x-4 lg:space-x-6">
            <RouterLink class="hover:bg-sky-500/50 p-2 rounded-md" :class="{'bg-sky-700/50 text-white': selectedPage == 4}" to="/" v-if="profile" @click="selectedPage = 4">Feed</RouterLink>
            <RouterLink class="hover:bg-sky-500/50 p-2 rounded-md" :class="{'bg-sky-700/50 text-white': selectedPage == 1}" to="/userboard" v-if="profile" @click="selectedPage = 1">Dashboard</RouterLink>
            <RouterLink class="hover:bg-sky-500/50 p-2 rounded-md" :class="{'bg-sky-700/50 text-white': selectedPage == 2}" to="/signup" v-if="!profile" @click="selectedPage = 2">Signin</RouterLink>
            <!-- <RouterLink class="hover:bg-sky-500/50 p-2 rounded-md" :class="{'bg-sky-700/50 text-white': selectedPage == 3}" to="/profile" v-if="profile" @click="selectedPage = 3">Profile</RouterLink> -->
          </span>
          <span class="flex flex-row gap-2 items-center">
            <a class="hover:bg-sky-500 p-2 rounded-md" @click="onSignout">Signout</a>
            <BellIcon class="h-6 w-6 text-white cursor-pointer"/>
            <Cog6ToothIcon class="h-6 w-6 text-white cursor-pointer" v-if="profile" @click="()=>{selectedPage = 3; router.push({name: 'profile'})}"/>
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
  <!-- <div class=" pl-6 h-24 w-full bg-sky-600 flex justify-start">
    <h1 class="text-4xl font-bold text-white text-center pt-6 capitalize">{{ currentPageName }}</h1>
  </div> -->
  <div class="relative">
    <div class="h-24 w-full absolute top-0 left-0 bg-sky-600 -z-10"/>
    <div class="mx-6 flex flex-col border rounded-md z-1 bg-white">
      <RouterView />
    </div>
  </div>
  <DirectMessageComponent v-if="profile"/>
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
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { BellIcon, Cog6ToothIcon } from '@heroicons/vue/20/solid';
const { profile } = storeToRefs(useMainStore());
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

const onSignout = async () => {
  await useMainStore().signout();
  router.push('/signup');
}
</script>