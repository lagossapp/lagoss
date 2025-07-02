<template>
  <div class="flex min-h-0 flex-col overflow-y-auto p-2" ref="logsView">
    <div class="mb-4 flex justify-end gap-2">
      <USelect v-model="level" :options="logLevels" class="w-48">
        <!-- <template #leading>
          <span>Level:</span>
        </template> -->
      </USelect>
      <USelect v-model="timeframe" :options="timeFrames" class="w-48" />
    </div>

    <Card>
      <div v-if="logs?.length === 0">
        <p class="font-bold text-gray-500">No logs found for this project.</p>

        <p class="text-gray-500">
          You can use <span class="rounded-md bg-gray-200 px-1">console.log('Hello world!')</span> in your code to log
          messages.
        </p>
        <p class="text-gray-500">
          Visit
          <a :href="getFullCurrentDomain({ name: project.name })" target="_blank" class="text-blue-500 hover:underline"
            >your project</a
          >
          to see the logs in action! 😉
        </p>
      </div>

      <div class="flex flex-col gap-1">
        <div
          v-for="log in logs"
          :key="log.timestamp"
          class="flex items-center gap-2 rounded-md p-1 text-white"
          :class="{
            'bg-yellow-400': log.level === 'warn',
            'bg-red-400': log.level === 'error',
            'bg-blue-400': log.level === 'debug',
          }"
        >
          <span class="text-xs">{{ dayjs(log.timestamp).format('DD.MM.YYYY HH:mm:ss') }}</span>
          <span class="flex-1 text-sm">{{ log.message }}</span>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~~/lib/dayjs';

import type { Project } from '~~/server/db/schema';

const props = defineProps<{
  project: Project;
}>();

const level = ref('all');
const timeframe = ref('Last hour');

const logLevels = [
  {
    label: 'all',
    value: 'all',
  },
  {
    label: 'debug',
    value: 'debug',
  },
  {
    label: 'info',
    value: 'info',
  },
  {
    label: 'warn',
    value: 'warn',
  },
  {
    label: 'error',
    value: 'error',
  },
];

const timeFrames = [
  {
    label: 'Last hour',
    value: 'Last hour',
  },
  {
    label: 'Last 24 hours',
    value: 'Last 24 hours',
  },
  {
    label: 'Last week',
    value: 'Last week',
  },
];

// TODO: auto update logs
// TODO: auto scroll to bottom
const { data: logs, refresh: refreshLogs } = await useFetch(() => `/api/projects/${props.project.name}/logs`, {
  query: computed(() => ({
    level: level.value,
    timeframe: timeframe.value,
  })),
});

onMounted(() => {
  setInterval(() => {
    refreshLogs();
  }, 1000 * 15);
});

const logsView = ref<HTMLDivElement>();
watch(logs, () => {
  nextTick(() => {
    logsView.value?.scrollTo(0, logsView.value.scrollHeight);
  });
});
</script>
