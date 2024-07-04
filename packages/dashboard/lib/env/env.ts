declare global {
  interface Window {
    env: Record<string, string | undefined>;
  }
}

export const getEnv = () => {
  const env = globalThis?.window?.env || process.env;

  return {
    LAGOSS_ROOT_SCHEM: env.LAGOSS_ROOT_SCHEM,
    LAGOSS_ROOT_DOMAIN: env.LAGOSS_ROOT_DOMAIN,
  };
};
