import * as bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server';

import { MutationResolvers } from '../../generated/graphqlgen';
import { generateToken } from '../../util/utils';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../../util/validators';

const register: MutationResolvers.RegisterResolver = async (
  parent,
  args,
  ctx
) => {
  const { valid, errors } = validateRegisterInput(
    args.registerInput.username,
    args.registerInput.email,
    args.registerInput.password
  );
  if (!valid) {
    throw new UserInputError('Errors', { errors });
  }

  const usernameExists = await ctx.prisma.$exists.user({
    username: args.registerInput.username,
  });
  if (usernameExists) {
    throw new UserInputError('Username is taken', {
      errors: {
        username: 'This username is taken',
      },
    });
  }

  const emailExists = await ctx.prisma.$exists.user({
    email: args.registerInput.email,
  });
  if (emailExists) {
    throw new UserInputError('Email is taken', {
      errors: {
        email: 'This email is taken',
      },
    });
  }

  const password = await bcrypt.hash(args.registerInput.password, 10);
  const user = await ctx.prisma.createUser({
    ...args.registerInput,
    password,
  });

  const token = generateToken(user, '1hr');

  return {
    token,
    user,
  };
};

const login: MutationResolvers.LoginResolver = async (
  parent,
  { username, password },
  ctx
) => {
  const { valid, errors } = validateLoginInput(username, password);
  if (!valid) {
    throw new UserInputError('Errors', { errors });
  }

  const user = await ctx.prisma.user({ username });
  if (!user) {
    throw new UserInputError('User not found', {
      errors: {
        general: 'User not found',
      },
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new UserInputError('Wrong crendentials', {
      errors: {
        general: 'Wrong crendentials',
      },
    });
  }

  const token = generateToken(user, '1hr');

  return {
    token,
    user,
  };
};

export const auth = {
  register,
  login,
};
