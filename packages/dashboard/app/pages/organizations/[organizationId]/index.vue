<template>
  <div class="flex w-full flex-col">
    <div class="bg mx-auto flex w-full max-w-4xl flex-col">
      <div class="flex items-start gap-2">
        <div class="mr-auto">
          <h1 class="text-3xl font-bold">{{ organization?.name }}</h1>
          <p class="text-neutral-500">{{ organization?.description }}</p>
        </div>

        <!-- <UButton
          icon="i-ion-ios-play"
          label="New playground"
          color="blue"
          class="ml-auto"
          :loading="creatingApp === 'playground'"
          :disabled="creatingApp === 'normal'"
          @click="createApp(true)"
        /> -->

        <UButton
          icon="i-ion-plus"
          label="New app"
          :loading="creatingApp === 'normal'"
          :disabled="creatingApp === 'playground'"
          @click="createApp(false)"
        />
      </div>

      <p class="mt-2 flex gap-1">
        <span class="font-bold text-neutral-500">{{ apps?.length }}</span>
        <span class="text-neutral-500">apps</span>
      </p>

      <UContainer
        v-if="apps?.length === 0"
        class="mt-4 w-full rounded-sm border border-neutral-200 py-16 text-center hover:shadow-sm"
      >
        <p class="text-neutral-500">No apps yet! Please create a playground or a new app.</p>
        <!-- <a href="https://docs.lagoss.io" target="_blank" class="text-blue-500">
          Quickstart guide!
        </a> -->
      </UContainer>

      <div class="mt-4 grid grid-cols-2 gap-4">
        <router-link
          v-for="app in apps"
          :key="app.id"
          :to="`/organizations/${app.organizationId}/apps/${app.name}`"
          class="w-full"
        >
          <Card class="relative flex w-full items-center justify-between" clickable>
            <div>
              <p>{{ app.name }}</p>
              <p class="text-xs text-neutral-500">{{ dayjs().to(app.updatedAt) }}</p>
            </div>
            <UBadge class="absolute top-4 right-4" color="primary" variant="soft">{{
              app.playground ? 'Playground' : 'App'
            }}</UBadge>
          </Card>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~~/lib/dayjs';

const route = useRoute();
const router = useRouter();
const organizationId = computed(() => route.params.organizationId as string);

const { data: organization } = await useFetch(() => `/api/organizations/${organizationId.value}`);

const { data: apps } = await useFetch(() => `/api/organizations/${organizationId.value}/apps`);

const creatingApp = ref<'playground' | 'normal'>();
async function createApp(playground = false) {
  creatingApp.value = playground ? 'playground' : 'normal';

  try {
    const app = await $fetch(`/api/organizations/${organizationId.value}/apps`, {
      method: 'POST',
      body: {
        playground,
      },
    });

    if (!app) {
      throw new Error('Failed to create app');
    }

    await router.push(`/organizations/${app.organizationId}/apps/${app.name}`);
  } finally {
    creatingApp.value = undefined;
  }
}
</script>
