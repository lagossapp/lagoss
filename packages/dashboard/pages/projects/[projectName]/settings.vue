<template>
  <div class="w-full">
    <ProjectHeader v-if="project" :project="project" />

    <div class="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <Card>
        <form @submit.prevent="saveName" class="flex flex-col items-start gap-4">
          <h2 class="text-xl">Name</h2>

          <p class="text-gray-500">
            Change the name of this Function. Note that changing the name also changes the default domain.
          </p>

          <UFormGroup label="Name" required>
            <UButtonGroup size="md" orientation="horizontal">
              <UInput v-if="project" v-model="project.name" placeholder="your-name" size="md" />
              <UInput :model-value="`.${$config.public.root.domain}`" disabled class="!cursor-default" size="md" />
            </UButtonGroup>
          </UFormGroup>

          <div class="flex w-full border-t pt-2">
            <UButton type="submit" label="Save" size="md" color="white" class="ml-auto" />
          </div>
        </form>
      </Card>

      <Card>
        <form @submit.prevent="saveEnvironmentVariables" class="flex flex-col items-start gap-4">
          <h2 class="text-xl">Environment variables</h2>

          <p class="text-gray-500">Environment variables are injected into your Function at runtime.</p>

          <div class="flex flex-col gap-2">
            <div v-if="project" v-for="envVariable in project.envVariables" class="flex w-full gap-2">
              <UInput v-model="envVariable.key" placeholder="Key" size="md" />
              <UInput v-model="envVariable.value" placeholder="Value" size="md" icon="i-heroicons-key" />
              <UButton icon="i-heroicons-minus" size="md" color="white" @click="removeEnvVariable(envVariable.key)" />
            </div>
          </div>

          <UButton icon="i-heroicons-plus" label="Add" size="md" color="white" @click="addEnvVariable" />

          <div class="flex w-full border-t pt-2">
            <UButton type="submit" label="Save" size="md" color="white" class="ml-auto" />
          </div>
        </form>
      </Card>

      <Card>
        <form @submit.prevent="saveDomains" class="flex flex-col items-start gap-4">
          <h2 class="text-xl">Domains</h2>

          <p class="text-gray-500">
            The default domain is based on this Function's name. You can also add custom domains.
          </p>

          <div class="flex gap-4">
            <span v-if="project">{{ project.name }}.{{ $config.public.root.domain }}</span>
            <span class="text-gray-500">Default domain</span>
          </div>

          <div v-if="project" v-for="domain in project.domains" :key="domain.domain" class="flex gap-2">
            <UInput v-model="domain.domain" placeholder="your-domain.tld" size="md" />
            <UButton icon="i-heroicons-minus" color="white" @click="removeDomain(domain.domain)" />
          </div>

          <UButton icon="i-heroicons-plus" label="Add" size="md" color="white" @click="addDomain" />

          <div class="flex w-full border-t pt-2">
            <UButton type="submit" label="Save" size="md" color="white" class="ml-auto" />
          </div>
        </form>
      </Card>

      <Card>
        <form @submit.prevent="saveCron" class="flex flex-col items-start gap-4">
          <h2 class="text-xl">Cron</h2>

          <p class="text-gray-500">
            Run this Function automatically at a scheduled rate using a Cron expression. You can also choose in which
            Region to run the Function.
          </p>

          <UFormGroup label="Expression" required>
            <UInput
              v-if="project"
              :model-value="project.cron || ''"
              placeholder="* */12 * * *"
              @update:model-value="project.cron = $event"
            />
          </UFormGroup>

          <div class="flex w-full border-t pt-2">
            <UButton type="submit" label="Save" size="md" color="white" class="ml-auto" />
          </div>
        </form>
      </Card>

      <Card class="flex flex-col items-start gap-4 border-red-500 bg-red-100">
        <h2 class="text-xl text-red-800">Delete</h2>

        <p class="text-red-800">
          Delete the project "{{ project?.name }}.{{ $config.public.root.domain }}" and all of its deployments and
          domains. This action is not reversible, so continue with extreme caution.
        </p>

        <div class="flex w-full border-t border-red-300 pt-2">
          <UButton type="submit" label="Delete" size="md" color="red" class="ml-auto" @click="deleteProject" />
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Domain } from '~/server/db/schema';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const { projectName } = route.params;

const { data: dbProject, refreshProject } = useFetch(`/api/projects/${projectName}`);

const project = ref<typeof dbProject.value>();
watch(
  dbProject,
  () => {
    project.value = dbProject.value;
  },
  { immediate: true },
);

function addEnvVariable() {
  project.value?.envVariables.push({ key: '', value: '' });
}

function addDomain() {
  project.value?.domains.push({ domain: '' } as Domain);
}

function removeEnvVariable(key: string) {
  if (!project.value) return;
  project.value = {
    ...project.value,
    envVariables: project.value.envVariables.filter(envVariable => envVariable.key !== key),
  };
}

function removeDomain(domain: string) {
  if (!project.value) return;
  project.value = {
    ...project.value,
    domains: project.value.domains.filter(envVariable => envVariable.domain !== domain),
  };
}

async function saveName() {
  if (!project.value) return;

  await $fetch(`/api/projects/${projectName}`, {
    method: 'PATCH',
    body: {
      name: project.value.name,
    },
  });

  toast.add({
    title: 'Project updated',
    description: `The project "${project.value.name}" was updated.`,
    color: 'green',
  });

  await router.push(`/org/${user.value?.currentOrganizationId}/projects/${project.value.name}`);

  await refreshProject();
}

async function saveEnvironmentVariables() {
  if (!project.value) return;

  await $fetch(`/api/projects/${projectName}`, {
    method: 'PATCH',
    body: {
      envVariables: project.value.envVariables,
    },
  });

  toast.add({
    title: 'Environment variables updated',
    description: `The environment variables for the project "${project.value.name}" were updated.`,
    color: 'green',
  });

  await refreshProject();
}

async function saveDomains() {
  if (!project.value) return;

  await $fetch(`/api/projects/${projectName}`, {
    method: 'PATCH',
    body: {
      domains: project.value.domains,
    },
  });

  toast.add({
    title: 'Domains updated',
    description: `The domains for the project "${project.value.name}" were updated.`,
    color: 'green',
  });

  await refreshProject();
}

async function saveCron() {
  if (!project.value) return;

  await $fetch(`/api/projects/${projectName}`, {
    method: 'PATCH',
    body: {
      cron: project.value.cron,
    },
  });

  toast.add({
    title: 'Cron updated',
    description: `The cron for the project "${project.value.name}" was updated.`,
    color: 'green',
  });

  await refreshProject();
}

async function deleteProject() {
  if (prompt('Are you sure you want to delete this project? Type "DELETE" to confirm.') !== 'DELETE') return;

  await $fetch(`/api/projects/${projectName}`, { method: 'DELETE' });

  toast.add({
    title: 'Project deleted',
    description: `The project "${projectName}" was deleted.`,
  });

  await router.push(`/org/${user.value?.currentOrganizationId}`);
}
</script>
