import 'next-auth';

declare module 'next-auth' {
  interface Session {
    organization: {
      id: string;
      name: string;
      description?: string;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string | null;
      plan: string | null;
      planPeriodEnd: Date | null;
      createdAt: Date;
    };
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}
