<template>
  <div v-if="app" class="flex h-screen w-screen">
    <div class="w-1/2">
      <header class="flex h-16 items-center justify-between border-b border-neutral-200 px-4 py-2">
        <div class="flex items-center gap-4">
          <router-link to="/">
            <img src="/icon-black.png" alt="Icon" class="w-6 dark:hidden" />
            <img src="/icon-white.png" alt="Dark icon" class="hidden w-6 dark:block" />
          </router-link>

          <router-link
            :to="`/organizations/${app.organizationId}/apps/${app.name}`"
            class="font-bold hover:underline"
            title="Back to app"
            >{{ app.name }}</router-link
          >
        </div>

        <UButton
          icon="i-ion-ios-play"
          label="Save & Deploy"
          size="lg"
          :color="changed ? 'blue' : 'white'"
          :disabled="!changed"
          :loading="isDeploying"
          @click="saveAndDeploy"
        />
      </header>

      <div class="relative flex" style="height: calc(100vh - 15rem)">
        <Editor v-model="code" class="grow" />
      </div>

      <div class="relative flex h-44 shrink-0 flex-col border-t border-neutral-200">
        <div class="flex h-10 items-center justify-between px-5">
          <div class="flex h-full items-center gap-1 text-sm text-neutral-500">
            <UIcon name="document" />
            Logs
          </div>
          <button
            type="button"
            class="relative left-3 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-neutral-400/80 hover:text-neutral-800"
          >
            <UIcon name="down" />
          </button>
        </div>

        <AppLogs :app="app" />
      </div>
    </div>
    <div class="relative h-full w-1/2 border-l border-neutral-300/70">
      <header
        class="flex h-16 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 py-2 dark:bg-zinc-900"
      >
        <UInput :model-value="url || ''" size="lg" class="grow" disabled />

        <a v-if="url" :href="url" rel="noopener noreferrer" target="_blank">
          <UButton label="Open" size="lg" color="neutral" variant="outline" />
        </a>
        <UButton icon="i-ion-ios-refresh" size="lg" color="neutral" variant="outline" @click="reloadIframe" />
      </header>

      <iframe
        v-if="url"
        ref="iframeEl"
        class="w-full grow border-0"
        style="height: calc(100vh - 4rem)"
        sandbox="allow-forms allow-modals allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
        :src="url"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from '~/composables/useInjectProvide';

definePageMeta({
  layout: 'borderless',
});

const iframeEl = ref<HTMLIFrameElement>();

const app = inject('app');

const code = ref('');
const changed = ref(false);
watch(code, () => {
  changed.value = true;
});

const { data: codeFromDB } = await useFetch(() => `/api/apps/${app.value.id}/code`);
watch(
  codeFromDB,
  _code => {
    if (!_code) return;

    code.value = _code.code;
    nextTick(() => {
      changed.value = false;
    });
  },
  { immediate: true },
);

function reloadIframe() {
  if (iframeEl.value) {
    iframeEl.value.src += '';
  }
}

const isDeploying = ref(false);
async function saveAndDeploy() {
  isDeploying.value = true;

  if (!app.value) return;

  try {
    // create deployment
    const deployment = await $fetch(`/api/apps/${app.value.id}/deployments`, {
      method: 'POST',
      body: {
        appId: app.value.id,
        functionSize: new TextEncoder().encode(code.value).length,
        assets: [],
      },
    });
    if (iframeEl.value) {
      iframeEl.value.src += '';
    }

    // upload code
    await $fetch(deployment.codeUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/javascript',
      },
      body: code.value,
    });

    // deploy
    await $fetch(`/api/apps/${app.value.id}/deployments/${deployment.deploymentId}/deploy`, {
      method: 'POST',
      body: { isProduction: true },
    });

    reloadIframe();

    changed.value = false;
  } finally {
    isDeploying.value = false;
  }
}

const url = computed(() => app.value && getFullCurrentDomain({ name: app.value.name }));
</script>
