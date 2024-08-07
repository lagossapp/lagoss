import NextAuth, { Session, NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from 'lib/prisma';
import { createOrAssignDefaultOrganization } from 'lib/api/users';
import { sendWelcomeEmail } from 'lib/smtp';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    signIn: async ({ user }) => {
      if (!user.email) {
        return false;
      }

      if (process.env.LAGOSS_RESTRICT_LOGIN === 'false') {
        return true;
      }

      const isAuthorized = await prisma.authorizedEmail.count({
        where: {
          email: user.email,
        },
      });

      if (isAuthorized != 0) {
        return true;
      }

      console.log('User is not authorized to sign in:', user.email);

      return false;
    },
    session: async ({ session, token }) => {
      const userFromDB = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          currentOrganizationId: true,
        },
      });

      if (!userFromDB) {
        throw new Error('User not found');
      }

      let currentOrganizationId = userFromDB.currentOrganizationId;

      if (!currentOrganizationId) {
        currentOrganizationId = await createOrAssignDefaultOrganization({
          email: userFromDB.email,
          id: userFromDB.id,
          name: userFromDB.name,
        });
      }

      const organization = await prisma.organization.findFirst({
        where: {
          id: currentOrganizationId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          stripeSubscriptionId: true,
          stripeCustomerId: true,
          plan: true,
          planPeriodEnd: true,
          createdAt: true,
        },
      });

      return {
        ...session,
        user: {
          id: userFromDB.id,
          name: userFromDB.name,
          email: userFromDB.email,
        },
        organization,
      } as Session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      await createOrAssignDefaultOrganization({
        email: user.email,
        id: user.id,
        name: user.name,
      });

      if (user.email && user.name) {
        await sendWelcomeEmail({
          to: user.email,
          name: user.name,
        });
      }
    },
  },
};

export default NextAuth(authOptions);
