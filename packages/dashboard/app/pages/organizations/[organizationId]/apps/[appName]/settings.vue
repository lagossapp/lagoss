<template>
  <div v-if="app" class="w-full">
    <AppHeader :app="app" />

    <div class="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <Card>
        <form @submit.prevent="saveName" class="flex flex-col items-start gap-4">
          <h2 class="text-xl">Name</h2>

          <p class="text-neutral-500">
            Change the name of this app. Note that changing the name also changes the default domain.
          </p>

          <UFormField label="Name" required>
            <UFieldGroup size="md" orientation="horizontal">
              <UInput v-if="app" v-model="app.name" placeholder="your-name" size="md" />
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
            <div v-if="app" v-for="(envVariable, i) in app.envVariables" class="flex w-full gap-2">
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
          <span>{{ app.name }}.{{ $config.public.root.domain }}</span>
          <span class="text-neutral-500">Default domain</span>
        </div>

        <div v-for="domain in app.domains" :key="domain" class="flex items-center gap-2">
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
              v-if="app"
              :model-value="app.cron || ''"
              placeholder="* */12 * * *"
              size="md"
              @update:model-value="app.cron = $event"
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
          Delete the app "{{ app?.name }}.{{ $config.public.root.domain }}" and all of its deployments and domains. This
          action is not reversible, so continue with extreme caution.
        </p>

        <div class="border-error flex w-full border-t pt-2">
          <UButton type="submit" label="Delete" size="md" color="error" class="ml-auto" @click="deleteApp" />
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const toast = useToast();

const { app: dbApp, refreshApp } = useApp();

const app = ref<typeof dbApp.value>();
watch(
  dbApp,
  () => {
    app.value = dbApp.value;
  },
  { immediate: true },
);

function addEnvVariable() {
  app.value?.envVariables.push({ key: '', value: '' });
}

function removeEnvVariable(index: number) {
  if (!app.value) return;
  app.value = {
    ...app.value,
    envVariables: app.value.envVariables.filter((_, i) => i !== index),
  };
}

function addPastedEnvVariables(event: ClipboardEvent) {
  if (!app.value) {
    throw new Error('App not found');
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

    app.value = {
      ...app.value,
      envVariables: app.value.envVariables.filter(({ key, value }) => !pastedEnv[key] && key && value),
    };
    app.value?.envVariables?.push(...Object.entries(pastedEnv).map(([key, value]) => ({ key, value })));
  }
}

async function removeDomain(domain: string) {
  if (!app.value) {
    throw new Error('App not found');
  }
  if (!confirm(`Are you sure you want to remove the domain "${domain}"?`)) return;

  await $fetch(`/api/apps/${app.value.id}`, {
    method: 'PATCH',
    body: {
      domains: app.value.domains?.filter(_domain => _domain !== domain),
    },
  });

  toast.add({
    title: 'Domain removed',
    description: `The domain "${domain}" was removed from the app "${app.value.name}".`,
    color: 'success',
  });

  await refreshApp();
}

async function saveName() {
  if (!app.value) {
    throw new Error('App not found');
  }

  await $fetch(`/api/apps/${app.value.id}`, {
    method: 'PATCH',
    body: {
      name: app.value.name,
    },
  });

  toast.add({
    title: 'App updated',
    description: `The app "${app.value.name}" was updated.`,
    color: 'success',
  });

  await router.push(`/organizations/${app.value.organizationId}/apps/${app.value.name}`);

  await refreshApp();
}

async function saveEnvironmentVariables() {
  if (!app.value) {
    throw new Error('App not found');
  }

  await $fetch(`/api/apps/${app.value.id}`, {
    method: 'PATCH',
    body: {
      envVariables: app.value.envVariables.filter(({ key, value }) => key && value),
    },
  });

  toast.add({
    title: 'Environment variables updated',
    description: `The environment variables for the app "${app.value.name}" were updated.`,
    color: 'success',
  });

  await refreshApp();
}

const newDomain = ref('');
async function addDomain() {
  if (!app.value) {
    throw new Error('App not found');
  }
  if (!newDomain.value) return;
  const _newDomain = newDomain.value;
  newDomain.value = '';
  if (app.value.domains.some(domain => domain === _newDomain)) return;

  await $fetch(`/api/apps/${app.value.id}`, {
    method: 'PATCH',
    body: {
      domains: [...app.value.domains, _newDomain],
    },
  });

  toast.add({
    title: 'Domains updated',
    description: `The domains for the app "${app.value.name}" were updated.`,
    color: 'success',
  });

  await refreshApp();
}

async function saveCron() {
  if (!app.value) {
    throw new Error('App not found');
  }

  await $fetch(`/api/apps/${app.value.id}`, {
    method: 'PATCH',
    body: {
      cron: app.value.cron,
    },
  });

  toast.add({
    title: 'Cron updated',
    description: `The cron for the app "${app.value.name}" was updated.`,
    color: 'success',
  });

  await refreshApp();
}

async function deleteApp() {
  if (!app.value) {
    throw new Error('App not found');
  }

  if (prompt('Are you sure you want to delete this app? Type "DELETE" to confirm.') !== 'DELETE') return;

  await $fetch(`/api/apps/${app.value.id}`, { method: 'DELETE' });

  toast.add({
    title: 'App deleted',
    description: `The app "${app.value.name}" was deleted.`,
  });

  await router.push(`/`);
}
</script>
