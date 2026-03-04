<template>
  <div v-if="app" class="flex h-full w-full flex-col">
    <AppHeader :app="app" />

    <div class="mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden">
      <!-- Filters -->
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <USelect v-model="requestTypeFilter" :items="requestTypeFilters" class="w-36" />
        <USelect v-model="statusFilter" :items="statusFilters" class="w-32" />
        <USelect v-model="methodFilter" :items="methodFilters" class="w-28" />
        <USelect v-model="timeframe" :items="timeframes" class="ml-auto w-40" />
      </div>

      <!-- Requests List -->
      <Card class="flex flex-col overflow-hidden p-0!">
        <div v-if="pending" class="flex h-32 items-center justify-center">
          <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-neutral-400" />
        </div>

        <div v-else-if="!requests?.length" class="flex flex-col items-center justify-center gap-3 p-16 text-center">
          <UIcon
            name="i-heroicons-arrow-path-rounded-square"
            class="h-12 w-12 text-neutral-300 dark:text-neutral-600"
          />
          <div>
            <p class="font-semibold text-neutral-600 dark:text-neutral-300">No requests found</p>
            <p class="mt-1 text-sm text-neutral-500">
              Try adjusting your filters or visit
              <a :href="getFullCurrentDomain({ name: app.name })" target="_blank" class="text-teal-500 hover:underline"
                >your app</a
              >
              to generate some traffic.
            </p>
          </div>
        </div>

        <div v-else class="flex flex-col divide-y divide-neutral-200 overflow-y-auto dark:divide-neutral-800">
          <button
            v-for="request in requests"
            :key="request.id"
            class="group flex items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
            :class="{
              'bg-teal-50/60 dark:bg-teal-900/10': selectedRequest?.id === request.id,
            }"
            @click="selectRequest(request)"
          >
            <!-- Request Type Indicator -->
            <UTooltip :text="request.cpu_time_micros ? 'Dynamic — executed by JS runtime' : 'Static — served directly'">
              <span
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md shadow-sm"
                :class="
                  request.cpu_time_micros
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'
                    : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
                "
              >
                <UIcon :name="request.cpu_time_micros ? 'i-heroicons-bolt' : 'i-heroicons-document'" class="h-4 w-4" />
              </span>
            </UTooltip>

            <!-- Status Badge -->
            <span
              class="flex h-7 w-14 shrink-0 items-center justify-center rounded-md text-xs font-bold shadow-sm"
              :class="getStatusColor(request.response_status_code)"
            >
              {{ request.response_status_code }}
            </span>

            <!-- Method Badge -->
            <span
              class="flex h-7 w-16 shrink-0 items-center justify-center rounded-md text-xs font-semibold shadow-sm"
              :class="getMethodColor(request.http_method)"
            >
              {{ request.http_method }}
            </span>

            <!-- URL -->
            <span class="min-w-0 flex-1 truncate font-mono text-sm">{{ request.url }}</span>

            <!-- Metadata -->
            <div class="flex shrink-0 items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span v-if="request.cpu_time_micros" class="flex items-center gap-1" title="CPU time">
                <UIcon name="i-heroicons-cpu-chip" class="h-3.5 w-3.5" />
                {{ formatCpuTime(request.cpu_time_micros) }}
              </span>
              <span v-if="request.bytes_in" class="flex items-center gap-1" title="Bytes in">
                <UIcon name="i-heroicons-arrow-up-tray" class="h-3.5 w-3.5" />
                {{ formatBytes(request.bytes_in) }}
              </span>
              <span v-if="request.bytes_out" class="flex items-center gap-1" title="Bytes out">
                <UIcon name="i-heroicons-arrow-down-tray" class="h-3.5 w-3.5" />
                {{ formatBytes(request.bytes_out) }}
              </span>
              <span class="w-20 text-right tabular-nums">{{ formatTimestamp(request.timestamp) }}</span>
            </div>

            <UIcon
              name="i-heroicons-chevron-right"
              class="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-400 dark:text-neutral-600 dark:group-hover:text-neutral-500"
            />
          </button>
        </div>
      </Card>
    </div>

    <!-- Detail panel — teleported to body so it's not clipped by max-w container -->
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="selectedRequest"
          class="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] dark:bg-black/40"
          @click="selectedRequest = null"
        />
      </Transition>

      <!-- Slide-over panel -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="selectedRequest"
          class="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
          @click.stop
        >
          <!-- Header -->
          <div class="shrink-0 border-b border-neutral-200 px-6 py-5 dark:border-neutral-800">
            <div class="mb-4 flex items-start justify-between gap-4">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="flex h-7 w-16 items-center justify-center rounded-md text-xs font-bold shadow-sm"
                  :class="getStatusColor(selectedRequest.response_status_code)"
                >
                  {{ selectedRequest.response_status_code }}
                </span>
                <span
                  class="flex h-7 w-20 items-center justify-center rounded-md text-xs font-semibold shadow-sm"
                  :class="getMethodColor(selectedRequest.http_method)"
                >
                  {{ selectedRequest.http_method }}
                </span>
                <span
                  class="flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold shadow-sm"
                  :class="
                    selectedRequest.cpu_time_micros
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                  "
                >
                  <UIcon
                    :name="selectedRequest.cpu_time_micros ? 'i-heroicons-bolt' : 'i-heroicons-document'"
                    class="h-3.5 w-3.5"
                  />
                  {{ selectedRequest.cpu_time_micros ? 'Dynamic' : 'Static' }}
                </span>
              </div>
              <UButton
                variant="ghost"
                color="neutral"
                icon="i-heroicons-x-mark"
                size="sm"
                class="shrink-0"
                @click="selectedRequest = null"
              />
            </div>

            <p class="mb-4 break-all font-mono text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {{ selectedRequest.url }}
            </p>

            <!-- Quick stats -->
            <div class="grid gap-3" :class="selectedRequest.cpu_time_micros ? 'grid-cols-4' : 'grid-cols-3'">
              <div class="rounded-lg bg-neutral-50 px-3 py-2.5 dark:bg-neutral-800">
                <p
                  class="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
                >
                  <UIcon name="i-heroicons-globe-alt" class="h-3.5 w-3.5" />
                  Region
                </p>
                <p class="mt-1 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ selectedRequest.region }}
                </p>
              </div>
              <div
                v-if="selectedRequest.cpu_time_micros"
                class="rounded-lg bg-neutral-50 px-3 py-2.5 dark:bg-neutral-800"
              >
                <p
                  class="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
                >
                  <UIcon name="i-heroicons-cpu-chip" class="h-3.5 w-3.5" />
                  CPU Time
                </p>
                <p class="mt-1 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ formatCpuTime(selectedRequest.cpu_time_micros) }}
                </p>
              </div>
              <div class="rounded-lg bg-neutral-50 px-3 py-2.5 dark:bg-neutral-800">
                <p
                  class="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
                >
                  <UIcon name="i-heroicons-arrow-up-tray" class="h-3.5 w-3.5" />
                  Bytes In
                </p>
                <p class="mt-1 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ formatBytes(selectedRequest.bytes_in) }}
                </p>
              </div>
              <div class="rounded-lg bg-neutral-50 px-3 py-2.5 dark:bg-neutral-800">
                <p
                  class="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
                >
                  <UIcon name="i-heroicons-arrow-down-tray" class="h-3.5 w-3.5" />
                  Bytes Out
                </p>
                <p class="mt-1 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ formatBytes(selectedRequest.bytes_out) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="shrink-0 border-b border-neutral-200 dark:border-neutral-800">
            <div class="flex px-4">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                class="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
                :class="
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-700 dark:text-teal-400'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                "
                @click="activeTab = tab.id"
              >
                <UIcon :name="tab.icon" class="h-4 w-4" />
                {{ tab.label }}
                <span
                  v-if="tab.id === 'logs' && requestLogs?.length"
                  class="rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums"
                  :class="
                    activeTab === tab.id
                      ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                      : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                  "
                >
                  {{ requestLogs.length }}
                </span>
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="flex-1 overflow-y-auto">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="space-y-4 p-6">
              <div>
                <label
                  class="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
                >
                  Request ID
                </label>
                <div
                  class="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-800/60"
                >
                  <code class="break-all font-mono text-sm text-neutral-800 dark:text-neutral-200">{{
                    selectedRequest.id
                  }}</code>
                </div>
              </div>

              <div>
                <label
                  class="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
                >
                  Timestamp
                </label>
                <div
                  class="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-800/60"
                >
                  <p class="font-mono text-sm text-neutral-800 dark:text-neutral-200">
                    {{ dayjs(selectedRequest.timestamp).format('DD MMM YYYY, HH:mm:ss.SSS') }}
                  </p>
                  <p class="mt-0.5 text-xs text-neutral-400">{{ formatTimestamp(selectedRequest.timestamp) }}</p>
                </div>
              </div>

              <div>
                <label
                  class="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
                >
                  Deployment
                </label>
                <div
                  class="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-800/60"
                >
                  <code class="font-mono text-sm text-neutral-800 dark:text-neutral-200">{{
                    selectedRequest.deployment_id
                  }}</code>
                </div>
              </div>
            </div>

            <!-- Logs Tab -->
            <div v-if="activeTab === 'logs'" class="flex flex-col">
              <div v-if="logsPending" class="flex h-64 items-center justify-center">
                <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-neutral-400" />
              </div>

              <div
                v-else-if="!requestLogs?.length"
                class="flex h-64 flex-col items-center justify-center gap-2 p-6 text-center"
              >
                <UIcon name="i-heroicons-document-text" class="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">No logs for this request</p>
                <p class="text-xs text-neutral-400 dark:text-neutral-500">
                  {{
                    selectedRequest?.cpu_time_micros
                      ? 'Logs will appear here when your function uses console methods'
                      : 'Static assets do not produce logs'
                  }}
                </p>
              </div>

              <div v-else class="divide-y divide-neutral-200 dark:divide-neutral-800">
                <div
                  v-for="(log, index) in requestLogs"
                  :key="index"
                  class="flex gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                  :class="getLogRowBg(log.level)"
                >
                  <div class="flex shrink-0 flex-col items-end gap-1 pt-0.5">
                    <span class="font-mono text-xs text-neutral-400 dark:text-neutral-500">
                      {{ dayjs(log.timestamp).format('HH:mm:ss.SSS') }}
                    </span>
                    <span class="rounded px-1.5 py-0.5 text-xs font-bold uppercase" :class="getLogPillColor(log.level)">
                      {{ log.level }}
                    </span>
                  </div>
                  <pre
                    class="min-w-0 flex-1 whitespace-pre-wrap break-all font-mono text-sm leading-relaxed"
                    :class="getLogTextColor(log.level)"
                    >{{ log.message }}</pre
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const app = typedInject('app');

import { dayjs } from '~~/lib/dayjs';

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

// Filters
const timeframe = ref('Last hour');
const requestTypeFilter = ref('dynamic');
const statusFilter = ref('all');
const methodFilter = ref('all');

const requestTypeFilters = [
  { label: 'All requests', value: 'all' },
  { label: 'Dynamic', value: 'dynamic' },
  { label: 'Static', value: 'static' },
];

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
const { data: requests, pending } = await useFetch(() => `/api/apps/${app.value.id}/requests`, {
  query: computed(() => ({
    timeframe: timeframe.value,
    requestType: requestTypeFilter.value,
    status: statusFilter.value,
    method: methodFilter.value,
  })),
});

// Selected request and its logs
const selectedRequest = ref<RequestData | null>(null);
const activeTab = ref('overview');

const tabs = computed(() => [
  { id: 'overview', label: 'Overview', icon: 'i-heroicons-information-circle' },
  ...(selectedRequest.value?.cpu_time_micros ? [{ id: 'logs', label: 'Logs', icon: 'i-heroicons-document-text' }] : []),
]);

const { data: requestLogs, pending: logsPending } = await useFetch(
  () => `/api/apps/${app.value.id}/requests/${selectedRequest.value?.id}/logs`,
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
    activeTab.value = 'overview'; // Reset to overview tab when opening a new request
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
  if (status >= 500) return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
  if (status >= 400) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
  if (status >= 300) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
  if (status >= 200) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
  return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
}

function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
    POST: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    PUT: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    PATCH: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  };
  return colors[method] || 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
}

function getLogRowBg(level: string): string {
  const colors: Record<string, string> = {
    error: 'bg-red-50/60 dark:bg-red-950/10',
    warn: 'bg-yellow-50/60 dark:bg-yellow-950/10',
    warning: 'bg-yellow-50/60 dark:bg-yellow-950/10',
  };
  return colors[level] ?? '';
}

function getLogPillColor(level: string): string {
  const colors: Record<string, string> = {
    error: 'bg-red-500 text-white dark:bg-red-600',
    warn: 'bg-yellow-500 text-white dark:bg-yellow-600',
    warning: 'bg-yellow-500 text-white dark:bg-yellow-600',
    info: 'bg-teal-500 text-white dark:bg-teal-600',
    debug: 'bg-neutral-400 text-white dark:bg-neutral-600',
  };
  return colors[level] || 'bg-neutral-500 text-white dark:bg-neutral-600';
}

function getLogTextColor(level: string): string {
  const colors: Record<string, string> = {
    error: 'text-red-900 dark:text-red-200',
    warn: 'text-yellow-900 dark:text-yellow-200',
    warning: 'text-yellow-900 dark:text-yellow-200',
    info: 'text-teal-900 dark:text-teal-200',
    debug: 'text-neutral-700 dark:text-neutral-300',
  };
  return colors[level] || 'text-neutral-900 dark:text-neutral-200';
}
</script>
