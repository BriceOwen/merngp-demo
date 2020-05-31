import { Prisma, User } from './generated/prisma-client';

export interface Context {
  prisma: Prisma;
  req: any;
}

export interface AuthPayload {
  token: string;
  user: User;
}
