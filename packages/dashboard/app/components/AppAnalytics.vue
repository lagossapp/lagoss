<template>
  <!-- Stats card -->
  <div class="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Usage row -->
    <div class="flex items-center gap-2 border-b border-neutral-200 px-4 py-2.5 dark:border-neutral-800">
      <UIcon name="i-heroicons-chart-bar" class="h-4 w-4 text-neutral-400" />
      <span class="text-xs font-semibold uppercase tracking-wider text-neutral-400">Usage</span>
    </div>
    <div class="grid grid-cols-4 divide-x divide-neutral-200 dark:divide-neutral-800">
      <div class="flex flex-col gap-1 px-5 py-4">
        <span class="text-xs text-neutral-500 dark:text-neutral-400">Requests</span>
        <span class="text-2xl font-bold tabular-nums">{{ formatNumber(requests) }}</span>
        <span class="text-xs text-neutral-400">/ {{ formatNumber(plan.freeRequests) }} free</span>
      </div>

      <div class="flex flex-col gap-1 px-5 py-4">
        <span class="text-xs text-neutral-500 dark:text-neutral-400">Avg. CPU Time</span>
        <span class="text-2xl font-bold tabular-nums">{{ formatSeconds(cpuTimeAvg) }}</span>
        <span class="text-xs text-neutral-400">/ {{ formatSeconds(plan.totalTimeout / 1000) }} limit</span>
      </div>

      <div class="flex flex-col gap-1 px-5 py-4">
        <span class="text-xs text-neutral-500 dark:text-neutral-400">Avg. IN</span>
        <span class="text-2xl font-bold tabular-nums">
          {{
            formatBytes(
              requests && requests > 0 && usage?.length
                ? usage.reduce((acc, { bytesIn }) => acc + bytesIn, 0) / requests
                : 0,
            )
          }}
        </span>
        <span class="text-xs text-neutral-400">per request</span>
      </div>

      <div class="flex flex-col gap-1 px-5 py-4">
        <span class="text-xs text-neutral-500 dark:text-neutral-400">Avg. OUT</span>
        <span class="text-2xl font-bold tabular-nums">
          {{
            formatBytes(
              requests && requests > 0 && usage?.length
                ? usage.reduce((acc, { bytesOut }) => acc + bytesOut, 0) / requests
                : 0,
            )
          }}
        </span>
        <span class="text-xs text-neutral-400">per request</span>
      </div>
    </div>

    <!-- Performance row -->
    <div
      class="grid grid-cols-4 divide-x divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800"
    >
      <div class="flex flex-col gap-1 px-5 py-4">
        <span class="text-xs text-neutral-500 dark:text-neutral-400">Error Rate</span>
        <span class="text-2xl font-bold tabular-nums" :class="errorRateColor">
          {{ metrics ? `${metrics.error_rate.toFixed(1)}%` : '—' }}
        </span>
      </div>

      <div class="flex flex-col gap-1 px-5 py-4">
        <span class="text-xs text-neutral-500 dark:text-neutral-400">p50 Latency</span>
        <span class="text-2xl font-bold tabular-nums">
          {{ metrics?.p50 != null ? formatSeconds(metrics.p50 / 1_000_000) : '—' }}
        </span>
      </div>

      <div class="flex flex-col gap-1 px-5 py-4">
        <span class="text-xs text-neutral-500 dark:text-neutral-400">p95 Latency</span>
        <span class="text-2xl font-bold tabular-nums">
          {{ metrics?.p95 != null ? formatSeconds(metrics.p95 / 1_000_000) : '—' }}
        </span>
      </div>

      <div class="flex flex-col gap-1 px-5 py-4">
        <span class="text-xs text-neutral-500 dark:text-neutral-400">p99 Latency</span>
        <span class="text-2xl font-bold tabular-nums">
          {{ metrics?.p99 != null ? formatSeconds(metrics.p99 / 1_000_000) : '—' }}
        </span>
      </div>
    </div>
  </div>

  <template v-if="showGraphs">
    <div>
      <h2>Requests</h2>
      <Chart
        v-if="result && chartLabels"
        :labels="chartLabels"
        :datasets="[
          {
            label: 'Requests',
            color: '#3B82F6',
            data: result.map(({ requests }) => requests),
            transform: formatNumber,
          },
        ]"
        class="h-72"
      />
    </div>

    <div>
      <h2>CPU Time</h2>
      <Chart
        v-if="result && chartLabels"
        :labels="chartLabels"
        :datasets="[
          {
            label: 'CPU Time',
            color: '#F59E0B',
            data: result.map(({ cpuTime }) => cpuTime / 1_000_000),
            transform: formatSeconds,
          },
        ]"
        :axisTransform="(self, ticks) => ticks.map(formatSeconds)"
        class="h-72"
      />
    </div>

    <div>
      <h2 class="text-xl">Network</h2>
      <Chart
        v-if="result && chartLabels"
        :labels="chartLabels"
        :datasets="[
          {
            label: 'IN bytes',
            color: '#10B981',
            data: result.map(({ bytesIn }) => bytesIn),
            transform: formatBytes,
          },
          {
            label: 'OUT bytes',
            color: '#3B82F6',
            data: result.map(({ bytesOut }) => bytesOut),
            transform: formatBytes,
          },
        ]"
        :axisTransform="(self, ticks) => ticks.map(formatBytes)"
        class="h-72"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import type { App, Organization } from '~/types';
import { getPlanOfOrganization } from '~~/server/lib/plans';
import type { AnalyticsTimeframe } from '~~/server/lib/types';

const props = defineProps<{
  app: App;
  org: Organization;
  showGraphs?: boolean;
}>();
const app = toRef(props, 'app');

const plan = computed(() => getPlanOfOrganization(props.org));

function formatBytes(bytes = 0) {
  if (bytes === 0) return '0 bytes';

  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${sizes[i]}`;
}

function formatSeconds(seconds = 0) {
  if (seconds === 0) return '0s';

  if (seconds < 0.001) {
    return `${(seconds * 1000000).toFixed(0)}μs`;
  }

  if (seconds < 1) {
    return `${(seconds * 1000).toFixed(0)}ms`;
  }

  return `${seconds.toFixed(0)}s`;
}

function formatNumber(number = 0) {
  return number.toLocaleString();
}

// TODO: allow to select timeframe
const timeframe = ref<AnalyticsTimeframe>('Last 24 hours');

// TODO: refresh data every 10 seconds
const { data: usage } = await useFetch(() => `/api/apps/${app.value.id}/usage`, {
  query: computed(() => ({ timeframe: timeframe.value })),
});

// TODO: refresh data every 10 seconds
const { data: metrics } = await useFetch(() => `/api/apps/${app.value.id}/metrics`, {
  query: computed(() => ({ timeframe: timeframe.value })),
});

const errorRateColor = computed(() => {
  const rate = metrics.value?.error_rate ?? 0;
  if (rate >= 5) return 'text-red-500 dark:text-red-400';
  if (rate >= 1) return 'text-yellow-500 dark:text-yellow-400';
  return 'text-emerald-500 dark:text-emerald-400';
});

const requests = computed(() => usage.value?.reduce((acc, { requests }) => acc + requests, 0));

const cpuTimeAvg = computed(() => {
  if (!usage.value) return undefined;

  let points = 0;

  const total = usage.value.reduce((acc, { cpuTime }) => {
    points++;
    return acc + cpuTime;
  }, 0);

  // CPU time is in microseconds
  return points > 0 ? total / points / 1_000_000 : points;
});

const result = computed(() => {
  if (!usage.value) return undefined;

  const timeframes: Record<AnalyticsTimeframe, number> = {
    'Last 24 hours': 24,
    'Last 30 days': 30,
    'Last 7 days': 7,
  };

  const values = [];

  for (let i = 0; i < timeframes[timeframe.value]; i++) {
    const now = new Date();
    now.setMinutes(0);

    if (timeframe.value === 'Last 24 hours') {
      now.setHours(now.getHours() - i);
    } else {
      now.setDate(now.getDate() - i);
    }

    const value = usage.value.find(({ time: resultTime }) => {
      if (timeframe.value === 'Last 24 hours') {
        const resultTimeTZ = new Date(resultTime);
        resultTimeTZ.setTime(resultTimeTZ.getTime() - now.getTimezoneOffset() * 60 * 1000);

        return resultTimeTZ.getHours() === now.getHours();
      } else {
        return new Date(resultTime).getDate() === now.getDate();
      }
    });

    const time = now.getTime();

    values.push(value ? { ...value, time } : { time, requests: 0, cpuTime: 0, bytesIn: 0, bytesOut: 0 });
  }

  return values.sort((a, b) => a.time - b.time);
});

const chartLabels = computed(() => result.value?.map(({ time }) => new Date(time).getTime() / 1000));
</script>
