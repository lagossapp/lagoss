<template>
  <div class="mx-auto flex w-full max-w-4xl flex-col gap-8">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3.5">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-lg font-bold uppercase text-teal-700 dark:bg-teal-500/15 dark:text-teal-400"
        >
          {{ organization?.name[0] }}
        </div>
        <div>
          <h1 class="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {{ organization?.name }}
          </h1>
          <p v-if="organization?.description" class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ organization.description }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-teal-700 disabled:opacity-50"
        :disabled="creatingApp"
        @click="createApp()"
      >
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {{ creatingApp ? 'Creating…' : 'New app' }}
      </button>
    </div>

    <!-- Two-column body -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <!-- Apps (wider) -->
      <section class="lg:col-span-3">
        <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Apps</h2>

        <!-- Skeleton -->
        <div v-if="pending" class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div
            v-for="i in 4"
            :key="i"
            class="h-[68px] animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800/60"
          />
        </div>

        <!-- Grid -->
        <div v-else-if="apps?.length" class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <router-link
            v-for="app in apps"
            :key="app.id"
            :to="`/organizations/${organization?.id}/apps/${app.name}`"
            class="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-xs transition-colors hover:bg-neutral-50 dark:border-transparent dark:bg-neutral-800 dark:hover:bg-neutral-600/60"
          >
            <AppFavicon :app="app" />
            <div class="min-w-0 flex-1">
              <p
                class="truncate text-sm font-semibold text-neutral-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400"
              >
                {{ app.name }}
              </p>
              <p class="truncate text-xs text-neutral-400 dark:text-neutral-500">{{ getCurrentDomain(app) }}</p>
            </div>
            <span
              class="shrink-0 text-[11px] text-neutral-400 dark:text-neutral-500"
              :title="dayjs(app.updatedAt).format('DD MMM YYYY HH:mm')"
            >
              {{ dayjs().to(app.updatedAt) }}
            </span>
          </router-link>
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-14 dark:border-neutral-700"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-500/10">
            <svg
              class="h-5 w-5 text-teal-600 dark:text-teal-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
              />
            </svg>
          </div>
          <p class="mt-3 text-sm font-semibold text-neutral-900 dark:text-white">No apps yet</p>
          <p class="mt-1 text-xs text-neutral-400 dark:text-neutral-500">Deploy your first serverless function.</p>
          <button
            type="button"
            class="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg bg-teal-600 px-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-teal-700"
            @click="createApp()"
          >
            <svg
              class="h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create first app
          </button>
        </div>
      </section>

      <!-- Deployments (narrower) -->
      <section class="lg:col-span-2">
        <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Recent deployments
        </h2>

        <!-- Skeleton -->
        <div v-if="pending" class="flex flex-col gap-2">
          <div
            v-for="i in 5"
            :key="i"
            class="h-[52px] animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800/60"
          />
        </div>

        <!-- List -->
        <div
          v-else-if="overview?.recentDeployments?.length"
          class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-transparent dark:bg-neutral-800"
        >
          <router-link
            v-for="dep in overview.recentDeployments"
            :key="dep.id"
            :to="`/organizations/${organization?.id}/apps/${dep.appName}/deployments`"
            class="group flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-600/60 not-last:border-b not-last:border-neutral-100 dark:not-last:border-white/5"
          >
            <span
              class="h-1.5 w-1.5 shrink-0 rounded-full"
              :class="dep.isProduction ? 'bg-teal-500' : 'bg-neutral-300 dark:bg-neutral-600'"
              :title="dep.isProduction ? 'Production' : 'Preview'"
            />
            <div class="min-w-0 flex-1">
              <p
                class="truncate text-sm font-medium text-neutral-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400"
              >
                {{ dep.appName }}
              </p>
              <p class="truncate text-xs text-neutral-400 dark:text-neutral-500">
                <span v-if="dep.commit" class="font-mono">{{ dep.commit.slice(0, 7) }}</span>
                <span v-if="dep.commit"> · </span>
                {{ dep.triggerer ?? 'Lagoss' }}
              </p>
            </div>
            <span
              class="shrink-0 text-[11px] text-neutral-400 dark:text-neutral-500"
              :title="dayjs(dep.createdAt).format('DD MMM YYYY HH:mm')"
            >
              {{ dayjs().to(dep.createdAt) }}
            </span>
          </router-link>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="!pending"
          class="flex items-center justify-center rounded-xl border border-dashed border-neutral-200 py-12 dark:border-neutral-700"
        >
          <p class="text-xs text-neutral-400 dark:text-neutral-500">No deployments yet</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~~/lib/dayjs';

const router = useRouter();
const organization = typedInject('org');

const { data: overview, pending } = await useFetch(() => `/api/_ui/organizations/${organization.value.id}/overview`);
const { data: apps } = await useFetch(() => `/api/organizations/${organization.value.id}/apps`);

const creatingApp = ref(false);
async function createApp() {
  creatingApp.value = true;
  try {
    const app = await $fetch(`/api/organizations/${organization.value.id}/apps`, {
      method: 'POST',
      body: { playground: false },
    });
    if (!app) throw new Error('Failed to create app');
    await router.push(`/organizations/${app.organizationId}/apps/${app.name}`);
  } finally {
    creatingApp.value = false;
  }
}
</script>
