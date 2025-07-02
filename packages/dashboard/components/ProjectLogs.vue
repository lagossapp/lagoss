<template>
  <div class="flex min-h-0 flex-col overflow-y-auto p-2" ref="logsView">
    <UContainer
      v-if="logs?.length === 0"
      class="mt-4 w-full rounded border border-gray-200 py-16 text-center hover:shadow"
    >
      <p class="font-bold text-gray-500">No logs found for this project.</p>

      <p class="text-gray-500">
        You can use <span class="rounded-md bg-gray-200 px-1">console.log</span> in your code to log messages. Visit
        <a :href="getFullCurrentDomain({ name: project.name })" target="_blank" class="text-blue-500 hover:underline"
          >your project</a
        >
        to see the logs in action! 😉
      </p>
    </UContainer>
    <div v-for="log in logs" :key="log.timestamp" class="flex gap-2 rounded-sm px-1 text-sm hover:bg-gray-200">
      <span class="text-gray-500">{{ dayjs(log.timestamp).format('HH:mm:ss') }}</span>
      <span class="">{{ log.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~/lib/dayjs';

import type { Project } from '~/server/db/schema';

const props = defineProps<{
  project: Project;
}>();

// TODO: auto update logs
// TODO: auto scroll to bottom
const { data: logs, refresh: refreshLogs } = await useFetch(() => `/api/projects/${props.project.name}/logs`, {
  query: {
    level: 'all',
    timeframe: 'Last hour',
  },
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
