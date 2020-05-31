import * as jwt from 'jsonwebtoken';
import { User } from '../generated/prisma-client';

export const generateToken = (user: User, expiresIn: string) => {
  return jwt.sign(
    { userId: user.id, email: user.email, username: user.username },
    process.env.APP_SECRET,
    { expiresIn }
  );
};
