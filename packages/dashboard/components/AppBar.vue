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
                color="white"
                class="w-full justify-between"
                :trailing-icon="organization.id === user?.currentOrganizationId ? 'i-heroicons-check-20-solid' : ''"
                @click="selectOrganization(organization.id)"
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
          <div class="min-w-md flex w-full flex-col p-4">
            <UAvatar :src="user?.image || ''" alt="User avatar" size="xl" :initials="user?.name" />
            <p>{{ user.name }}</p>

            <UButton label="Settings" size="xs" color="white" class="w-full" />
            <UButton label="Logout" size="xs" color="white" class="w-full" @click="logout" />
          </div>
        </template>
      </UPopover>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, logout, updateAuthSession } = await useAuth();

const router = useRouter();

const { data: selectedOrganization } = useFetch(() => `/api/organizations/${user.value?.currentOrganizationId}`, {
  watch: [() => user.value?.currentOrganizationId],
});

const { data: organizations } = useFetch('/api/organizations');

const route = useRoute();
const links = computed(() => {
  const _links: { id: string; label: string; to?: string }[] = [
    // {
    //   label: 'Home',
    //   to: '/',
    // },
  ];

  _links.push({
    id: 'org',
    label: `${selectedOrganization.value?.name}`,
    to: `/organizations/${selectedOrganization.value?.id}`,
  });

  if (route.path.startsWith('/projects')) {
    _links.push({
      id: 'project',
      label: `${route.params.projectName}`,
      to: `/projects/${route.params.projectName}`,
    });
  }

  return _links;
});

async function selectOrganization(organizationId: string) {
  if (organizationId !== user.value?.currentOrganizationId) {
    await $fetch(`/api/user`, {
      method: 'PATCH',
      body: {
        currentOrganizationId: organizationId,
      },
    });

    await updateAuthSession();
  }

  await router.push(`/organizations/${organizationId}`);
}
</script>
