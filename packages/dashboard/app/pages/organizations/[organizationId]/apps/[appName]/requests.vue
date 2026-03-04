<template>
  <div v-if="app" class="flex h-full w-full flex-col">
    <AppHeader :app="app" />

    <div class="mx-auto flex flex-col w-full max-w-6xl flex-1 overflow-hidden">
      <!-- Filters -->
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <USelect v-model="requestTypeFilter" :items="requestTypeFilters" class="w-36" />
        <USelect v-model="statusFilter" :items="statusFilters" class="w-32" />
        <USelect v-model="methodFilter" :items="methodFilters" class="w-28" />
        <USelect v-model="timeframe" :items="timeframes" class="w-40 ml-auto" />
      </div>

      <!-- Requests List -->
      <div class="relative flex flex-1 overflow-hidden min-h-[40rem]">
        <Card class="flex flex-1 flex-col overflow-hidden p-0!">
          <div v-if="pending" class="flex h-32 items-center justify-center">
            <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-neutral-400" />
          </div>

          <div v-else-if="!requests?.length" class="p-6">
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
              class="group flex items-center gap-4 px-5 py-3.5 text-left transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              :class="{
                'bg-blue-50/50 ring-2 ring-inset ring-blue-200 dark:bg-blue-900/10 dark:ring-blue-800':
                  selectedRequest?.id === request.id,
              }"
              @click="selectRequest(request)"
            >
              <!-- Request Type Indicator -->
              <UTooltip
                :text="request.cpu_time_micros ? 'Dynamic — executed by JS runtime' : 'Static — served directly'"
              >
                <span
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md shadow-sm"
                  :class="
                    request.cpu_time_micros
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'
                      : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
                  "
                >
                  <UIcon
                    :name="request.cpu_time_micros ? 'i-heroicons-bolt' : 'i-heroicons-document'"
                    class="h-4 w-4"
                  />
                </span>
              </UTooltip>

              <!-- Status Badge -->
              <span
                class="flex h-7 w-14 items-center justify-center rounded-md text-xs font-bold shadow-sm"
                :class="getStatusColor(request.response_status_code)"
              >
                {{ request.response_status_code }}
              </span>

              <!-- Method Badge -->
              <span
                class="flex h-7 w-18 items-center justify-center rounded-md text-xs font-semibold shadow-sm"
                :class="getMethodColor(request.http_method)"
              >
                {{ request.http_method }}
              </span>

              <!-- URL -->
              <span class="min-w-0 flex-1 truncate font-mono text-sm font-medium">
                {{ request.url }}
              </span>

              <!-- Metadata -->
              <div class="flex shrink-0 items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                <span v-if="request.cpu_time_micros" class="flex items-center gap-1.5" title="CPU time">
                  <UIcon name="i-heroicons-cpu-chip" class="h-4 w-4" />
                  {{ formatCpuTime(request.cpu_time_micros) }}
                </span>
                <span v-if="request.bytes_in" class="flex items-center gap-1.5" title="Bytes in">
                  <UIcon name="i-heroicons-arrow-up-tray" class="h-4 w-4" />
                  {{ formatBytes(request.bytes_in) }}
                </span>
                <span v-if="request.bytes_out" class="flex items-center gap-1.5" title="Bytes out">
                  <UIcon name="i-heroicons-arrow-down-tray" class="h-4 w-4" />
                  {{ formatBytes(request.bytes_out) }}
                </span>
                <span class="w-20 text-right font-medium">
                  {{ formatTimestamp(request.timestamp) }}
                </span>
              </div>

              <!-- Expand indicator -->
              <UIcon name="i-heroicons-chevron-right" class="h-5 w-5 shrink-0 text-neutral-400" />
            </button>
          </div>
        </Card>

        <!-- Backdrop overlay -->
        <transition
          enter-active-class="transition-opacity duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="selectedRequest"
            class="absolute inset-0 bg-black/20 backdrop-blur-[2px] dark:bg-black/40"
            @click="selectedRequest = null"
          />
        </transition>

        <!-- Slide-over Panel -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-all duration-250 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div
            v-if="selectedRequest"
            class="absolute right-0 top-0 bottom-0 z-10 w-full max-w-3xl shadow-2xl"
            @click.stop
          >
            <Card
              class="flex h-full flex-col overflow-hidden border border-neutral-300 ring-1 ring-neutral-900/10 p-0! dark:border-neutral-600 dark:ring-neutral-100/10"
            >
              <!-- Header -->
              <div class="border-b border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
                <div class="mb-4 flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <span
                      class="flex h-8 w-16 items-center justify-center rounded-lg text-sm font-bold shadow-sm"
                      :class="getStatusColor(selectedRequest.response_status_code)"
                    >
                      {{ selectedRequest.response_status_code }}
                    </span>
                    <span
                      class="flex h-8 w-20 items-center justify-center rounded-lg text-sm font-semibold shadow-sm"
                      :class="getMethodColor(selectedRequest.http_method)"
                    >
                      {{ selectedRequest.http_method }}
                    </span>

                    <div
                      class="flex items-center gap-2 rounded-lg px-3 py-1.5"
                      :class="
                        selectedRequest.cpu_time_micros
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      "
                      :title="
                        selectedRequest.cpu_time_micros
                          ? 'Dynamic request processed by JS runtime'
                          : 'Static asset served directly'
                      "
                    >
                      <UIcon
                        :name="selectedRequest.cpu_time_micros ? 'i-heroicons-bolt' : 'i-heroicons-document'"
                        class="h-4 w-4"
                      />
                      <span class="text-sm font-semibold">
                        {{ selectedRequest.cpu_time_micros ? 'Dynamic Request' : 'Static Asset' }}
                      </span>
                    </div>
                  </div>

                  <UButton
                    variant="ghost"
                    color="neutral"
                    icon="i-heroicons-x-mark"
                    size="lg"
                    @click="selectedRequest = null"
                  />
                </div>

                <p class="mb-4 break-all font-mono text-base font-medium leading-relaxed">
                  {{ selectedRequest.url }}
                </p>

                <!-- Quick stats -->
                <div class="grid gap-4" :class="selectedRequest.cpu_time_micros ? 'grid-cols-4' : 'grid-cols-3'">
                  <div class="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800">
                    <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <UIcon name="i-heroicons-globe-alt" class="h-4 w-4" />
                      <span class="uppercase">Region</span>
                    </div>
                    <p class="mt-1 font-mono text-sm font-semibold">{{ selectedRequest.region }}</p>
                  </div>
                  <div v-if="selectedRequest.cpu_time_micros" class="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800">
                    <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <UIcon name="i-heroicons-cpu-chip" class="h-4 w-4" />
                      <span class="uppercase">CPU Time</span>
                    </div>
                    <p class="mt-1 font-mono text-sm font-semibold">
                      {{ formatCpuTime(selectedRequest.cpu_time_micros) }}
                    </p>
                  </div>
                  <div class="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800">
                    <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <UIcon name="i-heroicons-arrow-up-tray" class="h-4 w-4" />
                      <span class="uppercase">Bytes In</span>
                    </div>
                    <p class="mt-1 font-mono text-sm font-semibold">{{ formatBytes(selectedRequest.bytes_in) }}</p>
                  </div>
                  <div class="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800">
                    <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <UIcon name="i-heroicons-arrow-down-tray" class="h-4 w-4" />
                      <span class="uppercase">Bytes Out</span>
                    </div>
                    <p class="mt-1 font-mono text-sm font-semibold">{{ formatBytes(selectedRequest.bytes_out) }}</p>
                  </div>
                </div>
              </div>

              <!-- Tabs -->
              <div class="border-b border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50">
                <div class="flex gap-1 px-4">
                  <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    class="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-all"
                    :class="
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-100'
                    "
                    @click="activeTab = tab.id"
                  >
                    <UIcon :name="tab.icon" class="h-4 w-4" />
                    {{ tab.label }}
                    <span
                      v-if="tab.id === 'logs' && requestLogs?.length"
                      class="ml-1 rounded-full px-2 py-0.5 text-xs font-bold"
                      :class="
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                      "
                    >
                      {{ requestLogs.length }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Tab Content -->
              <div class="flex-1 overflow-y-auto bg-white dark:bg-neutral-900">
                <!-- Overview Tab -->
                <div v-if="activeTab === 'overview'" class="p-6">
                  <div class="space-y-6">
                    <div>
                      <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Request ID
                      </label>
                      <div
                        class="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        <code class="flex-1 break-all font-mono text-sm">{{ selectedRequest.id }}</code>
                      </div>
                    </div>

                    <div>
                      <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Timestamp
                      </label>
                      <div
                        class="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        <p class="font-mono text-sm">
                          {{ dayjs(selectedRequest.timestamp).format('DD MMM YYYY, HH:mm:ss.SSS') }}
                        </p>
                        <p class="mt-1 text-xs text-neutral-500">
                          {{ formatTimestamp(selectedRequest.timestamp) }}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Deployment
                      </label>
                      <div
                        class="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        <code class="font-mono text-sm">{{ selectedRequest.deployment_id }}</code>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Logs Tab -->
                <div v-if="activeTab === 'logs'" class="flex flex-col">
                  <div v-if="logsPending" class="flex h-64 items-center justify-center">
                    <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-neutral-400" />
                  </div>

                  <div v-else-if="!requestLogs?.length" class="flex h-64 flex-col items-center justify-center p-6">
                    <UIcon
                      name="i-heroicons-document-text"
                      class="mb-3 h-12 w-12 text-neutral-300 dark:text-neutral-600"
                    />
                    <p class="text-sm font-medium text-neutral-500">No logs for this request</p>
                    <p class="text-xs text-neutral-400">
                      {{
                        selectedRequest?.cpu_time_micros
                          ? 'Logs will appear here when your function uses console methods'
                          : 'Static assets do not produce logs'
                      }}
                    </p>
                  </div>

                  <div v-else class="space-y-0.5 p-4">
                    <div
                      v-for="(log, index) in requestLogs"
                      :key="index"
                      class="group flex gap-3 rounded-lg border px-4 py-3 transition-all hover:shadow-sm"
                      :class="getLogBorder(log.level)"
                    >
                      <div class="flex shrink-0 flex-col items-end gap-1 pt-0.5">
                        <span class="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                          {{ dayjs(log.timestamp).format('HH:mm:ss.SSS') }}
                        </span>
                        <span
                          class="rounded-md px-2 py-0.5 text-xs font-bold uppercase"
                          :class="getLogPillColor(log.level)"
                        >
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
            </Card>
          </div>
        </transition>
      </div>
    </div>
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
    GET: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    POST: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    PUT: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    PATCH: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  };
  return colors[method] || 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
}

function getLogBorder(level: string): string {
  const colors: Record<string, string> = {
    error: 'border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20',
    warn: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-900/50 dark:bg-yellow-950/20',
    warning: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-900/50 dark:bg-yellow-950/20',
    info: 'border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20',
    debug: 'border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/30',
  };
  return colors[level] || 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/20';
}

function getLogPillColor(level: string): string {
  const colors: Record<string, string> = {
    error: 'bg-red-500 text-white dark:bg-red-600',
    warn: 'bg-yellow-500 text-white dark:bg-yellow-600',
    warning: 'bg-yellow-500 text-white dark:bg-yellow-600',
    info: 'bg-blue-500 text-white dark:bg-blue-600',
    debug: 'bg-neutral-400 text-white dark:bg-neutral-600',
  };
  return colors[level] || 'bg-neutral-500 text-white dark:bg-neutral-600';
}

function getLogTextColor(level: string): string {
  const colors: Record<string, string> = {
    error: 'text-red-900 dark:text-red-200',
    warn: 'text-yellow-900 dark:text-yellow-200',
    warning: 'text-yellow-900 dark:text-yellow-200',
    info: 'text-blue-900 dark:text-blue-200',
    debug: 'text-neutral-700 dark:text-neutral-300',
  };
  return colors[level] || 'text-neutral-900 dark:text-neutral-200';
}
</script>
