<template>
  <div class="flex h-full w-full">
    <span v-if="pending">loading ...</span>
    <NuxtPage v-else-if="app" />
    <span v-else>App not found!</span>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const appName = computed(() => route.params.appName as string);
const { data: app, pending, refresh: refreshApp } = await useFetch(() => `/api/apps/by-name/${appName.value}`);

typedProvide(
  'app',
  computed(() => app.value!),
);
typedProvide('refreshApp', refreshApp);
</script>
