<template>
  <UButton :to="to" size="md" variant="ghost">
    <span
      class="border-b"
      :class="{
        'border-gray-800 dark:border-gray-400': $route.path === to,
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
