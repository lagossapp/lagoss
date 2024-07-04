import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = {
    LAGOSS_ROOT_SCHEM: process.env.LAGOSS_ROOT_SCHEM,
    LAGOSS_ROOT_DOMAIN: process.env.LAGOSS_ROOT_DOMAIN,
  };

  res
    .status(200)
    .setHeader('Content-Type', 'application/javascript')
    .end(
      `
(function() {
  window.env = {...window.env, ...${JSON.stringify(config)} };
})();
`,
    );
}
