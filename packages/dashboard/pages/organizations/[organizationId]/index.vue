<template>
  <div class="flex w-full flex-col">
    <div class="bg mx-auto flex w-full max-w-4xl flex-col">
      <h1 class="text-3xl font-bold">{{ organization?.name }}</h1>
      <p class="mt-2 flex gap-1">
        <span class="font-bold text-gray-600">{{ projects?.length }}</span>
        <span class="text-gray-500">projects</span>
      </p>

      <div class="mt-4 flex flex-row flex-wrap gap-4">
        <router-link
          v-for="project in projects"
          :key="project.id"
          :to="`/projects/${project.name}`"
          class="w-full max-w-sm"
        >
          <Card class="flex w-full cursor-pointer items-center justify-between hover:border-gray-500">
            <div>
              <p>{{ project.name }}</p>
              <p class="text-gray-500">{{ dayjs().to(project.updatedAt) }}</p>
            </div>
          </Card>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~/lib/dayjs';

const route = useRoute();
const organizationId = computed(() => route.params.organizationId as string);

const { data: organization } = useFetch(() => `/api/organizations/${organizationId.value}`);

const { data: projects } = useFetch(`/api/organizations/${organizationId.value}/projects`);
</script>
