import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from 'lib/stripe';
import type Stripe from 'stripe';
import prisma from 'lib/prisma';
import { Readable } from 'node:stream';
import { upgradeFunctions } from 'lib/api/deployments';
import { getPlanFromOrg } from 'lib/plans';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      req.headers['stripe-signature'] as string,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.log(err);
    return res.status(400).end();
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    const organizationId = session.metadata!.organizationId;
    const priceId = subscription.items.data[0].price.id;
    const isPro = priceId !== undefined && priceId === process.env.STRIPE_PRO_PLAN_PRICE_ID;
    const plan = isPro ? 'pro' : 'personal';
    const planPeriodEnd = new Date(subscription.current_period_end * 1000);

    await prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        plan,
        planPeriodEnd,
      },
    });

    await upgradeFunctions({
      plan: getPlanFromOrg({
        plan,
        planPeriodEnd,
      }),
      organizationId,
    });
  }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await prisma.organization.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        planPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  res.json({ received: true });
}
