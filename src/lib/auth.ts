const { SALT_ROUNDS, TOKEN_SECRET } = process.env

import { AuthenticationError } from 'apollo-server'
import { compare, hash } from 'bcrypt'
import { Request } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'

import { db } from '..'
import { AuthToken, Context } from '../types'
import { User } from '../types/graphql'

const isMember = async (id: number, userId: number): Promise<boolean> => {
  const account = await db.account.findOne({
    include: {
      users: {
        select: {
          id: true
        },
        take: 1,
        where: {
          id: userId
        }
      }
    },
    where: {
      id
    }
  })

  if (!account) {
    return false
  }

  return !!account.users.find(({ id }) => id === userId)
}

export const authChecker: AuthChecker<Context, number> = async (
  { args: { accountId, itemId }, context: { user } },
  roles
): Promise<boolean> => {
  if (roles.includes(Roles.MEMBER)) {
    if (!user) {
      return false
    }

    if (itemId) {
      const item = await db.item.findOne({
        where: {
          id: itemId
        }
      })

      if (!item) {
        return false
      }

      return isMember(item.accountId, user.id)
    }

    return isMember(accountId, user.id)
  }

  return !!user
}

export enum Roles {
  MEMBER
}

class Auth {
  createToken(user: User): string {
    return sign(
      {
        id: user.id
      },
      TOKEN_SECRET
    )
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, Number(SALT_ROUNDS))
  }

  async comparePassword(user: User, password: string): Promise<boolean> {
    return compare(password, user.password)
  }

  async getUser(request: Request): Promise<User | undefined> {
    const authorization = request.headers.authorization

    if (!authorization) {
      return
    }

    const token = authorization.substr(7)

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
}

export const auth = new Auth()
