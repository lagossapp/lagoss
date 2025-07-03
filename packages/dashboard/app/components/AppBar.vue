<template>
  <header
    class="sticky top-0 z-40 flex w-full items-center gap-4 border-b border-transparent px-4 py-4 backdrop-blur-sm"
  >
    <router-link to="/">
      <img src="/icon-black.png" alt="Icon" class="w-6 dark:hidden" />
      <img src="/icon-white.png" alt="Dark icon" class="hidden w-6 dark:block" />
    </router-link>

    <UPopover v-if="selectedOrganization" v-model:open="orgSelectOpen">
      <UButton color="neutral" variant="outline" class="w-48">
        <UAvatar :alt="selectedOrganization?.name" size="xs" />
        <span>{{ selectedOrganization?.name }}</span>
        <UIcon
          name="i-heroicons-chevron-down-20-solid"
          class="ms-auto h-4 w-4 transform transition-transform"
          :class="{
            'rotate-180': orgSelectOpen,
          }"
        />
      </UButton>

      <template #panel>
        <div class="flex w-48 flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
          <div class="p-1" @click="orgSelectOpen = !orgSelectOpen">
            <UButton
              v-for="organization in organizations"
              :key="organization.id"
              :label="organization.name"
              size="sm"
              :to="`/organizations/${organization.id}`"
              variant="ghost"
              class="w-full"
              @click="selectOrganization(organization.id)"
            >
              <UAvatar :alt="organization.name" size="xs" />
              <span class="truncate">{{ organization.name }}</span>
              <UIcon
                v-if="organization.id === selectedOrganization?.id"
                name="i-heroicons-check-20-solid"
                class="ml-auto h-4 w-4"
              />
            </UButton>
          </div>
          <div class="p-1">
            <UButton
              label="Create organization"
              icon="i-heroicons-plus"
              variant="ghost"
              class="w-full"
              to="/organizations/create"
            />
          </div>
        </div>
      </template>
    </UPopover>

    <template v-if="selectedOrganization">
      <TabButton :to="`/organizations/${selectedOrganization.id}`" label="Projects" />
      <TabButton :to="`/organizations/${selectedOrganization.id}/settings`" label="Settings" />
    </template>

    <div class="ml-auto flex items-center gap-4">
      <ClientOnly>
        <UButton
          :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
          color="neutral"
          variant="ghost"
          aria-label="Theme"
          @click="isDark = !isDark"
        />

        <template #fallback>
          <div class="h-8 w-8" />
        </template>
      </ClientOnly>

      <a href="https://docs.lagoss.com" rel="noopener noreferrer" target="_blank">
        <UButton label="Docs" size="xs" color="neutral" variant="outline" />
      </a>

      <UPopover v-if="user" class="flex items-center">
        <UAvatar :src="user.image || ''" alt="User avatar" size="sm" :initials="user.name" />

        <template #panel>
          <div class="flex w-48 flex-col items-center gap-2">
            <div class="my-4 flex flex-col items-center gap-2">
              <UAvatar :src="user.image || ''" alt="User avatar" size="xl" :initials="user.name" />
              <span>{{ user.name }}</span>
            </div>

            <div class="flex w-full flex-col border-t border-neutral-200 p-2 dark:border-neutral-800">
              <UButton label="Settings" variant="ghost" to="/settings" class="w-full" />
              <UButton label="Logout" variant="ghost" class="w-full" @click="logout" />
            </div>
          </div>
        </template>
      </UPopover>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  },
});

const { user, logout, selectOrganization } = await useAuth();

const { data: organizations } = await useFetch('/api/organizations', {
  transform: data => data.organizations,
});

const selectedOrganization = computed(() => {
  const organizationId = route.params.organizationId;
  if (!organizationId) {
    return undefined;
  }

  return organizations.value?.find(org => org.id === organizationId);
});

const orgSelectOpen = ref(false);
</script>
