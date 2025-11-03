<template>
  <div class="flex h-full w-full">
    <span v-if="pending">loading organization ...</span>
    <NuxtPage v-else-if="organization" />
    <span v-else>Organization not found!</span>
  </div>
</template>

<script setup lang="ts">
import { provide } from '~/composables/useInjectProvide';

const route = useRoute();
const organizationId = computed(() => route.params.organizationId as string);

const {
  data: organization,
  refresh: refreshOrg,
  pending,
} = await useFetch(() => `/api/organizations/${organizationId.value}`);

provide('org', organization);
provide('refreshOrg', refreshOrg);
</script>
