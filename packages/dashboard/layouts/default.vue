<template>
  <div
    class="flex min-h-screen w-screen flex-col bg-gradient-to-tl from-stone-200 to-stone-100 dark:from-neutral-950 dark:to-neutral-900 lg:flex-row"
  >
    <Menu />

    <main
      class="m-2 flex rounded-xl bg-white p-4 shadow dark:m-0 dark:rounded-none dark:bg-neutral-950 dark:shadow-none lg:ml-72 lg:w-full lg:p-6 dark:lg:ml-72"
    >
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
