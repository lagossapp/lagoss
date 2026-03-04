<template>
  <div class="flex min-h-0 flex-col">
    <!-- Filters -->
    <div class="mb-4 flex items-center gap-2">
      <USelect v-model="level" :items="logLevels" class="w-36" />
      <USelect v-model="timeframe" :items="timeFrames" class="w-40 ml-auto" />
    </div>

    <Card class="flex flex-1 flex-col overflow-hidden p-0!">
      <!-- Loading -->
      <div v-if="!logs" class="flex h-32 items-center justify-center">
        <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-neutral-400" />
      </div>

      <!-- Empty state -->
      <div v-else-if="logs.length === 0" class="flex flex-col items-center justify-center gap-3 p-12 text-center">
        <UIcon name="i-heroicons-document-text" class="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
        <div>
          <p class="font-semibold text-neutral-600 dark:text-neutral-400">No logs found</p>
          <p class="mt-1 text-sm text-neutral-500">
            Use
            <code class="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800"
              >console.log('Hello!')</code
            >
            in your function to emit logs.
          </p>
          <p class="mt-1 text-sm text-neutral-500">
            Then visit
            <a :href="getFullCurrentDomain({ name: app.name })" target="_blank" class="text-teal-500 hover:underline"
              >your app</a
            >
            to generate some traffic.
          </p>
        </div>
      </div>

      <!-- Log entries -->
      <div v-else ref="logsContainer" class="flex flex-col overflow-y-auto">
        <!-- Summary bar -->
        <div
          class="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400"
        >
          <span class="font-mono">{{ logs.length }} {{ logs.length === 1 ? 'entry' : 'entries' }}</span>
          <div class="flex items-center gap-2">
            <span v-for="(count, lvl) in levelCounts" :key="lvl" class="flex items-center gap-1 font-mono">
              <span class="rounded px-1.5 py-0.5 text-xs font-bold uppercase" :class="getLogPillColor(lvl)">{{
                lvl
              }}</span>
              <span>{{ count }}</span>
            </span>
          </div>
        </div>

        <div
          v-for="(log, index) in logs"
          :key="index"
          class="flex items-start gap-3 px-4 py-1.5 font-mono text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
          :class="getLogRowBg(log.level)"
        >
          <span class="shrink-0 text-xs text-neutral-400 dark:text-neutral-500">
            {{ dayjs(log.timestamp).format('HH:mm:ss.SSS') }}
          </span>
          <span
            class="shrink-0 rounded px-1.5 py-0.5 text-xs font-bold uppercase leading-none"
            :class="getLogPillColor(log.level)"
          >
            {{ log.level }}
          </span>
          <span
            class="min-w-0 flex-1 whitespace-pre-wrap break-all leading-relaxed"
            :class="getLogTextColor(log.level)"
            >{{ log.message }}</span
          >
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~~/lib/dayjs';

import type { App } from '~/types';

const props = defineProps<{
  app: App;
}>();

const level = ref('all');
const timeframe = ref('Last hour');

const logLevels = [
  { label: 'All levels', value: 'all' },
  { label: 'Debug', value: 'debug' },
  { label: 'Info', value: 'info' },
  { label: 'Warn', value: 'warn' },
  { label: 'Error', value: 'error' },
];

const timeFrames = [
  { label: 'Last hour', value: 'Last hour' },
  { label: 'Last 24 hours', value: 'Last 24 hours' },
  { label: 'Last week', value: 'Last week' },
];

const { data: logs, refresh: refreshLogs } = await useFetch<{ level: string; message: string; timestamp: string }[]>(
  () => `/api/apps/${props.app.id}/logs`,
  {
    query: computed(() => ({
      level: level.value,
      timeframe: timeframe.value,
    })),
  },
);

const levelCounts = computed(() => {
  const counts: Record<string, number> = {};
  for (const log of logs.value ?? []) {
    counts[log.level] = (counts[log.level] ?? 0) + 1;
  }
  return counts;
});

// Styling helpers
function getLogRowBg(level: string): string {
  const map: Record<string, string> = {
    error: 'bg-red-50/60 dark:bg-red-950/10',
    warn: 'bg-yellow-50/60 dark:bg-yellow-950/10',
    warning: 'bg-yellow-50/60 dark:bg-yellow-950/10',
  };
  return map[level] ?? '';
}

function getLogPillColor(level: string): string {
  const map: Record<string, string> = {
    error: 'bg-red-500 text-white dark:bg-red-600',
    warn: 'bg-yellow-500 text-white dark:bg-yellow-600',
    warning: 'bg-yellow-500 text-white dark:bg-yellow-600',
    info: 'bg-teal-500 text-white dark:bg-teal-600',
    debug: 'bg-neutral-400 text-white dark:bg-neutral-600',
  };
  return map[level] ?? 'bg-neutral-500 text-white';
}

function getLogTextColor(level: string): string {
  const map: Record<string, string> = {
    error: 'text-red-900 dark:text-red-200',
    warn: 'text-yellow-900 dark:text-yellow-200',
    warning: 'text-yellow-900 dark:text-yellow-200',
    info: 'text-neutral-900 dark:text-neutral-100',
    debug: 'text-neutral-600 dark:text-neutral-400',
  };
  return map[level] ?? 'text-neutral-900 dark:text-neutral-100';
}

// Auto-scroll to bottom on new logs
const logsContainer = ref<HTMLDivElement>();
watch(logs, () => {
  nextTick(() => {
    if (logsContainer.value) {
      logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
    }
  });
});

// Auto-refresh
let logInterval: ReturnType<typeof window.setInterval> | null = null;
onMounted(() => {
  logInterval = setInterval(() => refreshLogs(), 1000 * 5);
});
onBeforeUnmount(() => {
  if (logInterval) {
    clearInterval(logInterval);
    logInterval = null;
  }
});
</script>
