
<template>
  <header  class="relative bg-blue-900 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <img src="@/assets/croplink_logo.png" alt="CropLink Logo" class="w-10 h-10 mr-2 rounded-sm">
        <h1 class="text-3xl font-semibold pb-1">CropLink</h1>
      </div>
      <nav class="space-x-4">
        <RouterLink class="hover:underline" :class="{'bg-blue-700 text-white': selectedPage == 1}" to="/userboard" v-if="profile" @click="selectedPage = 1">Dashboard</RouterLink>
        <RouterLink class="hover:underline" :class="{'bg-blue-700 text-white': selectedPage == 2}" to="/signup" v-if="!profile" @click="selectedPage = 2">Signin</RouterLink>
        <RouterLink class="hover:underline" :class="{'bg-blue-700 text-white': selectedPage == 3}" to="/profile" v-if="profile" @click="selectedPage = 3">Profile</RouterLink>
        <RouterLink class="hover:underline" :class="{'bg-blue-700 text-white': selectedPage == 4}" to="/feed" v-if="profile" @click="selectedPage = 4">Feed</RouterLink>
        <a class="hover:underline" @click="onSignout">Signout</a>
      </nav>
    </div>
    <HeaderNotificationDropdown v-show="dropdowns.show"/>
  </header>
  <AddAdModal v-if="modals['addad']"/>
  <EditAdModal v-if="modals['editad']"/>
  <AddBidModal v-if="modals['addbid']"/>
  <EditJobModal v-if="modals['editjob']"/>
  <AddJobModal v-if="modals['addjob']"/>
  <ConfirmRemoveModal v-if="modals['confirmremove']"/>
  <StateNotificationToast v-show="notifications.show"/>
  <div class="w-full">
    <RouterView />
  </div>
  <DirectMessageComponent/>
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
import ConfirmRemoveModal from './components/modals/ConfirmRemoveModal.vue';
import StateNotificationToast from '@/components/toasts/StateNotificationToast.vue';
import HeaderNotificationDropdown from './components/toasts/HeaderNotificationDropdown.vue';
import DirectMessageComponent from './components/props/DirectMessageComponent.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const { profile } = storeToRefs(useMainStore());
const { modals, notifications, dropdowns } = storeToRefs(useModalStore());
const selectedPage = ref(0);

const router = useRouter();
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