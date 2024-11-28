import dayjs from 'dayjs';
import type { Organization } from '../db/schema';

export type Plan = {
  type: 'free' | 'pro';
  maxProjects: number;
  freeRequests: number;
  tickTimeout: number;
  totalTimeout: number;
  organizationMembers: number;
  maxAssetsPerProject: number;
};

export const FREE_PLAN: Plan = {
  type: 'free',
  maxProjects: 10,
  freeRequests: 3000000,
  tickTimeout: 200,
  totalTimeout: 5000,
  organizationMembers: 1,
  maxAssetsPerProject: 100,
};

export const PRO_PLAN: Plan = {
  type: 'pro',
  maxProjects: 50,
  freeRequests: 5000000,
  tickTimeout: 500,
  totalTimeout: 30000,
  organizationMembers: 10,
  maxAssetsPerProject: 1000,
};

export function getPlanOfOrganization(organization: Organization) {
  if (organization.plan === 'pro' && dayjs().isBefore(organization.planPeriodEnd)) {
    return PRO_PLAN;
  }

  return FREE_PLAN;
}
