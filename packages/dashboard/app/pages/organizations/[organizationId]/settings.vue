<template>
  <main class="mx-auto w-full max-w-6xl p-6">
    <header class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl leading-tight font-semibold">
          {{ organization?.name }}
          <span class="ml-2 text-sm font-normal text-neutral-500">Settings</span>
        </h1>
        <p class="mt-1 text-sm text-neutral-500">{{ organization?.description }}</p>
      </div>
    </header>

    <section class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <article class="col-span-2 space-y-4">
        <Card>
          <h2 class="text-lg font-medium">General</h2>
          <p class="mt-2 text-sm text-neutral-500">
            Change the organization name or description. This does not affect apps.
          </p>

          <form @submit.prevent="saveGeneral" class="mt-4 flex flex-col gap-4">
            <UFormField label="Name" required>
              <UInput
                v-model="organization.name"
                placeholder="Organization Name"
                size="md"
                aria-label="Organization name"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Description">
              <UInput
                :model-value="organization.description ?? undefined"
                placeholder="A brief description of your organization"
                size="md"
                aria-label="Organization description"
                class="w-full"
                @update:model-value="val => (organization.description = val)"
              />
            </UFormField>

            <div class="flex items-center justify-end gap-2">
              <UButton type="submit" label="Save" size="md" color="primary" />
            </div>
          </form>
        </Card>

        <Card>
          <h2 class="text-lg font-medium">Members</h2>
          <p class="mt-2 text-sm text-neutral-500">Manage organization members and roles.</p>
          <div class="mt-4">
            <!-- Placeholder: members UI will go here -->
            <p class="text-sm text-neutral-500">Members management coming soon.</p>
          </div>
        </Card>

        <Card class="ring-error bg-red-50 dark:bg-red-900">
          <h2 class="text-lg font-medium">Danger zone</h2>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            Deleting an organization removes all apps and data. This action cannot be undone.
          </p>

          <div class="mt-4">
            <div class="flex justify-end">
              <UButton color="error" label="Delete organization" size="md" @click="deleteOrganization" />
            </div>
          </div>
        </Card>
      </article>

      <Card>
        <h2 class="text-lg font-medium">Billing & Usage</h2>
        <p class="mt-2 text-sm text-neutral-500">
          You are on the <strong>{{ organization?.plan }}</strong> plan until
          <time :dateTime="organization?.planPeriodEnd">{{
            dayjs(organization?.planPeriodEnd).format('DD.MM.YYYY')
          }}</time>
        </p>

        <!-- Plan actual vs limits -->
        <div class="mt-4 space-y-3">
          <div>
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-medium">Requests (month)</span>
              <span class="text-sm text-neutral-500">{{ usage.requests }} / {{ plan.freeRequests ?? '—' }}</span>
            </div>
            <div
              class="mt-2 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700"
              role="progressbar"
              :aria-valuenow="usage.requests"
              :aria-valuemax="plan.freeRequests || 0"
              aria-label="Monthly requests usage"
            >
              <div
                :style="{ width: progressPct(usage.requests, plan.freeRequests) + '%' }"
                class="h-2 rounded-full bg-linear-to-r from-indigo-500 to-cyan-400"
              ></div>
            </div>
          </div>

          <div>
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-medium">Apps</span>
              <span class="text-sm text-neutral-500">{{ apps?.length ?? 0 }} / {{ plan.maxApps ?? '—' }}</span>
            </div>
            <div
              class="mt-2 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700"
              role="progressbar"
              :aria-valuenow="apps?.length ?? 0"
              :aria-valuemax="plan.maxApps || 0"
              aria-label="Apps usage"
            >
              <div
                :style="{ width: progressPct(apps?.length || 0, plan.maxApps) + '%' }"
                class="h-2 rounded-full bg-linear-to-r from-emerald-400 to-green-600"
              ></div>
            </div>
          </div>

          <ul class="mt-3 text-sm text-neutral-500">
            <li>Members allowed: {{ plan.organizationMembers ?? '—' }}</li>
            <li>Assets per app: {{ plan.maxAssetsPerApp ?? '—' }}</li>
          </ul>
        </div>
      </Card>
    </section>
  </main>
</template>

<script setup lang="ts">
import { dayjs } from '~~/lib/dayjs';
import { getPlanOfOrganization } from '~~/server/lib/plans';
import { ref, computed } from 'vue';

const router = useRouter();
const toast = useToast();
const organization = typedInject('org');
const refreshOrg = typedInject('refreshOrg');

const plan = computed(() => getPlanOfOrganization(organization.value));

const { data: apps } = await useFetch(`/api/organizations/${organization.value.id}/apps`);

const usage = ref({ requests: 0 });
/*
// TODO: implement server endpoint to return usage metrics. Example:
const { data: usageData } = await useFetch(`/api/organizations/${organization.value.id}/usage`);
usage.value = usageData.value || { requests: 0 };
*/

function progressPct(value: number | undefined, max: number | undefined) {
  if (!max || max <= 0) return 0;
  const pct = Math.min(100, Math.round(((value || 0) / max) * 100));
  return pct;
}

async function saveGeneral() {
  if (!organization.value) return;

  try {
    // TODO: implement API
    // await $fetch(`/api/organizations/${organization.value.id}`, {
    //   method: 'PUT',
    //   body: {
    //     name: organization.value.name,
    //     description: organization.value.description,
    //   },
    // });

    // TODO: refresh org list in dropdown
    await refreshOrg();

    toast.add({
      title: 'Organization updated',
      description: `The organization "${organization.value.name}" was updated successfully.`,
      color: 'success',
    });
  } catch (error: any) {
    toast.add({
      title: 'Failed to update organization',
      description: `The organization "${organization.value.name}" could not be updated: ${error.message || error}`,
      color: 'error',
    });
  }
}

async function deleteOrganization() {
  if (!organization.value) return;

  const confirm = window.prompt(`Type the organization name "${organization.value.name}" to confirm deletion:`);

  if (confirm !== organization.value.name) {
    return;
  }

  try {
    // TODO: implement API
    // await $fetch(`/api/organizations/${organization.value.id}`, {
    //   method: 'DELETE',
    // });

    toast.add({
      title: 'Organization deleted',
      description: `The organization "${organization.value.name}" was deleted successfully.`,
      color: 'success',
    });
    await router.push('/');
  } catch (error: any) {
    toast.add({
      title: 'Failed to delete organization',
      description: `The organization "${organization.value.name}" could not be deleted: ${error.message || error}`,
      color: 'error',
    });
  }
}
</script>
