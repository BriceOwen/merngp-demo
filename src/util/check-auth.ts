import * as jwt from 'jsonwebtoken';
import { Prisma } from '../generated/prisma-client';
import { AuthenticationError } from 'apollo-server';

export interface Context {
  prisma: Prisma;
  req: any;
}

export function checkAuth(ctx: Context) {
  // console.log(ctx);
  const Authorization = ctx.req.headers.authorization;
  //console.log(ctx.req);

  // const Authorization = ctx.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    try {
      const { userId } = jwt.verify(token, process.env.APP_SECRET) as {
        userId: string;
      };
      return userId;
    } catch (error) {
      throw new AuthenticationError('Invalid or Expired token');
    }
  }
  throw new Error('Authorization header must be provided');
}

export class AuthError extends Error {
  constructor() {
    super('Not authorized');
  }
}
