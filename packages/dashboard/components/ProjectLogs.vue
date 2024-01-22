<template>
  <div class="flex min-h-0 flex-col overflow-y-auto p-2" ref="logsView">
    <UContainer v-if="logs?.length === 0" class="w-full mt-4 py-16 border border-gray-200 text-center rounded hover:shadow">
        <p class="text-gray-600">No logs yet! Please wait patiently!</p>
      </UContainer>
    <div v-for="log in logs" :key="log.timestamp" class="flex gap-2 rounded-sm px-1 text-sm hover:bg-gray-200">
      <span class="text-gray-500">{{ dayjs(log.timestamp).format('HH:mm:ss') }}</span>
      <span class="">{{ log.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~/lib/dayjs';

import type { Function } from '~/server/db/schema';

const props = defineProps<{
  project: Function;
}>();

// TODO: auto update logs
// TODO: auto scroll to bottom
const { data: logs, refresh: refreshLogs } = useFetch(`/api/projects/${props.project.name}/logs`, {
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
