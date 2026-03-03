import type { InjectionKey, Ref } from 'vue';
import { inject as vueInject, provide as vueProvide } from 'vue';

import type { App, Organization } from '~/types';

export interface InjectKeys {
  app: Ref<App>;
  refreshApp: () => Promise<void>;
  org: Ref<Organization>;
  refreshOrg: () => Promise<void>;
}

export function typedInject<T extends keyof InjectKeys>(key: T): InjectKeys[T];
export function typedInject<T extends keyof InjectKeys>(key: T, required: true): InjectKeys[T];
export function typedInject<T extends keyof InjectKeys>(key: T, required: false): InjectKeys[T] | undefined;
export function typedInject<T extends keyof InjectKeys>(key: T, required = true): InjectKeys[T] | undefined {
  const value = vueInject<InjectKeys[T]>(key);
  if (value === undefined && required) {
    throw new Error(`Unexpected: ${key} should be provided at this place`);
  }
  return value;
}

export function typedProvide<T extends keyof InjectKeys>(key: T, value: InjectKeys[T]): void {
  return vueProvide(key, value as T extends InjectionKey<infer V> ? V : InjectKeys[T]);
}
