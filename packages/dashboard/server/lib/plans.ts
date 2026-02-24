import dayjs from 'dayjs';
import type { Organization } from '../db/schema';

export type Plan = {
  type: 'free' | 'pro';
  maxApps: number;
  freeRequests: number;
  tickTimeout: number;
  totalTimeout: number;
  organizationMembers: number;
  maxAssetsPerApp: number;
};

export const FREE_PLAN: Plan = {
  type: 'free',
  maxApps: 10,
  freeRequests: 3000000,
  tickTimeout: 200,
  totalTimeout: 5000,
  organizationMembers: 1,
  maxAssetsPerApp: 100,
};

export const PRO_PLAN: Plan = {
  type: 'pro',
  maxApps: 50,
  freeRequests: 5000000,
  tickTimeout: 500,
  totalTimeout: 30000,
  organizationMembers: 10,
  maxAssetsPerApp: 1000,
};

export function getPlanOfOrganization(organization: { plan: string; planPeriodEnd: string | Date | null }): Plan {
  if (organization.plan === 'pro' && dayjs().isBefore(organization.planPeriodEnd)) {
    return PRO_PLAN;
  }

  return FREE_PLAN;
}
