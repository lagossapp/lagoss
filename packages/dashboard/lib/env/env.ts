declare global {
  interface Window {
    env: Record<string, string | undefined>;
  }
}

export const getEnv = () => globalThis?.window?.env || process.env;
