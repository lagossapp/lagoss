<template>
  <div class="flex w-full flex-col">
    <div class="bg mx-auto flex w-full max-w-4xl flex-col">
      <h1 class="text-3xl font-bold">Projects</h1>
      <p class="mt-2 flex gap-1">
        <span class="font-bold text-gray-600">{{ projects?.length }}</span>
        <span class="text-gray-500">projects</span>
      </p>

      <div class="mt-4 flex flex-row flex-wrap gap-4">
        <router-link
          :to="`/projects/${project.name}`"
          v-for="project in projects"
          :key="project.id"
          class="flex w-full max-w-sm cursor-pointer items-center justify-between rounded-md border border-gray-300 p-4 hover:border-gray-500"
        >
          <div>
            <p>{{ project.name }}</p>
            <p>{{ dayjs().to(project.updatedAt) }}</p>
          </div>

          <router-link :to="`/projects/${project.name}`">
            <UButton label="View" size="xs" color="white" />
          </router-link>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from '~/lib/dayjs';

const { data: projects } = useFetch('/api/projects');
</script>
