export type Plan = {
  type: 'personal' | 'pro';
  id?: string;
  expired: boolean;
  maxFunctions: number;
  freeRequests: number;
  tickTimeout: number;
  totalTimeout: number;
  organizationMembers: number;
  maxAssetsPerFunction: number;
};

export const PERSONAL_PLAN: Plan = {
  type: 'personal',
  expired: false,
  maxFunctions: 10,
  freeRequests: 3000000,
  tickTimeout: 200,
  totalTimeout: 5000,
  organizationMembers: 1,
  maxAssetsPerFunction: 100,
};

export const PRO_PLAN: Plan = {
  type: 'pro',
  expired: false,
  maxFunctions: 50,
  freeRequests: 5000000,
  tickTimeout: 500,
  totalTimeout: 30000,
  organizationMembers: 10,
  maxAssetsPerFunction: 1000,
};

export const getPlanFromOrg = (org?: { plan?: string | null; planPeriodEnd?: Date | null }) => {
  if (org?.plan === 'pro') {
    return {
      ...PRO_PLAN,
      expired: new Date(org.planPeriodEnd ?? 0).getTime() < Date.now(),
    };
  }

  return PERSONAL_PLAN;
};
