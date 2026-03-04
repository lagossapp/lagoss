<template>
  <div class="mx-auto flex w-full max-w-5xl flex-col gap-8">
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
        <UIcon name="i-heroicons-plus" class="h-4 w-4" />
        {{ creatingApp ? 'Creating…' : 'New app' }}
      </button>
    </div>

    <!-- Two-column body -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Apps (wider, 2 cols) -->
      <section class="lg:col-span-2">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Apps
            <span
              v-if="apps?.length"
              class="ml-1.5 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            >
              {{ apps.length }}
            </span>
          </h2>
        </div>

        <!-- Skeleton -->
        <div v-if="pending" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="i in 4"
            :key="i"
            class="h-[110px] animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800/60"
          />
        </div>

        <!-- Grid -->
        <div v-else-if="apps?.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <router-link
            v-for="app in apps"
            :key="app.id"
            :to="`/organizations/${organization?.id}/apps/${app.name}`"
            class="group"
          >
            <Card
              class="flex flex-col gap-3 cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
            >
              <!-- Top row: favicon + name + arrow -->
              <div class="flex items-start gap-3">
                <AppFavicon :app="app" />
                <div class="min-w-0 flex-1">
                  <p
                    class="truncate font-semibold text-neutral-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400"
                  >
                    {{ app.name }}
                  </p>
                  <p class="truncate text-xs font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
                    {{ getCurrentDomain(app) }}
                  </p>
                </div>
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="mt-0.5 h-4 w-4 shrink-0 text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-teal-500 dark:text-neutral-600 dark:group-hover:text-teal-400"
                />
              </div>

              <!-- Bottom row: last updated -->
              <div class="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                <UIcon name="i-heroicons-clock" class="h-3.5 w-3.5 shrink-0" />
                <span :title="dayjs(app.updatedAt).format('DD MMM YYYY HH:mm')">
                  Updated {{ dayjs().to(app.updatedAt) }}
                </span>
              </div>
            </Card>
          </router-link>
        </div>

        <!-- Empty state -->
        <Card v-else class="flex flex-col items-center justify-center py-16">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-500/10">
            <UIcon name="i-heroicons-server-stack" class="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>
          <p class="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">No apps yet</p>
          <p class="mt-1 text-xs text-neutral-400 dark:text-neutral-500">Deploy your first serverless function.</p>
          <button
            type="button"
            class="mt-5 inline-flex h-8 items-center gap-1.5 rounded-lg bg-teal-600 px-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-teal-700"
            @click="createApp()"
          >
            <UIcon name="i-heroicons-plus" class="h-3.5 w-3.5" />
            Create first app
          </button>
        </Card>
      </section>

      <!-- Deployments (narrower, 1 col) -->
      <section class="lg:col-span-1">
        <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Recent deployments
        </h2>

        <!-- Skeleton -->
        <div v-if="pending" class="flex flex-col gap-2">
          <div
            v-for="i in 6"
            :key="i"
            class="h-[58px] animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800/60"
          />
        </div>

        <!-- List -->
        <Card v-else-if="overview?.recentDeployments?.length" class="overflow-hidden p-0!">
          <router-link
            v-for="dep in overview.recentDeployments"
            :key="dep.id"
            :to="`/organizations/${organization?.id}/apps/${dep.appName}/deployments`"
            class="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5 not-last:border-b not-last:border-neutral-100 dark:not-last:border-white/5"
          >
            <!-- status dot -->
            <span
              class="mt-1 h-2 w-2 shrink-0 rounded-full"
              :class="dep.isProduction ? 'bg-teal-500' : 'bg-neutral-300 dark:bg-neutral-600'"
              :title="dep.isProduction ? 'Production' : 'Preview'"
            />
            <div class="min-w-0 flex-1">
              <p
                class="truncate text-sm font-medium text-neutral-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400"
              >
                {{ dep.appName }}
              </p>
              <p class="mt-0.5 flex items-center gap-1 truncate text-xs text-neutral-400 dark:text-neutral-500">
                <span v-if="dep.commit" class="font-mono">{{ dep.commit.slice(0, 7) }}</span>
                <span v-if="dep.commit" class="opacity-40">·</span>
                {{ dep.triggerer ?? 'Lagoss' }}
              </p>
            </div>
            <span
              class="mt-0.5 shrink-0 text-[11px] text-neutral-400 dark:text-neutral-500"
              :title="dayjs(dep.createdAt).format('DD MMM YYYY HH:mm')"
            >
              {{ dayjs().to(dep.createdAt) }}
            </span>
          </router-link>
        </Card>

        <!-- Empty state -->
        <Card v-else-if="!pending" class="flex items-center justify-center py-12">
          <p class="text-xs text-neutral-400 dark:text-neutral-500">No deployments yet</p>
        </Card>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~~/lib/dayjs';
import { getCurrentDomain } from '~/composables/utils';

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
