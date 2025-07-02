<template>
  <header class="mx-auto flex w-full max-w-4xl flex-col">
    <div class="flex w-full items-center justify-between">
      <h1 class="text-3xl font-bold">{{ project.name }}</h1>

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
          :to="`/organizations/${project.organizationId}/projects/${project.name}/playground`"
        />
      </div>
    </div>

    <div class="my-4 flex gap-4">
      <TabButton v-for="tab in tabs" :key="tab.label" :to="tab.to" :label="tab.label" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Project } from '~~/server/db/schema';

const props = defineProps<{
  project: Project;
}>();

const tabs = computed(() => [
  {
    to: `/organizations/${props.project.organizationId}/projects/${props.project.name}`,
    label: 'Overview',
  },
  {
    to: `/organizations/${props.project.organizationId}/projects/${props.project.name}/deployments`,
    label: 'Deployments',
  },
  {
    to: `/organizations/${props.project.organizationId}/projects/${props.project.name}/analytics`,
    label: 'Analytics',
  },
  {
    to: `/organizations/${props.project.organizationId}/projects/${props.project.name}/logs`,
    label: 'Logs',
  },
  {
    to: `/organizations/${props.project.organizationId}/projects/${props.project.name}/settings`,
    label: 'Settings',
  },
]);
</script>
