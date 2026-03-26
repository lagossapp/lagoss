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

// Start the fetch and provide the reactive refs synchronously before any await,
// so Vue's provide/inject context is properly established for child pages during SSR.
const fetchResult = useFetch(() => `/api/apps/by-name/${appName.value}`);
const { data: app, pending, refresh: refreshApp } = fetchResult;

typedProvide('app', computed(() => app.value!));
typedProvide('refreshApp', refreshApp);

await fetchResult;
</script>
