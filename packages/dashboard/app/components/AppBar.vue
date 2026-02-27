<template>
  <aside
    role="navigation"
    aria-label="Main navigation"
    class="flex h-screen w-60 shrink-0 flex-col bg-neutral-50 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700/10"
    style="box-shadow: 1px 0 0 0 rgb(0 0 0 / 0.08)"
  >
    <!-- Logo -->
    <div class="flex h-14 shrink-0 items-center gap-3 px-5">
      <router-link
        to="/"
        aria-label="Lagoss home"
        class="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        <div
          class="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-teal-400 to-teal-600 shadow-sm"
        >
          <img src="/icon-white.png" alt="" aria-hidden="true" class="w-4" />
        </div>
        <span class="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-white">Lagoss</span>
      </router-link>
    </div>

    <!-- Org switcher -->
    <div class="px-3 pb-1">
      <div v-if="selectedOrganization" ref="orgDropdownRef" class="relative">
        <button
          type="button"
          class="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          :aria-expanded="orgSelectOpen"
          aria-haspopup="listbox"
          @click="orgSelectOpen = !orgSelectOpen"
        >
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-teal-400/20 to-teal-600/20 text-[11px] font-bold uppercase text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/20"
            aria-hidden="true"
          >
            {{ selectedOrganization.name[0] }}
          </span>
          <div class="flex min-w-0 flex-1 flex-col">
            <span class="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
              >Organization</span
            >
            <span class="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-100">{{
              selectedOrganization.name
            }}</span>
          </div>
          <svg
            class="h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-500 transition-transform duration-200"
            :class="{ 'rotate-180': orgSelectOpen }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
        </button>

        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-1 opacity-0"
        >
          <div
            v-if="orgSelectOpen"
            role="listbox"
            class="absolute left-0 top-full z-50 mt-1 w-full origin-top rounded-xl border border-neutral-100 bg-white dark:border-white/8 dark:bg-neutral-900 p-1.5 shadow-lg shadow-neutral-200/50 dark:shadow-black/30"
          >
            <router-link
              v-for="organization in organizations"
              :key="organization.id"
              :to="`/organizations/${organization.id}`"
              role="option"
              :aria-selected="organization.id === selectedOrganization?.id"
              class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 transition-colors"
              :class="
                organization.id === selectedOrganization?.id
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-neutral-100'
              "
              @click="
                selectOrganization(organization.id);
                orgSelectOpen = false;
              "
            >
              <span
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-100 text-[10px] font-bold uppercase text-teal-600 dark:bg-teal-500/20 dark:text-teal-400"
                aria-hidden="true"
              >
                {{ organization.name[0] }}
              </span>
              <span class="flex-1 truncate font-medium">{{ organization.name }}</span>
              <svg
                v-if="organization.id === selectedOrganization?.id"
                class="h-3.5 w-3.5 shrink-0 text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </router-link>

            <div class="my-1.5 h-px bg-neutral-100 dark:bg-white/8" role="separator" />

            <router-link
              to="/organizations/create"
              class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-neutral-100 dark:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 transition-colors"
              @click="orgSelectOpen = false"
            >
              <span
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500"
              >
                <svg
                  class="h-3.5 w-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
              New organization
            </router-link>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Divider -->
    <div class="mx-3 my-2 h-px bg-neutral-100 dark:bg-white/6" />

    <!-- Nav items -->
    <nav v-if="selectedOrganization" class="flex flex-col gap-0.5 px-3" aria-label="Organization navigation">
      <p class="mb-1 px-2.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
        Menu
      </p>
      <NavLink :to="`/organizations/${selectedOrganization.id}`" :exact="true" variant="sidebar">
        <svg
          class="h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.75"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
        Apps
      </NavLink>

      <NavLink :to="`/organizations/${selectedOrganization.id}/settings`" variant="sidebar">
        <svg
          class="h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.75"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
          />
        </svg>
        Settings
      </NavLink>
    </nav>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Bottom section -->
    <div class="px-3 pb-4">
      <!-- Divider -->
      <div class="mb-2 h-px bg-gray-100 dark:bg-white/6" />

      <div class="flex flex-col gap-0.5">
        <!-- Docs -->
        <a
          href="https://docs.lagoss.com"
          rel="noopener noreferrer"
          target="_blank"
          class="flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <svg
            class="h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.75"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
          Documentation
          <svg
            class="ml-auto h-3 w-3 shrink-0 text-gray-300 dark:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </a>

        <!-- GitHub -->
        <a
          href="https://github.com/lagossapp/lagoss"
          rel="noopener noreferrer"
          target="_blank"
          class="flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <svg class="h-4 w-4 fill-gray-600 dark:fill-gray-300" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
          Source & issues
          <svg
            class="ml-auto h-3 w-3 shrink-0 text-gray-300 dark:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </a>

        <!-- Theme toggle -->
        <ClientOnly>
          <button
            type="button"
            class="flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="isDark = !isDark"
          >
            <svg
              v-if="isDark"
              class="h-4 w-4 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
            <svg
              v-else
              class="h-4 w-4 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
            {{ isDark ? 'Light mode' : 'Dark mode' }}
          </button>

          <template #fallback>
            <div class="h-9" aria-hidden="true" />
          </template>
        </ClientOnly>
      </div>

      <!-- User row -->
      <div v-if="user" ref="userDropdownRef" class="relative mt-2">
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-xl border border-gray-100 dark:border-white/8 px-2.5 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          :class="userMenuOpen ? 'bg-gray-50 dark:bg-white/6' : 'hover:bg-gray-50 dark:hover:bg-white/5'"
          :aria-expanded="userMenuOpen"
          aria-haspopup="menu"
          @click="userMenuOpen = !userMenuOpen"
        >
          <img
            v-if="user.image"
            :src="user.image"
            :alt="user.name || ''"
            class="h-7 w-7 shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
          />
          <span
            v-else
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-400 to-teal-600 text-xs font-semibold text-white"
            aria-hidden="true"
          >
            {{ (user.name || 'U')?.[0]?.toUpperCase() }}
          </span>
          <div class="flex min-w-0 flex-1 flex-col">
            <span class="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{{ user.name }}</span>
            <span class="truncate text-[11px] text-gray-400 dark:text-gray-500">{{ user.email }}</span>
          </div>
          <svg
            class="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200"
            :class="{ 'rotate-180': userMenuOpen }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
        </button>

        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-1 opacity-0"
        >
          <div
            v-if="userMenuOpen"
            role="menu"
            class="absolute bottom-full left-0 z-50 mb-1.5 w-full origin-bottom-left rounded-xl border border-neutral-200 bg-white dark:border-white/8 dark:bg-neutral-900 p-1.5 shadow-lg shadow-neutral-900/8 dark:shadow-black/40"
          >
            <router-link
              to="/settings"
              role="menuitem"
              class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 transition-colors"
              @click="userMenuOpen = false"
            >
              <svg
                class="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.75"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              Account settings
            </router-link>

            <div class="my-1.5 h-px bg-gray-100 dark:bg-white/8" role="separator" />

            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:text-red-400/80 dark:hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 transition-colors"
              @click="
                logout();
                userMenuOpen = false;
              "
            >
              <svg
                class="h-4 w-4 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.75"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              Log out
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </aside>
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

const { data: organizations } = await useFetch('/api/organizations');

const selectedOrganization = computed(() => {
  const organizationId = route.params.organizationId;
  if (!organizationId) return undefined;
  return organizations.value?.find(org => org.id === organizationId);
});

const orgSelectOpen = ref(false);
const userMenuOpen = ref(false);
const orgDropdownRef = ref<HTMLElement | null>(null);
const userDropdownRef = ref<HTMLElement | null>(null);

function handleOutsideClick(event: MouseEvent) {
  if (orgDropdownRef.value && !orgDropdownRef.value.contains(event.target as Node)) {
    orgSelectOpen.value = false;
  }
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target as Node)) {
    userMenuOpen.value = false;
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick));
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick));
</script>
