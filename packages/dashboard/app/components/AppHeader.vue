<template>
  <header class="mx-auto flex w-full max-w-4xl flex-col">
    <div class="flex w-full items-center gap-4">
      <AppFavicon :app="app" />
      <h1 class="text-3xl font-bold">{{ app.name }}</h1>

      <div class="ml-auto flex gap-4">
        <a :href="getFullCurrentDomain({ name: app.name })" rel="noopener noreferrer" target="_blank">
          <UButton label="Visit" size="md" icon="i-ion-ios-globe" />
        </a>
        <!-- <UButton
          v-if="app.playground"
          label="Playground"
          size="md"
          color="primary"
          icon="i-ion-edit"
          :to="`/organizations/${app.organizationId}/apps/${app.name}/playground`"
        /> -->
      </div>
    </div>

    <div class="my-4 flex gap-4">
      <TabButton v-for="tab in tabs" :key="tab.label" :to="tab.to" :label="tab.label" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { App } from '~/types';

const props = defineProps<{
  app: App;
}>();

const tabs = computed(() => [
  {
    to: `/organizations/${props.app.organizationId}/apps/${props.app.name}`,
    label: 'Overview',
  },
  {
    to: `/organizations/${props.app.organizationId}/apps/${props.app.name}/deployments`,
    label: 'Deployments',
  },
  {
    to: `/organizations/${props.app.organizationId}/apps/${props.app.name}/logs`,
    label: 'Logs',
  },
  {
    to: `/organizations/${props.app.organizationId}/apps/${props.app.name}/settings`,
    label: 'Settings',
  },
]);
</script>
