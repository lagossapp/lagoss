<template>
  <div class="flex w-full flex-col">
    <div class="bg mx-auto flex w-full max-w-4xl flex-col">
      <div class="flex items-start gap-2">
        <div>
          <h1 class="text-3xl font-bold">Settings - {{ user?.name }}</h1>
          <p class="text-gray-500">{{}}</p>
        </div>
      </div>

      <!-- <span>TODO:</span>
      <ul>
        <li>general: name, email</li>
        <li>tokens</li>
        <li>delete</li>
      </ul> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = await useAuth();
</script>
