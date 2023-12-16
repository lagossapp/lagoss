<template>
  <div v-if="project" class="w-full">
    <header class="mx-auto flex w-full max-w-4xl flex-col">
      <div class="flex w-full items-center justify-between">
        <h1 class="text-3xl font-bold">Project {{ project?.name }}</h1>

        <div class="flex gap-4">
          <UButton label="View" size="lg" />
          <UButton label="Playground" size="lg" color="blue" :to="`/projects/${projectName}/playground`" />
        </div>
      </div>

      <UTabs :model-value="tab" @update:model-value="changeTab" :items="items" class="mt-4" />
    </header>

    <div v-if="tab === 0" class="mx-auto flex max-w-4xl flex-col gap-4">
      <pre>{{ project }}</pre>
    </div>

    <div v-if="tab === 1" class="mx-auto flex max-w-4xl flex-col gap-4">
      <div
        v-for="deployment in deployments"
        :id="deployment.id"
        class="flex w-full items-center justify-between rounded-md border border-gray-300 p-4"
      >
        <div class="flex flex-col">
          <div>
            <span>{{ deployment.functionId }}</span>
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

    <div v-if="tab === 2" class="flex flex-col gap-4">
      <pre>{{ project }}</pre>
    </div>

    <div v-if="tab === 3" class="flex flex-col gap-4">
      <pre>{{ project }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~/lib/dayjs';

const route = useRoute();
const { projectName } = route.params;

const { data: project } = useFetch(`/api/projects/${projectName}`);

const items = [
  {
    key: 'overview',
    label: 'Overview',
    to: `/projects/${projectName}`,
  },
  {
    key: 'deployments',
    label: 'Deployments',
    to: `/projects/${projectName}/deployments`,
  },
  {
    key: 'logs',
    label: 'Logs',
    to: `/projects/${projectName}/logs`,
  },
  {
    key: 'settings',
    label: 'Settings',
    to: `/projects/${projectName}/deployments`,
  },
];

const { data: deployments } = useFetch(`/api/projects/${projectName}/deployments`);

const tab = ref(0);

const router = useRouter();
async function changeTab(id: number) {
  await router.push(items[id].to);
}
</script>
