import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

const apiToken = process.env.LAGOSS_API_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  if (req.headers.authorization !== `Bearer ${apiToken}`) {
    return res.status(401).end();
  }

  // SELECT
  //   Deployment.id,
  //   Deployment.isProduction,
  //   Deployment.assets,
  //   Function.id,
  //   Function.name,
  //   Function.memory,
  //   Function.tickTimeout,
  //   Function.totalTimeout,
  //   Function.cron,
  //   Domain.domain,
  //   EnvVariable.key,
  //   EnvVariable.value
  // FROM
  //   Deployment
  // INNER JOIN Function
  //   ON Deployment.functionId = Function.id
  // LEFT JOIN Domain
  //   ON Function.id = Domain.functionId
  // LEFT JOIN EnvVariable
  //   ON Function.id = EnvVariable.functionId
  // WHERE
  //   Function.cron IS NULL
  // OR
  //   Function.cronRegion = '{}'

  const cronRegion = req.headers['x-lagoss-region'] as string;

  const deployments = await prisma.deployment.findMany({
    where: cronRegion
      ? {
          OR: [
            {
              function: {
                cron: null,
              },
            },
            {
              function: {
                cronRegion: cronRegion,
              },
            },
          ],
        }
      : undefined,

    include: {
      function: {
        include: {
          domains: true,
          env: true,
        },
      },
    },
  });

  res.json(
    deployments.map(d => {
      return {
        id: d.id,
        isProduction: d.isProduction,
        assets: d.assets,
        functionId: d.function.id,
        functionName: d.function.name,
        memory: d.function.memory,
        tickTimeout: d.function.tickTimeout,
        totalTimeout: d.function.totalTimeout,
        cron: d.function.cron,
        domains: d.function.domains.map(d => d.domain),
        env: d.function.env.reduce(
          (acc, e) => {
            return { ...acc, [e.key]: e.value };
          },
          {} as Record<string, string>,
        ),
      };
    }),
  );
}
