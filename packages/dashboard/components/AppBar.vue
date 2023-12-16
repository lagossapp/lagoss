<template>
  <header
    class="border-b-1 sticky top-0 z-40 flex w-full items-center justify-between border-transparent px-4 py-4 backdrop-blur"
  >
    <router-link to="/">
      <img src="/icon-black.png" alt="Icon" class="w-6 dark:hidden" />
      <img src="/icon-white.png" alt="Dark icon" class="hidden w-6 dark:block" />
    </router-link>

    <div class="flex items-center gap-2">
      <a href="">
        <UButton label="Docs" size="xs" color="white" />
      </a>

      <UPopover v-if="user">
        <UAvatar :src="user?.image || ''" alt="User avatar" size="sm" :initials="user?.name" />

        <template #panel>
          <div class="min-w-md flex w-full flex-col p-4">
            <UAvatar :src="user?.image || ''" alt="User avatar" size="xl" :initials="user?.name" />
            <p>{{ user.name }}</p>

            <UButton label="Settings" size="xs" color="white" />
            <UButton label="Logout" size="xs" color="white" @click="logout" />
          </div>
        </template>
      </UPopover>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, logout } = await useAuth();
</script>
