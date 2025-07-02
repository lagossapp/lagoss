<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const toast = useToast();
// eslint-disable-next-line promise/prefer-await-to-callbacks
onErrorCaptured(err => {
  // eslint-disable-next-line no-console
  console.error('error captured', err);
  toast.add({
    title: 'Error',
    description: err.message,
    icon: 'i-ion-alert-circle-outline',
    color: 'error',
  });
});
</script>

<style>
@import 'tailwindcss';
@import '@nuxt/ui';

html {
  scrollbar-gutter: stable;
}
</style>
