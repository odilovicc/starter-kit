<template>
  <AppNavbar></AppNavbar>
  <slot />
</template>
<!-- <script setup lang="ts">
import useFirebaseClient from "~/composable/firebase";
import { RouterPaths } from "~/types/router";

onMounted(() => {
  if (!useFirebaseClient().auth.currentUser) {
    navigateTo({ name: RouterPaths.LOGIN });
  } else {
    navigateTo({ name: RouterPaths.DASHBOARD });
  }

});
</script> -->
