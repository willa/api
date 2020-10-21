const { PORT } = process.env

import 'reflect-metadata'

import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { Container } from 'typedi'

import { authChecker, getUser } from './lib'
import { resolvers } from './resolvers'

export const db = new PrismaClient()

const main = async (): Promise<void> => {
  const schema = await buildSchema({
    authChecker,
    container: Container,
    dateScalarMode: 'isoDate',
    resolvers,
    validate: false
  })

  const server = new ApolloServer({
    context: async ({ req }) => ({
      user: await getUser(req)
    }),
    schema
  })

  const { url } = await server.listen(PORT)

  console.log(`Running on ${url}graphql`)
}

main()
