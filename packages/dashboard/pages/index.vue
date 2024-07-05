<template>
  <div class="flex w-full flex-col">
    <div class="bg mx-auto flex w-full max-w-4xl flex-col">
      <h1 class="text-3xl font-bold">👋 Welcome to Lagoss</h1>

      <p class="mt-4 text-gray-800 dark:text-gray-200">
        Lagoss is a serverless platform for building and deploying web applications. It's like Heroku, but for
        Functions.
      </p>

      <div class="mt-4">
        <h2 class="text-xl font-bold">Organizations</h2>
        <div class="mt-2 flex flex-row flex-wrap gap-4">
          <router-link
            v-for="organization in organizations"
            :key="organization.id"
            :to="`/organizations/${organization.id}`"
            class="w-full max-w-sm"
          >
            <Card
              class="flex w-full cursor-pointer items-center justify-between hover:border-gray-500 hover:dark:border-gray-200"
            >
              <div>
                <p>{{ organization.name }}</p>
                <p class="text-sm text-gray-500">{{ organization.description }}</p>
              </div>
            </Card>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data: organizations } = await useFetch(() => `/api/organizations`);
</script>
