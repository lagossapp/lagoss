<template>
  <div v-if="project" class="flex h-screen w-screen">
    <div class="w-1/2">
      <header class="flex h-16 items-center justify-between border-b border-gray-200 px-4 py-2">
        <div class="flex items-center gap-4">
          <router-link to="/">
            <img src="/icon-black.png" alt="Icon" class="w-6 dark:hidden" />
            <img src="/icon-white.png" alt="Dark icon" class="hidden w-6 dark:block" />
          </router-link>

          <router-link :to="`/projects/${projectName}`" class="font-bold hover:underline" title="Back to project">{{
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
        <ClientOnly>
          <MonacoEditor
            v-model="code"
            @update:model-value="updateCode"
            lang="typescript"
            :options="options"
            class="flex-grow"
          >
            <span>Loading ...</span>
          </MonacoEditor>
        </ClientOnly>
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
      <header class="flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-2">
        <UInput :model-value="url || ''" size="lg" class="flex-grow" disabled />

        <UButton label="Open" size="lg" color="white" />
      </header>

      <iframe
        v-if="url"
        class="w-full flex-grow border-0"
        style="height: calc(100vh - 4rem)"
        sandbox="allow-forms allow-modals allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
        :src="url"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type * as monaco from 'monaco-editor';

const route = useRoute();
const { projectName } = route.params;

definePageMeta({
  layout: 'borderless',
});

const { data: project } = useFetch(`/api/projects/${projectName}`);

const options: monaco.editor.IEditorConstructionOptions = {
  bracketPairColorization: {
    enabled: true,
  },
  automaticLayout: true,
  minimap: {
    enabled: false,
  },
  fontSize: 14,
  overviewRulerBorder: false,

  // if (monaco) {
  //     monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  //       noSemanticValidation: false,
  //       noSyntaxValidation: false,
  //     });

  //     monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  //       lib: ['esnext', 'dom', 'dom.iterable'],
  //       allowNonTsExtensions: true,
  //     });
  //   }
};

const changed = ref(false);
const code = ref('');
function updateCode() {
  changed.value = true;
}

const { data: _code } = useFetch(`/api/projects/${projectName}/code`);
watch(_code, __code => {
  if (__code?.code) {
    code.value = __code.code;
    nextTick(() => {
      changed.value = false;
    });
  }
});

const isDeploying = ref(false);
async function saveAndDeploy() {
  isDeploying.value = true;

  // TODO: save code

  changed.value = false;
  isDeploying.value = false;
}

// TODO: dynamic base domain
const url = computed(() => project.value && getFullCurrentDomain({ name: project.value.name }));
</script>
