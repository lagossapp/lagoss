<template>
  <div class="flex min-h-screen w-full flex-col">
    <AppBar />
    <main class="flex w-full p-4 lg:p-6">
      <slot />
    </main>

    <UNotifications />
  </div>
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

html {
  scrollbar-gutter: stable;
}
</style>
