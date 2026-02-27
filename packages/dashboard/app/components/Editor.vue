<template>
  <div ref="editorEl" />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: 'update:model-value', code: string): void;
}>();

// TODO: add editor
</script>
