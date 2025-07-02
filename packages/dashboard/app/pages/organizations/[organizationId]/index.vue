<template>
  <div class="flex w-full flex-col">
    <div class="bg mx-auto flex w-full max-w-4xl flex-col">
      <div class="flex items-start gap-2">
        <div class="mr-auto">
          <h1 class="text-3xl font-bold">{{ organization?.name }}</h1>
          <p class="text-gray-500">{{ organization?.description }}</p>
        </div>

        <!-- <UButton
          icon="i-ion-ios-play"
          label="New playground"
          color="blue"
          class="ml-auto"
          :loading="creatingProject === 'playground'"
          :disabled="creatingProject === 'normal'"
          @click="createProject(true)"
        /> -->

        <UButton
          icon="i-ion-plus"
          label="New project"
          :loading="creatingProject === 'normal'"
          :disabled="creatingProject === 'playground'"
          @click="createProject(false)"
        />
      </div>

      <p class="mt-2 flex gap-1">
        <span class="font-bold text-gray-500">{{ projects?.length }}</span>
        <span class="text-gray-500">projects</span>
      </p>

      <UContainer
        v-if="projects?.length === 0"
        class="mt-4 w-full rounded border border-gray-200 py-16 text-center hover:shadow"
      >
        <p class="text-gray-500">No projects yet! Please create a playground or a new project.</p>
        <!-- <a href="https://docs.lagoss.io" target="_blank" class="text-blue-500">
          Quickstart guide!
        </a> -->
      </UContainer>

      <div class="mt-4 grid grid-cols-2 gap-4">
        <router-link
          v-for="project in projects"
          :key="project.id"
          :to="`/organizations/${project.organizationId}/projects/${project.name}`"
          class="w-full"
        >
          <Card
            class="relative flex w-full cursor-pointer items-center justify-between hover:border-gray-500 hover:dark:border-gray-200"
          >
            <div>
              <p>{{ project.name }}</p>
              <p class="text-xs text-gray-500">{{ dayjs().to(project.updatedAt) }}</p>
            </div>
            <UBadge class="absolute right-2 top-2" color="primary" variant="soft">{{
              project.playground ? 'Playground' : 'Project'
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

const { data: projects } = await useFetch(() => `/api/organizations/${organizationId.value}/projects`);

const creatingProject = ref<'playground' | 'normal'>();
async function createProject(playground = false) {
  creatingProject.value = playground ? 'playground' : 'normal';

  try {
    const project = await $fetch(`/api/organizations/${organizationId.value}/projects`, {
      method: 'POST',
      body: {
        playground,
      },
    });

    if (!project) {
      throw new Error('Failed to create project');
    }

    await router.push(`/organizations/${project.organizationId}/projects/${project.name}`);
  } catch (error) {
    throw error;
  } finally {
    creatingProject.value = undefined;
  }
}
</script>
