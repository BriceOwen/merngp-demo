import { ApolloServer } from 'apollo-server';
// import { makeExecutableSchema } from 'graphql-tools';
// import { makeExecutableSchema } from 'graphql-tools';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import { prisma } from './generated/prisma-client';
import { resolvers } from './resolvers';

const typeDefs = importSchema('./src/schema.graphql');

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return {
      req,
      prisma,
    };
  },
});
server.listen({ port: 5000 }).then((res) => {
  console.log(`Server is running on http://localhost:${res.port}`);
});
