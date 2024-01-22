<template>
  <div v-if="project" class="flex h-screen w-screen">
    <div class="w-1/2">
      <header class="flex h-16 items-center justify-between border-b border-gray-200 px-4 py-2">
        <div class="flex items-center gap-4">
          <router-link to="/">
            <img src="/icon-black.png" alt="Icon" class="w-6 dark:hidden" />
            <img src="/icon-white.png" alt="Dark icon" class="hidden w-6 dark:block" />
          </router-link>

          <router-link :to="`/projects/${project.name}`" class="font-bold hover:underline" title="Back to project">{{
            project.name
          }}</router-link>
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
        <Editor v-model="code" class="flex-grow" />
      </div>

      <div class="relative flex h-44 flex-shrink-0 flex-col border-t border-gray-200">
        <div class="flex h-10 items-center justify-between px-5">
          <div class="flex h-full items-center gap-1 text-sm text-gray-600">
            <UIcon name="document" />
            Logs
          </div>
          <button
            type="button"
            class="relative left-3 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-gray-400/80 hover:text-gray-800"
          >
            <UIcon name="down" />
          </button>
        </div>

        <ProjectLogs :project="project" />
      </div>
    </div>
    <div class="relative h-full w-1/2 border-l border-gray-300/70">
      <header
        class="flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-2 dark:bg-zinc-900"
      >
        <UInput :model-value="url || ''" size="lg" class="flex-grow" disabled />

        <a v-if="url" :href="url" rel="noopener noreferrer" target="_blank">
          <UButton label="Open" size="lg" color="white" />
        </a>
        <UButton icon="i-ion-ios-refresh" size="lg" color="white" @click="reloadIframe" />
      </header>

      <iframe
        v-if="url"
        ref="iframeEl"
        class="w-full flex-grow border-0"
        style="height: calc(100vh - 4rem)"
        sandbox="allow-forms allow-modals allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
        :src="url"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'borderless',
});

const iframeEl = ref<HTMLIFrameElement>();

const projectsStore = useProjectsStore();
const project = computed(() => projectsStore.project);

const code = ref('');
const changed = ref(false);
watch(code, () => {
  changed.value = true;
});

const { data: codeFromDB } = await useFetch(() => `/api/projects/${project.value.name}/code`);
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

  if (!project.value) return;

  try {
    // create deployment
    const deployment = await $fetch(`/api/projects/${project.value.name}/deployments`, {
      method: 'POST',
      body: {
        projectId: project.value.id,
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
    await $fetch(`/api/projects/${project.value.name}/deployments/${deployment.deploymentId}/deploy`, {
      method: 'POST',
      body: { isProduction: true },
    });

    reloadIframe();

    changed.value = false;
  } catch (e) {
    throw e;
  } finally {
    isDeploying.value = false;
  }
}

const url = computed(() => project.value && getFullCurrentDomain({ name: project.value.name }));
</script>
