<template>
  <div v-if="project" class="w-full">
    <ProjectHeader :project="project" />

    <div class="mx-auto flex max-w-4xl flex-col gap-4">
      <div
        v-for="deployment in deployments"
        :id="deployment.id"
        class="flex w-full items-center justify-between rounded-md border border-gray-300 p-4"
      >
        <div class="flex flex-col">
          <div>
            <a
              :href="getFullCurrentDomain({ name: deployment.id })"
              rel="noopener noreferrer"
              target="_blank"
              class="text-blue-500"
            >
              {{ getFullCurrentDomain({ name: deployment.id }) }}
            </a>
            <span v-if="deployment.isProduction" class="ml-2">(Production)</span>
          </div>
          <span class="text-gray-500">{{ dayjs().to(deployment.createdAt) }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-gray-500">{{ deployment.commit ?? 'No commit linked' }}</span>
          <span class="text-gray-500">By {{ deployment.triggerer }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~/lib/dayjs';

const route = useRoute();
const { projectName } = route.params;

const { data: project } = useFetch(`/api/projects/${projectName}`);

const { data: deployments } = useFetch(`/api/projects/${projectName}/deployments`);
</script>
