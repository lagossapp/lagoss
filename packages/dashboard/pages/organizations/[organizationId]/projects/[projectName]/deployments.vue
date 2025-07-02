<template>
  <div v-if="project" class="w-full">
    <ProjectHeader :project="project" />

    <div class="mx-auto flex max-w-4xl flex-col gap-4">
      <UContainer
        v-if="deployments?.length === 0"
        class="mt-4 w-full rounded border border-gray-200 py-16 text-center hover:shadow"
      >
        <p class="text-gray-500">No deployments yet! Please create a deployment using the CLI!</p>
        <!-- <a href="https://docs.lagoss.io" target="_blank" class="text-blue-500">
          Quickstart guide!
        </a> -->
      </UContainer>
      <div
        v-for="deployment in deployments?.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)))"
        :id="deployment.id"
        class="flex w-full items-center rounded-md border border-gray-300 p-4"
      >
        <div class="flex flex-col">
          <div>
            <a
              :href="getFullCurrentDomain({ name: deployment.id })"
              rel="noopener noreferrer"
              target="_blank"
              class="text-blue-500"
            >
              {{ getFullCurrentDomain({ name: deployment.id }) }}
            </a>
            <span v-if="deployment.isProduction" class="ml-2">(Production)</span>
          </div>
          <span class="text-gray-500">{{ dayjs().to(deployment.createdAt) }}</span>
          <span v-if="promotingDeploymentId === deployment.id">promoting deployment to production ...</span>
          <span v-if="deletingDeploymentId === deployment.id">deleting deployment ...</span>
        </div>

        <div class="ml-auto flex flex-col">
          <span class="text-gray-500">{{ deployment.commit ?? 'No commit linked' }}</span>
          <span class="text-gray-500">By {{ deployment.triggerer }}</span>
        </div>

        <UDropdown :items="getDeploymentDropdownItems(deployment)" class="ml-4">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~/lib/dayjs';
import type { Deployment } from '~/server/db/schema';

const { project } = useProject();

const { data: deployments, refresh: refreshDeployments } = await useFetch(
  () => `/api/projects/${project.value.name}/deployments`,
);

const promotingDeploymentId = ref<string>();
async function promoteDeployment(deployment: Deployment) {
  if (promotingDeploymentId.value) return;
  if (!confirm('Are you sure you want to promote this deployment to production?')) return;

  promotingDeploymentId.value = deployment.id;
  try {
    await $fetch(`/api/projects/${project.value.name}/deployments/${deployment.id}/deploy`, {
      method: 'POST',
      body: {
        isProduction: true,
      },
    });

    await refreshDeployments();
  } catch (error) {
    throw error;
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
    await $fetch(`/api/projects/${project.value.name}/deployments/${deployment.id}`, {
      method: 'DELETE',
    });

    await refreshDeployments();
  } catch (error) {
    throw error;
  } finally {
    deletingDeploymentId.value = undefined;
  }
}

function getDeploymentDropdownItems(deployment: Deployment) {
  const items = [];

  if (!deployment.isProduction) {
    items.push({
      label: 'Promote to Production',
      icon: 'i-ion-arrow-up-circle-outline',
      click() {
        promoteDeployment(deployment);
      },
    });
  }

  // {
  //   label: 'Copy Url',
  //   icon: 'i-heroicons-arrow-right-circle-20-solid',
  //   click() {
  //     // TODO:
  //   },
  // },
  items.push({
    label: 'Visit',
    icon: 'i-ion-open-outline',
    click() {
      window.open(getFullCurrentDomain({ name: deployment.id }), '_blank');
    },
  });

  if (!deployment.isProduction) {
    items.push({
      label: 'Delete',
      icon: 'i-ion-trash-outline',
      click() {
        deleteDeployment(deployment);
      },
    });
  }

  return [items];
}
</script>
