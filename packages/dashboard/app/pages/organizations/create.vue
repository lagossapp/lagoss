<template>
  <div class="mx-auto w-full max-w-lg">
    <header class="mb-8">
      <h1 class="text-2xl font-semibold">Create organization</h1>
      <p class="mt-1 text-sm text-neutral-500">Organizations group your apps and let you collaborate with others.</p>
    </header>

    <form @submit.prevent="submit" class="flex flex-col gap-5">
      <UFormField label="Name" required :error="errors.name">
        <UInput
          v-model="form.name"
          placeholder="My Organization"
          size="md"
          class="w-full"
          autofocus
          :disabled="loading"
          aria-label="Organization name"
        />
      </UFormField>

      <UFormField label="Description" :error="errors.description">
        <UInput
          v-model="form.description"
          placeholder="A brief description (optional)"
          size="md"
          class="w-full"
          :disabled="loading"
          aria-label="Organization description"
        />
      </UFormField>

      <div class="flex items-center justify-end gap-3 pt-2">
        <UButton
          type="button"
          label="Cancel"
          size="md"
          color="neutral"
          variant="ghost"
          :disabled="loading"
          @click="router.back()"
        />
        <UButton type="submit" label="Create organization" size="md" color="primary" :loading="loading" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const toast = useToast();

const form = reactive({
  name: '',
  description: '',
});

const errors = reactive({
  name: '',
  description: '',
});

const loading = ref(false);

function validate() {
  errors.name = '';
  errors.description = '';
  let valid = true;

  if (!form.name.trim()) {
    errors.name = 'Name is required.';
    valid = false;
  } else if (form.name.trim().length > 64) {
    errors.name = 'Name must be 64 characters or fewer.';
    valid = false;
  }

  if (form.description.length > 256) {
    errors.description = 'Description must be 256 characters or fewer.';
    valid = false;
  }

  return valid;
}

async function submit() {
  if (!validate()) return;

  loading.value = true;
  try {
    const org = await $fetch('/api/organizations', {
      method: 'POST',
      body: {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      },
    });

    toast.add({
      title: 'Organization created',
      description: `"${org.name}" is ready.`,
      color: 'success',
    });

    await router.push(`/organizations/${org.id}`);
  } catch (error: any) {
    const message = error?.data?.message || error?.message || 'Something went wrong.';
    toast.add({
      title: 'Failed to create organization',
      description: message,
      color: 'error',
    });
  } finally {
    loading.value = false;
  }
}
</script>
