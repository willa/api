import { Inject, Service } from 'typedi'

import { db } from '..'
import { AuthResult } from '../types/graphql'
import { AccountService } from './account'
import { AuthService } from './auth'

@Service()
export class UserService {
  @Inject()
  auth!: AuthService

  @Inject()
  account!: AccountService

  async signIn(token: string): Promise<AuthResult> {
    const { email, name } = await this.auth.verifyToken(token)

    if (!email) {
      throw new Error('Email is required')
    }

    let user = await db.user.findOne({
      where: {
        email
      }
    })

    if (!user) {
      if (!name) {
        throw new Error('Name is required')
      }

      user = await db.user.create({
        data: {
          email,
          name
        }
      })

      await this.account.create(user, {
        currency: 'USD',
        name: 'Default'
      })
    }

    const jwt = this.auth.createToken(user)

    return {
      token: jwt,
      user
    }
  }
}
