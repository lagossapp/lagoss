<template>
  <div
    class="ring-accented bg-default w-full rounded-md p-4 ring ring-inset"
    :class="{
      'hover:bg-elevated cursor-pointer': clickable,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  clickable?: boolean;
}>();
</script>
