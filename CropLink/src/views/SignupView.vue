<template>
  <div class="grid grid-cols-2 h-[500px]">
    <div class="flex flex-col items-center  justify-center">
      <img src="@/assets/croplink_logo.png" alt="CropLink Logo" class="rounded-full w-3/5">
    </div>
    <div class="flex flex-col gap-6 items-center justify-center relative">
      <div class="flex flex-col gap-2">
        <p class="text-6xl font-bold">CropLink</p>
        <p class="text-2xl pl-2 italic">Connect Farmers and Buyers now</p>
      </div>
      <div id="firebaseui-auth-container"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ui } from '../firebase/main';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { EmailAuthProvider } from 'firebase/auth';
import { useMainStore } from '@/stores/main';
import { useRouter } from 'vue-router';
const router = useRouter();
const isLoading = ref(true);
onMounted(() => {
  const uiConfig = 
  {
      signInOptions: [
          {
          provider: EmailAuthProvider.PROVIDER_ID,
          signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
          forceSameDevice: false,
        }
      ],
      signInSuccessUrl: '/',
      callBacks: {
        uiShown: (e) => {
          console.log(e)
        },
        signInSuccessWithAuthResult: (authResult:any) => {
          console.log(authResult)
          if(authResult.additionalUserInfo?.isNewUser) {
            console.log('signInSuccessWithAuthResult set new user')
            useMainStore().setNewUser(authResult.additionalUserInfo?.isNewUser);
            router.push({name:'profile-setup'});
          } else {
            router.push({name:'home'});
          }
          return false;
        },
      },
  };
  ui.start('#firebaseui-auth-container', uiConfig);
});

onBeforeUnmount(() => {
  ui.delete();
});
</script>
<style scoped>
body #firebaseui-auth-container {
  position: relative;
}
</style>