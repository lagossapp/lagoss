<template>
  <div class="flex min-h-0 flex-col p-2">
    <!-- Filters -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <USelect v-model="statusFilter" :items="statusFilters" class="w-32" />
      <USelect v-model="methodFilter" :items="methodFilters" class="w-28" />
      <USelect v-model="timeframe" :items="timeframes" class="w-40 ml-auto" />
    </div>

    <div class="flex flex-1 gap-4 overflow-hidden">
      <!-- Requests List -->
      <div class="flex min-w-0 flex-1 flex-col">
        <Card class="flex flex-1 flex-col overflow-hidden p-0!">
          <div v-if="pending" class="flex h-32 items-center justify-center">
            <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-neutral-400" />
          </div>

          <div v-else-if="!requests?.length" class="p-4">
            <p class="font-medium text-neutral-500">No requests found.</p>
            <p class="text-sm text-neutral-400">
              Try adjusting your filters or visit
              <a :href="getFullCurrentDomain({ name: app.name })" target="_blank" class="text-blue-500 hover:underline">
                your app
              </a>
              to generate some traffic.
            </p>
          </div>

          <div v-else class="flex flex-col divide-y divide-neutral-200 overflow-y-auto dark:divide-neutral-700">
            <button
              v-for="request in requests"
              :key="request.id"
              class="group flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
              :class="{
                'bg-blue-50 dark:bg-blue-900/20': selectedRequest?.id === request.id,
              }"
              @click="selectRequest(request)"
            >
              <!-- Status Badge -->
              <span
                class="flex h-6 w-12 items-center justify-center rounded text-xs font-semibold"
                :class="getStatusColor(request.response_status_code)"
              >
                {{ request.response_status_code }}
              </span>

              <!-- Method Badge -->
              <span
                class="flex h-6 w-16 items-center justify-center rounded text-xs font-medium"
                :class="getMethodColor(request.http_method)"
              >
                {{ request.http_method }}
              </span>

              <!-- URL -->
              <span class="min-w-0 flex-1 truncate font-mono text-sm">
                {{ request.url }}
              </span>

              <!-- Metadata -->
              <div class="flex shrink-0 items-center gap-3 text-xs text-neutral-500">
                <span v-if="request.cpu_time_micros" class="flex items-center gap-1">
                  <UIcon name="i-heroicons-cpu-chip" class="h-3.5 w-3.5" />
                  {{ formatCpuTime(request.cpu_time_micros) }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-arrow-down-tray" class="h-3.5 w-3.5" />
                  {{ formatBytes(request.bytes_in) }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-arrow-up-tray" class="h-3.5 w-3.5" />
                  {{ formatBytes(request.bytes_out) }}
                </span>
                <span class="w-20 text-right">
                  {{ formatTimestamp(request.timestamp) }}
                </span>
              </div>

              <!-- Expand indicator -->
              <UIcon
                name="i-heroicons-chevron-right"
                class="h-4 w-4 shrink-0 text-neutral-400 transition-transform"
                :class="{ 'rotate-90': selectedRequest?.id === request.id }"
              />
            </button>
          </div>
        </Card>
      </div>

      <!-- Request Detail Panel -->
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div v-if="selectedRequest" class="flex w-96 shrink-0 flex-col">
          <Card class="flex flex-1 flex-col overflow-hidden p-0!">
            <!-- Request Header -->
            <div class="border-b border-neutral-200 p-4 dark:border-neutral-700">
              <div class="mb-2 flex items-center gap-2">
                <span
                  class="flex h-6 w-12 items-center justify-center rounded text-xs font-semibold"
                  :class="getStatusColor(selectedRequest.response_status_code)"
                >
                  {{ selectedRequest.response_status_code }}
                </span>
                <span
                  class="flex h-6 w-16 items-center justify-center rounded text-xs font-medium"
                  :class="getMethodColor(selectedRequest.http_method)"
                >
                  {{ selectedRequest.http_method }}
                </span>

                <UButton
                  variant="ghost"
                  color="neutral"
                  icon="i-heroicons-x-mark"
                  class="ml-auto"
                  @click="selectedRequest = null"
                />
              </div>
              <p class="mb-3 break-all font-mono text-sm">{{ selectedRequest.url }}</p>

              <!-- Request metadata grid -->
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="text-neutral-500">Region</span>
                  <p class="font-medium">{{ selectedRequest.region }}</p>
                </div>
                <div>
                  <span class="text-neutral-500">CPU Time</span>
                  <p class="font-medium">
                    {{ selectedRequest.cpu_time_micros ? formatCpuTime(selectedRequest.cpu_time_micros) : '-' }}
                  </p>
                </div>
                <div>
                  <span class="text-neutral-500">Bytes In</span>
                  <p class="font-medium">{{ formatBytes(selectedRequest.bytes_in) }}</p>
                </div>
                <div>
                  <span class="text-neutral-500">Bytes Out</span>
                  <p class="font-medium">{{ formatBytes(selectedRequest.bytes_out) }}</p>
                </div>
                <div class="col-span-2">
                  <span class="text-neutral-500">Time</span>
                  <p class="font-medium">{{ dayjs(selectedRequest.timestamp).format('DD MMM YYYY, HH:mm:ss') }}</p>
                </div>
                <div class="col-span-2">
                  <span class="text-neutral-500">Request ID</span>
                  <p class="break-all font-mono text-xs">{{ selectedRequest.id }}</p>
                </div>
              </div>
            </div>

            <!-- Logs Section -->
            <div class="flex flex-1 flex-col overflow-hidden">
              <div
                class="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-700"
              >
                <h3 class="font-semibold">Logs</h3>
                <span v-if="requestLogs?.length" class="text-xs text-neutral-500">
                  {{ requestLogs.length }} {{ requestLogs.length === 1 ? 'entry' : 'entries' }}
                </span>
              </div>

              <div v-if="logsPending" class="flex h-32 items-center justify-center">
                <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 animate-spin text-neutral-400" />
              </div>

              <div v-else-if="!requestLogs?.length" class="p-4 text-center text-sm text-neutral-500">
                No logs for this request.
              </div>

              <div v-else class="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
                <div
                  v-for="(log, index) in requestLogs"
                  :key="index"
                  class="flex gap-2 rounded px-2 py-1.5 text-sm"
                  :class="getLogBgColor(log.level)"
                >
                  <span class="shrink-0 text-xs text-neutral-500">
                    {{ dayjs(log.timestamp).format('HH:mm:ss.SSS') }}
                  </span>
                  <span
                    class="w-12 shrink-0 text-center text-xs font-medium uppercase"
                    :class="getLogLevelColor(log.level)"
                  >
                    {{ log.level }}
                  </span>
                  <span class="min-w-0 flex-1 break-all font-mono text-xs">{{ log.message }}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~~/lib/dayjs';
import type { App } from '~/types';

interface RequestData {
  id: string;
  deployment_id: string;
  region: string;
  bytes_in: number;
  bytes_out: number;
  cpu_time_micros: number | null;
  timestamp: string;
  response_status_code: number;
  url: string;
  http_method: string;
}

interface LogData {
  request_id: string;
  deployment_id: string;
  level: string;
  region: string;
  message: string;
  timestamp: string;
}

const props = defineProps<{
  app: App;
}>();

// Filters
const timeframe = ref('Last hour');
const statusFilter = ref('all');
const methodFilter = ref('all');

const timeframes = [
  { label: 'Last hour', value: 'Last hour' },
  { label: 'Last 24 hours', value: 'Last 24 hours' },
  { label: 'Last week', value: 'Last week' },
];

const statusFilters = [
  { label: 'All status', value: 'all' },
  { label: '2xx', value: '2xx' },
  { label: '3xx', value: '3xx' },
  { label: '4xx', value: '4xx' },
  { label: '5xx', value: '5xx' },
];

const methodFilters = [
  { label: 'All methods', value: 'all' },
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' },
];

// Fetch requests
const { data: requests, pending } = await useFetch<RequestData[]>(() => `/api/apps/${props.app.id}/requests`, {
  query: computed(() => ({
    timeframe: timeframe.value,
    status: statusFilter.value,
    method: methodFilter.value,
  })),
});

// Selected request and its logs
const selectedRequest = ref<RequestData | null>(null);

const { data: requestLogs, pending: logsPending } = await useFetch<LogData[]>(
  () => `/api/apps/${props.app.id}/requests/${selectedRequest.value?.id}/logs`,
  {
    immediate: false,
    watch: [selectedRequest],
  },
);

function selectRequest(request: RequestData) {
  if (selectedRequest.value?.id === request.id) {
    selectedRequest.value = null;
  } else {
    selectedRequest.value = request;
  }
}

// Formatting helpers
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatCpuTime(micros: number): string {
  if (micros < 1000) return `${micros}μs`;
  if (micros < 1000000) return `${(micros / 1000).toFixed(1)}ms`;
  return `${(micros / 1000000).toFixed(2)}s`;
}

function formatTimestamp(timestamp: string): string {
  return dayjs(timestamp).fromNow();
}

// Styling helpers
function getStatusColor(status: number): string {
  if (status >= 500) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  if (status >= 400) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
  if (status >= 300) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  if (status >= 200) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
}

function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    POST: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    PATCH: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[method] || 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
}

function getLogBgColor(level: string): string {
  const colors: Record<string, string> = {
    error: 'bg-red-50 dark:bg-red-900/10',
    warn: 'bg-yellow-50 dark:bg-yellow-900/10',
    warning: 'bg-yellow-50 dark:bg-yellow-900/10',
    debug: 'bg-blue-50 dark:bg-blue-900/10',
  };
  return colors[level] || 'bg-transparent';
}

function getLogLevelColor(level: string): string {
  const colors: Record<string, string> = {
    error: 'text-red-600 dark:text-red-400',
    warn: 'text-yellow-600 dark:text-yellow-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
    debug: 'text-neutral-500',
  };
  return colors[level] || 'text-neutral-600 dark:text-neutral-400';
}

// Auto-refresh
let refreshInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  refreshInterval = setInterval(() => {
    // Requests will auto-refresh due to reactive query params
  }, 10000);
});

onBeforeUnmount(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
