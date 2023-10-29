<template>
  <div>
      <h1>This is a signup page</h1>
      <div id="firebaseui-auth-container"></div>
      <div id="loader"></div>
  </div>
</template>
<script setup lang="ts">
import { ui } from '../firebase/main';
import { onMounted, onBeforeUnmount } from 'vue';
import { EmailAuthProvider } from 'firebase/auth';

onMounted(() => {
  ui.start('#firebaseui-auth-container', {
      signInOptions: [
          {
          provider: EmailAuthProvider.PROVIDER_ID,
          signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
        }
      ],
      signInSuccessUrl: '/',
      callBacks: {
        uiShown: () => {
          document.getElementById('loader')!.style.display = 'none';
        },
      },
    });
});

onBeforeUnmount(() => {
  ui.delete();
});

</script>