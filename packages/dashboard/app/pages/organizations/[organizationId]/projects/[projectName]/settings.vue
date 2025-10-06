<template>
  <div v-if="project" class="w-full">
    <ProjectHeader :project="project" />

    <div class="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <Card>
        <form @submit.prevent="saveName" class="flex flex-col items-start gap-4">
          <h2 class="text-xl">Name</h2>

          <p class="text-neutral-500">
            Change the name of this project. Note that changing the name also changes the default domain.
          </p>

          <UFormField label="Name" required>
            <UFieldGroup size="md" orientation="horizontal">
              <UInput v-if="project" v-model="project.name" placeholder="your-name" size="md" />
              <UInput :model-value="`.${$config.public.root.domain}`" disabled class="cursor-default!" size="md" />
            </UFieldGroup>
          </UFormField>

          <div class="border-accented flex w-full border-t pt-2">
            <UButton type="submit" label="Save" size="md" color="neutral" variant="outline" class="ml-auto" />
          </div>
        </form>
      </Card>

      <Card>
        <form @submit.prevent="saveEnvironmentVariables" class="flex flex-col items-start gap-4">
          <h2 class="text-xl">Environment variables</h2>

          <p class="text-neutral-500">Environment variables are injected into your Function at runtime.</p>

          <div class="flex flex-col gap-2">
            <div v-if="project" v-for="(envVariable, i) in project.envVariables" class="flex w-full gap-2">
              <UInput v-model="envVariable.key" placeholder="Key" size="md" @paste.prevent="addPastedEnvVariables" />
              <UInput v-model="envVariable.value" placeholder="Value" size="md" icon="i-heroicons-key" />
              <UButton
                icon="i-heroicons-minus"
                size="md"
                color="neutral"
                variant="outline"
                @click="removeEnvVariable(i)"
              />
            </div>
          </div>

          <UButton
            icon="i-heroicons-plus"
            label="Add"
            size="md"
            color="neutral"
            variant="outline"
            @click="addEnvVariable"
          />

          <div class="border-accented flex w-full border-t pt-2">
            <UButton type="submit" label="Save" size="md" color="neutral" variant="outline" class="ml-auto" />
          </div>
        </form>
      </Card>

      <Card class="flex flex-col items-start gap-4">
        <h2 class="text-xl">Domains</h2>

        <p class="text-neutral-500">
          The default domain is based on this Function's name. You can also add custom domains.
        </p>

        <div class="flex gap-4">
          <span>{{ project.name }}.{{ $config.public.root.domain }}</span>
          <span class="text-neutral-500">Default domain</span>
        </div>

        <div v-for="domain in project.domains" :key="domain" class="flex items-center gap-2">
          <span>{{ domain }}</span>
          <UButton icon="i-heroicons-minus" color="neutral" variant="outline" @click="removeDomain(domain)" />
        </div>

        <form @submit.prevent="addDomain" class="flex gap-2">
          <UInput v-model="newDomain" placeholder="your-domain.com" size="md" />
          <UButton type="submit" icon="i-heroicons-plus" label="Add" size="md" color="neutral" variant="outline" />
        </form>
      </Card>

      <Card>
        <form @submit.prevent="saveCron" class="flex flex-col items-start gap-4">
          <h2 class="text-xl">Cron</h2>

          <p class="text-neutral-500">
            Run this Function automatically at a scheduled rate using a Cron expression. You can also choose in which
            Region to run the Function.
          </p>

          <UFormField label="Expression" required>
            <UInput
              v-if="project"
              :model-value="project.cron || ''"
              placeholder="* */12 * * *"
              size="md"
              @update:model-value="project.cron = $event"
            />
          </UFormField>

          <div class="border-accented flex w-full border-t pt-2">
            <UButton type="submit" label="Save" size="md" color="neutral" variant="outline" class="ml-auto" />
          </div>
        </form>
      </Card>

      <Card
        class="ring-error flex flex-col items-start gap-4 bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
      >
        <h2 class="text-xl">Delete</h2>

        <p>
          Delete the project "{{ project?.name }}.{{ $config.public.root.domain }}" and all of its deployments and
          domains. This action is not reversible, so continue with extreme caution.
        </p>

        <div class="border-error flex w-full border-t pt-2">
          <UButton type="submit" label="Delete" size="md" color="error" class="ml-auto" @click="deleteProject" />
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const toast = useToast();

const { project: dbProject, refreshProject } = useProject();

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

function removeEnvVariable(index: number) {
  if (!project.value) return;
  project.value = {
    ...project.value,
    envVariables: project.value.envVariables.filter((_, i) => i !== index),
  };
}

function addPastedEnvVariables(event: ClipboardEvent) {
  if (!project.value) {
    throw new Error('Project not found');
  }
  if (event.clipboardData === null) return;

  const text = event.clipboardData.getData('text');

  if (text.includes('\n')) {
    const entries = text.split('\n');
    const pastedEnv: Record<string, string> = {};

    for (const entry of entries) {
      const [key, value] = entry.split(/=(.*)/s);

      if (key && value && !key.trimStart().startsWith('#')) {
        pastedEnv[key] = value;
      }
    }

    project.value = {
      ...project.value,
      envVariables: project.value.envVariables.filter(({ key, value }) => !pastedEnv[key] && key && value),
    };
    project.value?.envVariables?.push(...Object.entries(pastedEnv).map(([key, value]) => ({ key, value })));
  }
}

async function removeDomain(domain: string) {
  if (!project.value) {
    throw new Error('Project not found');
  }
  if (!confirm(`Are you sure you want to remove the domain "${domain}"?`)) return;

  await $fetch(`/api/projects/${project.value.id}`, {
    method: 'PATCH',
    body: {
      domains: project.value.domains?.filter(_domain => _domain !== domain),
    },
  });

  toast.add({
    title: 'Domain removed',
    description: `The domain "${domain}" was removed from the project "${project.value.name}".`,
    color: 'success',
  });

  await refreshProject();
}

async function saveName() {
  if (!project.value) {
    throw new Error('Project not found');
  }

  await $fetch(`/api/projects/${project.value.id}`, {
    method: 'PATCH',
    body: {
      name: project.value.name,
    },
  });

  toast.add({
    title: 'Project updated',
    description: `The project "${project.value.name}" was updated.`,
    color: 'success',
  });

  await router.push(`/organizations/${project.value.organizationId}/projects/${project.value.name}`);

  await refreshProject();
}

async function saveEnvironmentVariables() {
  if (!project.value) {
    throw new Error('Project not found');
  }

  await $fetch(`/api/projects/${project.value.id}`, {
    method: 'PATCH',
    body: {
      envVariables: project.value.envVariables.filter(({ key, value }) => key && value),
    },
  });

  toast.add({
    title: 'Environment variables updated',
    description: `The environment variables for the project "${project.value.name}" were updated.`,
    color: 'success',
  });

  await refreshProject();
}

const newDomain = ref('');
async function addDomain() {
  if (!project.value) {
    throw new Error('Project not found');
  }
  if (!newDomain.value) return;
  const _newDomain = newDomain.value;
  newDomain.value = '';
  if (project.value.domains.some(domain => domain === _newDomain)) return;

  await $fetch(`/api/projects/${project.value.id}`, {
    method: 'PATCH',
    body: {
      domains: [...project.value.domains, _newDomain],
    },
  });

  toast.add({
    title: 'Domains updated',
    description: `The domains for the project "${project.value.name}" were updated.`,
    color: 'success',
  });

  await refreshProject();
}

async function saveCron() {
  if (!project.value) {
    throw new Error('Project not found');
  }

  await $fetch(`/api/projects/${project.value.id}`, {
    method: 'PATCH',
    body: {
      cron: project.value.cron,
    },
  });

  toast.add({
    title: 'Cron updated',
    description: `The cron for the project "${project.value.name}" was updated.`,
    color: 'success',
  });

  await refreshProject();
}

async function deleteProject() {
  if (!project.value) {
    throw new Error('Project not found');
  }

  if (prompt('Are you sure you want to delete this project? Type "DELETE" to confirm.') !== 'DELETE') return;

  await $fetch(`/api/projects/${project.value.id}`, { method: 'DELETE' });

  toast.add({
    title: 'Project deleted',
    description: `The project "${project.value.name}" was deleted.`,
  });

  await router.push(`/`);
}
</script>
