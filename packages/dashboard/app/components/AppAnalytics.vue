<template>
  <div class="flex w-full justify-between gap-4">
    <div class="flex flex-col gap-2">
      <span class="text-neutral-500">Requests</span>
      <p>
        <span class="text-2xl font-bold">{{ formatNumber(requests) }}</span>
        <span class="text-neutral-500"> / {{ formatNumber(plan.freeRequests) }}</span>
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-neutral-500">Avg. CPU Time</span>
      <p>
        <span class="text-2xl font-bold">{{ formatSeconds(cpuTimeAvg) }}</span>
        <span class="text-neutral-500"> / {{ formatSeconds(plan.totalTimeout / 1000) }}</span>
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-neutral-500">Avg. IN bytes</span>
      <span class="text-2xl font-bold"
        >{{
          formatBytes(
            requests && requests > 0 && usage?.length
              ? usage.reduce((acc, { bytesIn }) => acc + bytesIn, 0) / requests
              : 0,
          )
        }}
      </span>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-neutral-500">Avg. OUT bytes</span>
      <span class="text-2xl font-bold"
        >{{
          formatBytes(
            requests && requests > 0 && usage?.length
              ? usage.reduce((acc, { bytesOut }) => acc + bytesOut, 0) / requests
              : 0,
          )
        }}
      </span>
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
