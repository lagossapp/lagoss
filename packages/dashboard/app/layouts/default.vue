<template>
  <div class="flex h-screen w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
    <AppBar />
    <main class="flex flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable]">
      <div class="flex w-full flex-1 flex-col p-6 lg:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
