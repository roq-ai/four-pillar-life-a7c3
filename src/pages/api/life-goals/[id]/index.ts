import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { lifeGoalValidationSchema } from 'validationSchema/life-goals';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.life_goal
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getLifeGoalById();
    case 'PUT':
      return updateLifeGoalById();
    case 'DELETE':
      return deleteLifeGoalById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLifeGoalById() {
    const data = await prisma.life_goal.findFirst(convertQueryToPrismaUtil(req.query, 'life_goal'));
    return res.status(200).json(data);
  }

  async function updateLifeGoalById() {
    await lifeGoalValidationSchema.validate(req.body);
    const data = await prisma.life_goal.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteLifeGoalById() {
    const data = await prisma.life_goal.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
