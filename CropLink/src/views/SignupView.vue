<template>
  <div>
      <h1>This is a signup page</h1>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
  </div>
</template>
<script setup lang="ts">
import { auth, ui } from '../firebase/main';
import { onMounted, onBeforeUnmount } from 'vue';
import { EmailAuthProvider } from 'firebase/auth';
import { useMainStore } from '@/stores/main';
import { useRouter } from 'vue-router';
const router = useRouter();
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
      signInSuccessUrl: '/feed',
      callBacks: {
        uiShown: () => {
          console.log("uiShown")
          document.getElementById('loader')!.style.display = 'none';
        },
        signInSuccessWithAuthResult: (authResult:any) => {
          console.log(authResult)
          if(authResult.additionalUserInfo?.isNewUser) {
            console.log('signInSuccessWithAuthResult set new user')
            useMainStore().setNewUser(authResult.additionalUserInfo?.isNewUser);
            router.push({name:'profile-setup'});
          } else {
            router.push({name:'/feed'});
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