<template>
  <div class="flex flex-col items-center justify-center gap-8 text-center">
    <img src="/logo-black.png" alt="Logo" class="w-32 dark:hidden" />
    <img src="/logo-white.png" alt="Dark logo" class="hidden w-32 dark:block" />

    <h1 class="text-3xl font-semibold tracking-tight">Sign In to Your Account</h1>
  </div>
  <div class="grid gap-6">
    <div class="flex flex-col gap-2">
      <button
        class="ring-offset-background focus-visible:ring-ring border-input hover:bg-accent hover:text-accent-foreground bg-background inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        @click="login"
      >
        <UIcon name="i-ion-logo-github" class="mr-2 h-4 w-4" />
        Login with Github
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { login } = await useAuth();

definePageMeta({ layout: 'auth' });
</script>
