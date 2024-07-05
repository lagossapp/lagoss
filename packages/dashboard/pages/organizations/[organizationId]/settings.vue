<template>
  <div class="flex w-full flex-col">
    <div class="bg mx-auto flex w-full max-w-4xl flex-col">
      <div class="flex items-start gap-2">
        <div>
          <h1 class="text-3xl font-bold">{{ organization?.name }} - Settings</h1>
          <p class="text-gray-500">{{ organization?.description }}</p>
        </div>
      </div>

      <p class="mt-2 flex gap-1">
        <span class="font-bold text-gray-500">{{ projects?.length }}</span>
        <span class="text-gray-500">projects</span>
      </p>

      <span>TODO:</span>
      <ul>
        <li>general: name, description, delete</li>
        <li>members</li>
        <li>billing & usage</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const organizationId = computed(() => route.params.organizationId as string);

const { data: organization } = useFetch(() => `/api/organizations/${organizationId.value}`);

const { data: projects } = useFetch(`/api/organizations/${organizationId.value}/projects`);
</script>
