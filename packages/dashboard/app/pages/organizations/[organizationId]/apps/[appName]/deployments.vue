<template>
  <div v-if="app" class="flex h-full w-full flex-col">
    <AppHeader :app="app" />

    <div class="mx-auto flex w-full max-w-4xl flex-col flex-1 overflow-hidden">
      <Card class="flex flex-col overflow-hidden p-0!">
        <!-- Loading -->
        <div v-if="!deployments" class="flex h-32 items-center justify-center">
          <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-neutral-400" />
        </div>

        <!-- Empty state -->
        <div
          v-else-if="deployments.length === 0"
          class="flex flex-col items-center justify-center gap-3 p-16 text-center"
        >
          <UIcon name="i-heroicons-rocket-launch" class="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          <div>
            <p class="font-semibold text-neutral-600 dark:text-neutral-300">No deployments yet</p>
            <p class="mt-1 text-sm text-neutral-500">Deploy your first function using the CLI to get started.</p>
          </div>
        </div>

        <!-- Deployment rows -->
        <div v-else class="flex flex-col divide-y divide-neutral-200 overflow-y-auto dark:divide-neutral-800">
          <div
            v-for="deployment in deployments.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)))"
            :key="deployment.id"
            class="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
          >
            <!-- Production / Preview badge -->
            <span
              class="flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-bold shadow-sm"
              :class="
                deployment.isProduction
                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300'
                  : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
              "
            >
              <UIcon
                :name="deployment.isProduction ? 'i-heroicons-check-circle' : 'i-heroicons-clock'"
                class="h-3.5 w-3.5"
              />
              {{ deployment.isProduction ? 'Production' : 'Preview' }}
            </span>

            <!-- URL -->
            <a
              :href="getFullCurrentDomain({ name: deployment.id })"
              rel="noopener noreferrer"
              target="_blank"
              class="min-w-0 flex-1 truncate font-mono text-sm font-medium text-neutral-800 hover:text-teal-600 dark:text-neutral-200 dark:hover:text-teal-400"
            >
              {{ getFullCurrentDomain({ name: deployment.id }) }}
            </a>

            <!-- Metadata -->
            <div class="flex shrink-0 items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <!-- Busy states -->
              <span
                v-if="promotingDeploymentId === deployment.id"
                class="flex items-center gap-1.5 text-teal-600 dark:text-teal-400"
              >
                <UIcon name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
                Promoting…
              </span>
              <span
                v-else-if="deletingDeploymentId === deployment.id"
                class="flex items-center gap-1.5 text-red-500 dark:text-red-400"
              >
                <UIcon name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
                Deleting…
              </span>
              <template v-else>
                <span v-if="deployment.commit" class="flex items-center gap-1.5">
                  <UIcon name="i-heroicons-code-bracket" class="h-4 w-4" />
                  <span class="font-mono">{{ deployment.commit.slice(0, 7) }}</span>
                </span>
                <span v-if="deployment.triggerer" class="flex items-center gap-1.5">
                  <UIcon name="i-heroicons-user" class="h-4 w-4" />
                  {{ deployment.triggerer }}
                </span>
                <span class="flex items-center gap-1.5">
                  <UIcon name="i-heroicons-clock" class="h-4 w-4" />
                  {{ dayjs().to(deployment.createdAt) }}
                </span>
              </template>
            </div>

            <!-- Actions menu -->
            <UDropdownMenu :items="getDeploymentDropdownItems(deployment)">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-ellipsis-horizontal"
                size="sm"
                class="shrink-0"
              />
            </UDropdownMenu>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';
import type { Deployment } from '~/types';
import { dayjs } from '~~/lib/dayjs';

const app = typedInject('app');
const toast = useToast();

const { data: deployments, refresh: refreshDeployments } = await useFetch<Deployment[]>(
  () => `/api/apps/${app.value.id}/deployments`,
);

const promotingDeploymentId = ref<string>();
async function promoteDeployment(deployment: Deployment) {
  if (promotingDeploymentId.value) return;
  if (!confirm('Are you sure you want to promote this deployment to production?')) return;

  promotingDeploymentId.value = deployment.id;
  try {
    await $fetch(`/api/apps/${app.value.id}/deployments/${deployment.id}/deploy`, {
      method: 'POST',
      body: {
        isProduction: true,
      },
    });

    await refreshDeployments();
  } finally {
    promotingDeploymentId.value = undefined;
  }
}

const deletingDeploymentId = ref<string>();
async function deleteDeployment(deployment: Deployment) {
  if (deletingDeploymentId.value) return;
  if (!confirm('Are you sure you want to delete this deployment?')) return;

  deletingDeploymentId.value = deployment.id;
  try {
    await $fetch(`/api/apps/${app.value.id}/deployments/${deployment.id}`, {
      method: 'DELETE',
    });
    await refreshDeployments();
  } finally {
    deletingDeploymentId.value = undefined;
  }
}

function getDeploymentDropdownItems(deployment: Deployment): DropdownMenuItem[] {
  const items: DropdownMenuItem[] = [];

  if (!deployment.isProduction) {
    items.push({
      label: 'Promote to Production',
      icon: 'i-ion-arrow-up-circle',
      async onSelect() {
        await promoteDeployment(deployment);
      },
    });
  }

  items.push({
    label: 'Copy Url',
    icon: 'i-ion-copy',
    async onSelect() {
      await navigator.clipboard.writeText(getFullCurrentDomain({ name: deployment.id }));
      toast.add({
        color: 'success',
        title: 'Deployment URL copied to clipboard',
      });
    },
  });
  items.push({
    label: 'Visit',
    icon: 'i-ion-open',
    href: getFullCurrentDomain({ name: deployment.id }),
    target: '_blank',
  });

  if (!deployment.isProduction) {
    items.push({
      label: 'Delete',
      icon: 'i-ion-trash',
      async onSelect() {
        await deleteDeployment(deployment);
      },
    });
  }

  return [items];
}
</script>
