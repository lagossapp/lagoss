<template>
  <div class="flex w-full flex-col">
    <div class="mx-auto flex w-full max-w-4xl flex-col items-center">
      <h1 class="text-3xl font-bold">🔒 Login to your CLI</h1>

      <div class="mt-8 text-neutral-800 dark:text-neutral-200">
        <p>You are trying to login to your CLI.</p>
        <p>Only proceed if you intend to use the CLI on this device.</p>
      </div>

      <div class="mt-4">
        <UButton icon="i-ion-log-in" label="Login to CLI" @click="createToken" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const toast = useToast();

async function createToken() {
  const callback = route.query.callback;
  if (typeof callback !== 'string') {
    toast.add({
      title: 'Error',
      description: 'Invalid callback URL',
      icon: 'i-ion-alert-circle-outline',
      color: 'error',
    });
    return;
  }

  // SECURITY: Check to avoid token captures
  // TODO: improve token flow
  const callbackUrl = new URL(callback);
  if (callbackUrl.hostname !== 'localhost') {
    toast.add({
      title: 'Error',
      description: 'Invalid callback URL',
      icon: 'i-ion-alert-circle-outline',
      color: 'error',
    });
    return;
  }

  const token = await $fetch('/api/user/tokens', {
    method: 'POST',
  });

  toast.add({
    title: 'Token created successfully!',
    description: 'Redirecting ...',
    color: 'success',
  });

  await new Promise(r => setTimeout(r, 300));

  callbackUrl.searchParams.set('token', token.value);
  window.location.href = callbackUrl.toString();
}
</script>
