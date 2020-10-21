const { TOKEN_SECRET } = process.env

import { User } from '@prisma/client'
import { AuthenticationError } from 'apollo-server'
import { Request } from 'express'
import { verify } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'

import { db } from '..'
import { AuthToken, Context, Roles } from '../types'

export const authChecker: AuthChecker<Context> = async (
  { args: { accountId, itemId }, context: { user } },
  roles
): Promise<boolean> => {
  if (roles.length > 0) {
    if (!user) {
      return false
    }

    if (roles.includes(Roles.ACCOUNT_MEMBER)) {
      const account = await db.account.findOne({
        include: {
          users: true
        },
        where: {
          id: accountId
        }
      })

      return !!account?.users.find(({ id }) => id === user.id)
    }

    if (roles.includes(Roles.ITEM_MEMBER)) {
      const item = await db.item.findOne({
        include: {
          account: {
            include: {
              users: true
            }
          }
        },
        where: {
          id: itemId
        }
      })

      return !!item?.account.users.find(({ id }) => id === user.id)
    }
  }

  return !!user
}

export const getUser = async (request: Request): Promise<User | undefined> => {
  const header = request.cookies?.token || request.headers?.authorization

  if (!header) {
    return
  }

  const token = header.substr(7)

  if (!token) {
    throw new AuthenticationError('Invalid token')
  }

  const { id } = verify(token, TOKEN_SECRET) as AuthToken

  if (!id) {
    throw new AuthenticationError('Invalid token')
  }

  const user = await db.user.findOne({
    where: {
      id
    }
  })

  if (!user) {
    throw new AuthenticationError('User not found')
  }

  return user
}
