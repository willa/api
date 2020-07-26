const { PORT } = process.env

import 'reflect-metadata'

import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { Container } from 'typedi'

import { auth, authChecker } from './lib'
import { resolvers } from './resolvers'
import { Context } from './types'

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
    context: async ({ req }): Promise<Context> => ({
      user: await auth.getUser(req)
    }),
    schema
  })

  await server.listen(PORT)

  console.log(`Running on ${PORT}`)
}

main()
