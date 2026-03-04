<template>
  <!-- Sidebar variant: pill active state -->
  <router-link
    v-if="variant === 'sidebar'"
    :to="to"
    :aria-current="isActive ? 'page' : undefined"
    class="group flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1"
    :class="
      isActive
        ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-100'
    "
  >
    <slot />
  </router-link>

  <!-- Underline variant: used for in-page tab navigation -->
  <router-link
    v-else
    :to="to"
    :aria-current="isActive ? 'page' : undefined"
    class="relative flex h-9 items-center px-1 text-sm font-medium outline-none transition-colors focus-visible:rounded focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
    :class="
      isActive
        ? 'text-gray-900 dark:text-white'
        : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
    "
  >
    <slot />
    <span
      class="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-all duration-200"
      :class="isActive ? 'bg-teal-500' : 'bg-transparent'"
      aria-hidden="true"
    />
  </router-link>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string;
  exact?: boolean;
  variant?: 'underline' | 'sidebar';
}>();

const route = useRoute();

const isActive = computed(() => {
  if (props.exact) {
    return route.path === props.to;
  }
  return route.path.startsWith(props.to);
});
</script>
