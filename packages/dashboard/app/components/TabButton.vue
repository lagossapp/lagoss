<template>
  <NavLink :to="to" :exact="exact" class="-mb-px">{{ label }}</NavLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string;
  label: string;
  exact?: boolean;
}>();
</script>
