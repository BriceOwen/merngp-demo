import { UserInputError } from 'apollo-server';
import { MutationResolvers } from '../../generated/graphqlgen';
import { checkAuth } from '../../util/check-auth';

const createPost: MutationResolvers.CreatePostResolver = async (
  parent,
  { body },
  ctx
) => {
  const userId = checkAuth(ctx);

  if (body.trim() === '') {
    throw new UserInputError('Post body must not be empty', {
      errors: {
        body: 'Post body must not be empty',
      },
    });
  }
  return ctx.prisma.createPost({
    body,
    author: {
      connect: {
        id: userId,
      },
    },
  });
};

const deletePost: MutationResolvers.DeletePostResolver = async (
  parent,
  { postId },
  ctx
) => {
  const userId = checkAuth(ctx);

  const exists = await ctx.prisma.$exists.post({
    id: postId,
    author: { id: userId },
  });

  if (!exists) {
    throw new UserInputError('Post not found');
  }

  return ctx.prisma.deletePost({
    id: postId,
  });
};

const createComment: MutationResolvers.CreateCommentResolver = async (
  parent,
  { postId, body },
  ctx
) => {
  if (body.trim() === '') {
    throw new UserInputError('Comment body must not be empty', {
      errors: {
        body: 'Comment body must not be empty',
      },
    });
  }

  const userId = checkAuth(ctx);
  const post = await ctx.prisma.post({ id: postId });
  if (!post) {
    throw new UserInputError('Post not found');
  }

  return ctx.prisma.createComment({
    body,
    post: {
      connect: {
        id: post.id,
      },
    },
    author: {
      connect: {
        id: userId,
      },
    },
  });
};

const deleteComment: MutationResolvers.DeleteCommentResolver = async (
  parent,
  { postId, commentId },
  ctx
) => {
  const userId = checkAuth(ctx);

  const exists = await ctx.prisma.$exists.comment({
    id: commentId,
    author: { id: userId },
  });

  if (!exists) {
    throw new UserInputError('Action not allowed');
  }

  return ctx.prisma.deleteComment({
    id: commentId,
  });
};

const likePost: MutationResolvers.LikePostResolver = async (
  parent,
  { postId },
  ctx
) => {
  const userId = checkAuth(ctx);

  const postExists = await ctx.prisma.$exists.post({ id: postId });

  if (!postExists) {
    throw new UserInputError('Post not found');
  }

  const like = await ctx.prisma
    .post({
      id: postId,
    })
    .likes({ where: { author: { id: userId } } });

  if (like.length > 0) {
    // Post already likes, unlike it
    return ctx.prisma.deleteLike({ id: like[0].id });
  } else {
    // Not like, liked post
    const like = await ctx.prisma.createLike({
      post: { connect: { id: postId } },
      author: { connect: { id: userId } },
    });

    return like;
  }
};

export const post = {
  createPost,
  deletePost,
  createComment,
  deleteComment,
  likePost,
};
