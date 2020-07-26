const { SALT_ROUNDS, TOKEN_SECRET } = process.env

import { AuthenticationError } from 'apollo-server'
import { compare, hash } from 'bcrypt'
import { Request } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'

import { db } from '..'
import { AuthToken, Context } from '../types'
import { User } from '../types/type-graphql'

export const authChecker: AuthChecker<Context, number> = async ({
  context: { user }
}): Promise<boolean> => !!user

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
