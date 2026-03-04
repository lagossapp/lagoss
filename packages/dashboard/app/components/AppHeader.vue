<template>
  <header class="mx-auto flex w-full max-w-4xl flex-col gap-5 mb-4">
    <div class="flex w-full items-center gap-3">
      <AppFavicon :app="app" />
      <div>
        <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{{ app.name }}</h1>
        <p class="text-xs text-gray-400 dark:text-gray-500">{{ getFullCurrentDomain({ name: app.name }) }}</p>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <a
          :href="getFullCurrentDomain({ name: app.name })"
          rel="noopener noreferrer"
          target="_blank"
          class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20 dark:hover:bg-white/8"
        >
          <svg
            class="h-3.5 w-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.75"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
          Visit
        </a>
      </div>
    </div>

    <div class="flex items-center gap-4 border-b border-gray-200/70 dark:border-white/8">
      <TabButton v-for="tab in tabs" :key="tab.label" :to="tab.to" :label="tab.label" :exact="tab.exact" />
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
    exact: true,
  },
  {
    to: `/organizations/${props.app.organizationId}/apps/${props.app.name}/deployments`,
    label: 'Deployments',
    exact: false,
  },
  {
    to: `/organizations/${props.app.organizationId}/apps/${props.app.name}/requests`,
    label: 'Requests',
  },
  {
    to: `/organizations/${props.app.organizationId}/apps/${props.app.name}/logs`,
    label: 'Logs',
    exact: false,
  },
  {
    to: `/organizations/${props.app.organizationId}/apps/${props.app.name}/settings`,
    label: 'Settings',
    exact: false,
  },
]);
</script>
