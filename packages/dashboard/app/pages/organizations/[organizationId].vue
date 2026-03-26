<template>
  <div class="flex h-full w-full">
    <span v-if="pending">loading organization ...</span>
    <NuxtPage v-else-if="organization" />
    <span v-else>Organization not found!</span>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const organizationId = computed(() => route.params.organizationId as string);

// Start the fetch and provide the reactive refs synchronously before any await,
// so Vue's provide/inject context is properly established for child pages during SSR.
const fetchResult = useFetch(() => `/api/organizations/${organizationId.value}`);
const { data: organization, refresh: refreshOrg, pending } = fetchResult;

typedProvide('org', computed(() => organization.value!));
typedProvide('refreshOrg', refreshOrg);

await fetchResult;
</script>
