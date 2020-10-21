import { Inject, Service } from 'typedi'
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator'

import { db } from '..'
import { AuthResult } from '../types/graphql'
import { AccountType } from '../types/models'
import { AccountService } from './account'
import { AuthService } from './auth'

@Service()
export class UserService {
  @Inject()
  auth!: AuthService

  @Inject()
  account!: AccountService

  async signIn(token: string): Promise<AuthResult> {
    const email = await this.auth.verifyToken(token)

    if (!email) {
      throw new Error('Email is required')
    }

    let user = await db.user.findOne({
      where: {
        email
      }
    })

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: this.generateName()
        }
      })

      await this.account.create(user, {
        currency: 'USD',
        name: 'Expenses',
        type: AccountType.EXPENSE
      })

      await this.account.create(user, {
        currency: 'USD',
        name: 'Savings',
        type: AccountType.SAVINGS
      })
    }

    const jwt = this.auth.createToken(user)

    return {
      token: jwt,
      user
    }
  }

  private generateName(): string {
    return uniqueNamesGenerator({
      dictionaries: [colors, animals],
      separator: '-'
    })
  }
}
