<template>
  <slot />
  <UNotifications />
</template>

<script setup lang="ts">
const toast = useToast();
// eslint-disable-next-line promise/prefer-await-to-callbacks
onErrorCaptured(err => {
  // eslint-disable-next-line no-console
  console.log('error captured');
  console.error(err);
  toast.add({
    title: 'Error',
    description: err.message,
    icon: 'i-ion-alert-circle-outline',
    color: 'red',
  });
});
</script>

<style>
* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
