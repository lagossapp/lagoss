<template>
  <UButton :to="to" size="md" variant="ghost">
    <span
      class="border-b"
      :class="{
        'border-neutral-800 dark:border-neutral-400': $route.path === to,
        'border-transparent': $route.path !== to,
      }"
      >{{ label }}</span
    >
  </UButton>
</template>

<script setup lang="ts">
defineProps<{
  to: string;
  label: string;
}>();
</script>
