<template>
  <header
    class="border-b-1 sticky top-0 z-40 flex w-full items-center gap-4 border-transparent px-4 py-4 backdrop-blur"
  >
    <router-link to="/">
      <img src="/icon-black.png" alt="Icon" class="w-6 dark:hidden" />
      <img src="/icon-white.png" alt="Dark icon" class="hidden w-6 dark:block" />
    </router-link>

    <UBreadcrumb :links="links">
      <template #default="{ link, isActive, index }">
        <UBadge :color="isActive ? 'primary' : 'gray'" class="rounded-full">{{ link.label }}</UBadge>
        <UPopover v-if="link.id === 'org'">
          <UButton color="white" icon="i-heroicons-chevron-down-20-solid" size="xs" />

          <template #panel>
            <div class="flex flex-col gap-2 p-2">
              <UButton
                v-for="organization in organizations"
                :key="organization.id"
                :label="organization.name"
                size="md"
                :to="`/organizations/${organization.id}`"
                color="white"
                class="w-full justify-between"
                :trailing-icon="organization.id === $route.params.organizationId ? 'i-heroicons-check-20-solid' : ''"
              />
              <UButton
                label="Create organization"
                icon="i-heroicons-plus"
                size="md"
                color="white"
                class="w-full"
                to="/organizations/create"
              />
            </div>
          </template>
        </UPopover>
      </template>
    </UBreadcrumb>

    <div class="ml-auto flex items-center gap-2">
      <a href="https://docs.lagon.app" rel="noopener noreferrer" target="_blank">
        <UButton label="Docs" size="xs" color="white" />
      </a>

      <UPopover v-if="user" class="flex items-center">
        <UAvatar :src="user?.image || ''" alt="User avatar" size="sm" :initials="user?.name" />

        <template #panel>
          <div class="flex w-48 flex-col items-center p-4">
            <UAvatar :src="user?.image || ''" alt="User avatar" size="xl" :initials="user?.name" />
            <p class="mb-8">{{ user.name }}</p>

            <UButton label="Settings" size="xs" color="white" class="mb-2 w-full" />
            <UButton label="Logout" size="xs" color="white" class="w-full" @click="logout" />
          </div>
        </template>
      </UPopover>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, logout } = await useAuth();

const route = useRoute();
const { data: selectedOrganization } = useFetch(() => `/api/organizations/${route.params.organizationId}`, {
  watch: [() => route],
});

const { data: organizations } = useFetch('/api/organizations');

const links = computed(() => {
  const _links: { id: string; label: string; to?: string }[] = [
    // {
    //   label: 'Home',
    //   to: '/',
    // },
  ];

  if (selectedOrganization.value) {
    _links.push({
      id: 'org',
      label: `${selectedOrganization.value?.name}`,
      to: `/organizations/${selectedOrganization.value?.id}`,
    });
  }

  if (route.path.startsWith('/projects')) {
    _links.push({
      id: 'project',
      label: `${route.params.projectName}`,
      to: `/projects/${route.params.projectName}`,
    });
  }

  return _links;
});
</script>
