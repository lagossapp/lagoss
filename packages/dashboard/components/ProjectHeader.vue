<template>
  <header class="mx-auto flex w-full max-w-4xl flex-col">
    <div class="flex w-full items-center justify-between">
      <h1 class="text-3xl font-bold">Project {{ project?.name }}</h1>

      <div class="flex gap-4">
        <a :href="getFullCurrentDomain({ name: project.name })" rel="noopener noreferrer" target="_blank">
          <UButton label="Visit" size="md" icon="i-ion-ios-globe" />
        </a>
        <UButton
          v-if="project.playground"
          label="Playground"
          size="md"
          color="blue"
          icon="i-ion-edit"
          :to="`/projects/${project.name}/playground`"
        />
      </div>
    </div>

    <div class="my-4 flex gap-4">
      <router-link
        v-for="tab in tabs"
        :key="tab.label"
        :to="tab.to"
        class="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-zinc-700 hover:dark:text-gray-100"
      >
        <span
          class="pb-1"
          :class="{
            'text-gray-500 dark:text-gray-300': $route.path !== tab.to,
            'border-b-2 border-gray-900 text-gray-900 hover:rounded-b-none dark:border-gray-200 dark:text-gray-100':
              $route.path === tab.to,
          }"
          >{{ tab.label }}</span
        >
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Project } from '~/server/db/schema';

const props = defineProps<{
  project: Project;
}>();

const tabs = computed(() => [
  {
    to: `/projects/${props.project.name}`,
    label: 'Overview',
  },
  {
    to: `/projects/${props.project.name}/deployments`,
    label: 'Deployments',
  },
  {
    to: `/projects/${props.project.name}/analytics`,
    label: 'Analytics',
  },
  {
    to: `/projects/${props.project.name}/logs`,
    label: 'Logs',
  },
  {
    to: `/projects/${props.project.name}/settings`,
    label: 'Settings',
  },
]);
</script>
