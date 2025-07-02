<template>
  <div ref="editorEl" />
</template>

<script setup lang="ts">
import type * as monaco from 'monaco-editor';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: 'update:model-value', code: string): void;
}>();

const modelValue = toRef(props, 'modelValue');

watch(modelValue, _modelValue => {
  if (editor.value && editor.value.getValue() !== _modelValue) {
    editor.value.setValue(_modelValue);
  }
});

const editorEl = shallowRef<HTMLDivElement>();
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>();
onMounted(() => {
  nextTick(async () => {
    if (import.meta.client && editorEl.value) {
      const { editor: monacoEditor } = await import('monaco-editor/esm/vs/editor/editor.api');

      editor.value = monacoEditor.create(editorEl.value, {
        automaticLayout: true,
        language: 'typescript',
        bracketPairColorization: {
          enabled: true,
        },
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        overviewRulerBorder: false,
        theme: 'vs-dark',
      });
      editor.value.onDidChangeModelContent(() => {
        if (editor.value) {
          emit('update:model-value', editor.value.getValue());
        }
      });
      editor.value.setValue(modelValue.value);
      // monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      //     noSemanticValidation: false,
      //     noSyntaxValidation: false,
      //   });

      //   monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      //     lib: ['esnext', 'dom', 'dom.iterable'],
      //     allowNonTsExtensions: true,
      //   });
    }
  });
});
</script>
