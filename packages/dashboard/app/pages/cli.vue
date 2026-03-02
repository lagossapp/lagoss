<template>
  <div class="flex w-full flex-col items-center justify-center min-h-[80vh] px-4 py-12">
    <div class="mx-auto w-full max-w-2xl">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4"
        >
          <UIcon name="i-ion-terminal" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1
          class="text-4xl font-bold bg-linear-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-3"
        >
          CLI Authentication
        </h1>
      </div>

      <!-- Main Card -->
      <UCard class="shadow-xl">
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon name="i-ion-shield-checkmark" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 class="text-xl font-semibold">Create token and connect your CLI to Lagoss</h2>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Warning Section -->
          <div
            class="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
          >
            <UIcon name="i-ion-warning" class="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div class="text-sm">
              <p class="font-medium text-amber-900 dark:text-amber-100 mb-1">Security Notice</p>
              <p class="text-amber-700 dark:text-amber-300">
                Only proceed if you initiated this request from your local CLI on a trusted device.
              </p>
            </div>
          </div>

          <!-- What Happens Next -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
              What happens next
            </h3>
            <div class="space-y-2">
              <div class="flex items-start gap-3">
                <div
                  class="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 shrink-0"
                >
                  <span class="text-xs font-bold text-primary-600 dark:text-primary-400">1</span>
                </div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400 pt-0.5">
                  A personal access token will be created for your account
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div
                  class="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 shrink-0"
                >
                  <span class="text-xs font-bold text-primary-600 dark:text-primary-400">2</span>
                </div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400 pt-0.5">The token will be saved to your CLI</p>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center gap-4">
            <UButton
              icon="i-ion-log-in"
              label="Authorize CLI Access"
              size="lg"
              class="shadow-md hover:shadow-lg transition-shadow mx-auto"
              @click="createToken"
            />
          </div>
        </template>
      </UCard>
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
